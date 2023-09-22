package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportalshub/backend/database"
	"github.com/pektezol/leastportalshub/backend/models"
)

type MapSummaryResponse struct {
	Map     models.Map        `json:"map"`
	Summary models.MapSummary `json:"summary"`
}

type MapLeaderboardsResponse struct {
	Map        models.Map        `json:"map"`
	Records    any               `json:"records"`
	Pagination models.Pagination `json:"pagination"`
}

type ChaptersResponse struct {
	Game     models.Game      `json:"game"`
	Chapters []models.Chapter `json:"chapters"`
}

type ChapterMapsResponse struct {
	Chapter models.Chapter    `json:"chapter"`
	Maps    []models.MapShort `json:"maps"`
}

type RecordSingleplayer struct {
	Placement  int                        `json:"placement"`
	RecordID   int                        `json:"record_id"`
	ScoreCount int                        `json:"score_count"`
	ScoreTime  int                        `json:"score_time"`
	User       models.UserShortWithAvatar `json:"user"`
	DemoID     string                     `json:"demo_id"`
	RecordDate time.Time                  `json:"record_date"`
}

type RecordMultiplayer struct {
	Placement     int                        `json:"placement"`
	RecordID      int                        `json:"record_id"`
	ScoreCount    int                        `json:"score_count"`
	ScoreTime     int                        `json:"score_time"`
	Host          models.UserShortWithAvatar `json:"host"`
	Partner       models.UserShortWithAvatar `json:"partner"`
	HostDemoID    string                     `json:"host_demo_id"`
	PartnerDemoID string                     `json:"partner_demo_id"`
	RecordDate    time.Time                  `json:"record_date"`
}

// GET Map Summary
//
//	@Description	Get map summary with specified id.
//	@Tags			maps
//	@Produce		json
//	@Param			id	path		int	true	"Map ID"
//	@Success		200	{object}	models.Response{data=MapSummaryResponse}
//	@Failure		400	{object}	models.Response
//	@Router			/maps/{id}/summary [get]
func FetchMapSummary(c *gin.Context) {
	id := c.Param("id")
	response := MapSummaryResponse{Map: models.Map{}, Summary: models.MapSummary{Routes: []models.MapRoute{}}}
	intID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	// Get map data
	response.Map.ID = intID
	sql := `SELECT m.id, g.name, c.name, m.name, m.image, g.is_coop
	FROM maps m
	INNER JOIN games g ON m.game_id = g.id
	INNER JOIN chapters c ON m.chapter_id = c.id
	WHERE m.id = $1`
	err = database.DB.QueryRow(sql, id).Scan(&response.Map.ID, &response.Map.GameName, &response.Map.ChapterName, &response.Map.MapName, &response.Map.Image, &response.Map.IsCoop)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	// Get map routes and histories
	sql = `SELECT r.id, c.id, c.name, h.user_name, h.score_count, h.record_date, r.description, r.showcase, COALESCE(avg(rating), 0.0) FROM map_routes r
    INNER JOIN categories c ON r.category_id = c.id
    INNER JOIN map_history h ON r.map_id = h.map_id AND r.category_id = h.category_id
    LEFT JOIN map_ratings rt ON r.map_id = rt.map_id AND r.category_id = rt.category_id 
	WHERE r.map_id = $1 AND h.score_count = r.score_count GROUP BY r.id, c.id, h.user_name, h.score_count, h.record_date, r.description, r.showcase
	ORDER BY h.record_date ASC;`
	rows, err := database.DB.Query(sql, id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	for rows.Next() {
		route := models.MapRoute{Category: models.Category{}, History: models.MapHistory{}}
		err = rows.Scan(&route.RouteID, &route.Category.ID, &route.Category.Name, &route.History.RunnerName, &route.History.ScoreCount, &route.History.Date, &route.Description, &route.Showcase, &route.Rating)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		// Get completion count
		if response.Map.IsCoop {
			sql = `SELECT count(*) FROM ( SELECT host_id, partner_id, score_count, score_time,
				ROW_NUMBER() OVER (PARTITION BY host_id, partner_id ORDER BY score_count, score_time) AS rn
				FROM records_mp WHERE map_id = $1
				) sub WHERE sub.rn = 1 AND score_count = $2`
			err = database.DB.QueryRow(sql, response.Map.ID, route.History.ScoreCount).Scan(&route.CompletionCount)
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
		} else {
			sql = `SELECT count(*) FROM ( SELECT user_id, score_count, score_time, 
				ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY score_count, score_time) AS rn
				FROM records_sp WHERE map_id = $1
				) sub WHERE rn = 1 AND score_count = $2`
			err = database.DB.QueryRow(sql, response.Map.ID, route.History.ScoreCount).Scan(&route.CompletionCount)
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
		}
		response.Summary.Routes = append(response.Summary.Routes, route)
	}
	// Return response
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved map summary.",
		Data:    response,
	})
}

// GET Map Leaderboards
//
//	@Description	Get map leaderboards with specified id.
//	@Tags			maps
//	@Produce		json
//	@Param			id			path		int	true	"Map ID"
//	@Param			page		query		int	false	"Page Number (default: 1)"
//	@Param			pageSize	query		int	false	"Number of Records Per Page (default: 20)"
//	@Success		200			{object}	models.Response{data=MapLeaderboardsResponse}
//	@Failure		400			{object}	models.Response
//	@Router			/maps/{id}/leaderboards [get]
func FetchMapLeaderboards(c *gin.Context) {
	id := c.Param("id")
	// Get map data
	response := MapLeaderboardsResponse{Map: models.Map{}, Records: nil, Pagination: models.Pagination{}}
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil || page < 1 {
		page = 1
	}
	pageSize, err := strconv.Atoi(c.DefaultQuery("pageSize", "20"))
	if err != nil || pageSize < 1 {
		pageSize = 20
	}
	var isDisabled bool
	intID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	response.Map.ID = intID
	sql := `SELECT g.name, c.name, m.name, is_disabled, m.image, g.is_coop
	FROM maps m
	INNER JOIN games g ON m.game_id = g.id
	INNER JOIN chapters c ON m.chapter_id = c.id
	WHERE m.id = $1`
	err = database.DB.QueryRow(sql, id).Scan(&response.Map.GameName, &response.Map.ChapterName, &response.Map.MapName, &isDisabled, &response.Map.Image, &response.Map.IsCoop)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	if isDisabled {
		c.JSON(http.StatusBadRequest, models.ErrorResponse("Map is not available for competitive boards."))
		return
	}
	totalRecords := 0
	totalPages := 0
	if response.Map.GameName == "Portal 2 - Cooperative" {
		records := []RecordMultiplayer{}
		sql = `SELECT
		sub.id,
		sub.host_id,
		host.user_name AS host_user_name,
		host.avatar_link AS host_avatar_link,
		sub.partner_id,
		partner.user_name AS partner_user_name,
		partner.avatar_link AS partner_avatar_link,
		sub.score_count,
		sub.score_time,
		sub.host_demo_id,
		sub.partner_demo_id,
		sub.record_date
	FROM (
		SELECT
			id,
			host_id,
			partner_id,
			score_count,
			score_time,
			host_demo_id,
			partner_demo_id,
			record_date,
			ROW_NUMBER() OVER (PARTITION BY host_id, partner_id ORDER BY score_count, score_time) AS rn
		FROM records_mp
		WHERE map_id = $1
	) sub
	JOIN users AS host ON sub.host_id = host.steam_id 
	JOIN users AS partner ON sub.partner_id = partner.steam_id 
	WHERE sub.rn = 1
	ORDER BY score_count, score_time`
		rows, err := database.DB.Query(sql, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		placement := 1
		ties := 0
		for rows.Next() {
			var record RecordMultiplayer
			err := rows.Scan(&record.RecordID, &record.Host.SteamID, &record.Host.UserName, &record.Host.AvatarLink, &record.Partner.SteamID, &record.Partner.UserName, &record.Partner.AvatarLink, &record.ScoreCount, &record.ScoreTime, &record.HostDemoID, &record.PartnerDemoID, &record.RecordDate)
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
			if len(records) != 0 && records[len(records)-1].ScoreCount == record.ScoreCount && records[len(records)-1].ScoreTime == record.ScoreTime {
				ties++
				record.Placement = placement - ties
			} else {
				record.Placement = placement
			}
			records = append(records, record)
			placement++
		}
		totalRecords = len(records)
		totalPages = (totalRecords + pageSize - 1) / pageSize
		if page > totalPages {
			c.JSON(http.StatusBadRequest, models.ErrorResponse("Invalid page number."))
			return
		}
		startIndex := (page - 1) * pageSize
		endIndex := startIndex + pageSize
		if endIndex > totalRecords {
			endIndex = totalRecords
		}
		response.Records = records[startIndex:endIndex]
	} else {
		records := []RecordSingleplayer{}
		sql = `SELECT id, user_id, users.user_name, users.avatar_link, score_count, score_time, demo_id, record_date
		FROM (
		  SELECT id, user_id, score_count, score_time, demo_id, record_date,
				 ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY score_count, score_time) AS rn
		  FROM records_sp
		  WHERE map_id = $1
		) sub
		INNER JOIN users ON user_id = users.steam_id
		WHERE rn = 1
		ORDER BY score_count, score_time`
		rows, err := database.DB.Query(sql, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		placement := 1
		ties := 0
		for rows.Next() {
			var record RecordSingleplayer
			err := rows.Scan(&record.RecordID, &record.User.SteamID, &record.User.UserName, &record.User.AvatarLink, &record.ScoreCount, &record.ScoreTime, &record.DemoID, &record.RecordDate)
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
			if len(records) != 0 && records[len(records)-1].ScoreCount == record.ScoreCount && records[len(records)-1].ScoreTime == record.ScoreTime {
				ties++
				record.Placement = placement - ties
			} else {
				record.Placement = placement
			}
			records = append(records, record)
			placement++
		}
		totalRecords = len(records)
		totalPages = (totalRecords + pageSize - 1) / pageSize
		if page > totalPages {
			c.JSON(http.StatusBadRequest, models.ErrorResponse("Invalid page number."))
			return
		}
		startIndex := (page - 1) * pageSize
		endIndex := startIndex + pageSize
		if endIndex > totalRecords {
			endIndex = totalRecords
		}
		response.Records = records[startIndex:endIndex]
	}
	response.Pagination = models.Pagination{
		TotalRecords: totalRecords,
		TotalPages:   totalPages,
		CurrentPage:  page,
		PageSize:     pageSize,
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved map leaderboards.",
		Data:    response,
	})
}

// GET Games
//
//	@Description	Get games from the leaderboards.
//	@Tags			games & chapters
//	@Produce		json
//	@Success		200	{object}	models.Response{data=[]models.Game}
//	@Failure		400	{object}	models.Response
//	@Router			/games [get]
func FetchGames(c *gin.Context) {
	rows, err := database.DB.Query(`SELECT id, name, is_coop FROM games`)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	var games []models.Game
	for rows.Next() {
		var game models.Game
		if err := rows.Scan(&game.ID, &game.Name, &game.IsCoop); err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		games = append(games, game)
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved games.",
		Data:    games,
	})
}

// GET Chapters of a Game
//
//	@Description	Get chapters from the specified game id.
//	@Tags			games & chapters
//	@Produce		json
//	@Param			id	path		int	true	"Game ID"
//	@Success		200	{object}	models.Response{data=ChaptersResponse}
//	@Failure		400	{object}	models.Response
//	@Router			/games/{id} [get]
func FetchChapters(c *gin.Context) {
	gameID := c.Param("id")
	intID, err := strconv.Atoi(gameID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	var response ChaptersResponse
	rows, err := database.DB.Query(`SELECT c.id, c.name, g.name FROM chapters c INNER JOIN games g ON c.game_id = g.id WHERE game_id = $1`, gameID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	var chapters []models.Chapter
	var gameName string
	for rows.Next() {
		var chapter models.Chapter
		if err := rows.Scan(&chapter.ID, &chapter.Name, &gameName); err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		chapters = append(chapters, chapter)
	}
	response.Game.ID = intID
	response.Game.Name = gameName
	response.Chapters = chapters
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved chapters.",
		Data:    response,
	})
}

// GET Maps of a Chapter
//
//	@Description	Get maps from the specified chapter id.
//	@Tags			games & chapters
//	@Produce		json
//	@Param			id	path		int	true	"Chapter ID"
//	@Success		200	{object}	models.Response{data=ChapterMapsResponse}
//	@Failure		400	{object}	models.Response
//	@Router			/chapters/{id} [get]
func FetchChapterMaps(c *gin.Context) {
	chapterID := c.Param("id")
	intID, err := strconv.Atoi(chapterID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	var response ChapterMapsResponse
	rows, err := database.DB.Query(`SELECT m.id, m.name, c.name FROM maps m INNER JOIN chapters c ON m.chapter_id = c.id WHERE chapter_id = $1`, chapterID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	var maps []models.MapShort
	var chapterName string
	for rows.Next() {
		var mapShort models.MapShort
		if err := rows.Scan(&mapShort.ID, &mapShort.Name, &chapterName); err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		maps = append(maps, mapShort)
	}
	response.Chapter.ID = intID
	response.Chapter.Name = chapterName
	response.Maps = maps
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved maps.",
		Data:    response,
	})
}
