package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportals/backend/database"
	"github.com/pektezol/leastportals/backend/models"
)

// GET Map Summary
//
//	@Summary	Get map summary with specified id.
//	@Tags		maps
//	@Produce	json
//	@Param		id	path		int	true	"Map ID"
//	@Success	200	{object}	models.Response{data=models.MapSummaryResponse}
//	@Failure	400	{object}	models.Response
//	@Router		/maps/{id}/summary [get]
func FetchMapSummary(c *gin.Context) {
	id := c.Param("id")
	response := models.MapSummaryResponse{Map: models.Map{}, Summary: models.MapSummary{Routes: []models.MapRoute{}}}
	intID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	// Get map data
	response.Map.ID = intID
	sql := `SELECT m.id, g.name, c.name, m.name
	FROM maps m
	INNER JOIN games g ON m.game_id = g.id
	INNER JOIN chapters c ON m.chapter_id = c.id
	WHERE m.id = $1`
	err = database.DB.QueryRow(sql, id).Scan(&response.Map.ID, &response.Map.GameName, &response.Map.ChapterName, &response.Map.MapName)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	// Get map routes and histories
	sql = `SELECT c.id, c.name, h.user_name, h.score_count, h.record_date, r.description, r.showcase, COALESCE(avg(rating), 0.0) FROM map_routes r
    INNER JOIN categories c ON r.category_id = c.id
    INNER JOIN map_history h ON r.map_id = h.map_id AND r.category_id = h.category_id
    LEFT JOIN map_ratings rt ON r.map_id = rt.map_id AND r.category_id = rt.category_id 
	WHERE r.map_id = $1 AND h.score_count = r.score_count GROUP BY c.id, h.user_name, h.score_count, h.record_date, r.description, r.showcase
	ORDER BY h.record_date ASC;`
	rows, err := database.DB.Query(sql, id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	for rows.Next() {
		route := models.MapRoute{Category: models.Category{}, History: models.MapHistory{}}
		err = rows.Scan(&route.Category.ID, &route.Category.Name, &route.History.RunnerName, &route.History.ScoreCount, &route.History.Date, &route.Description, &route.Showcase, &route.Rating)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
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
//	@Summary	Get map leaderboards with specified id.
//	@Tags		maps
//	@Produce	json
//	@Param		id	path		int	true	"Map ID"
//	@Success	200	{object}	models.Response{data=models.Map{data=models.MapRecords}}
//	@Failure	400	{object}	models.Response
//	@Router		/maps/{id}/leaderboards [get]
func FetchMapLeaderboards(c *gin.Context) {
	// TODO: make new response type
	id := c.Param("id")
	// Get map data
	var mapData models.Map
	var mapRecordsData models.MapRecords
	var isDisabled bool
	intID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	mapData.ID = intID
	sql := `SELECT g.name, c.name, m.name, is_disabled 
	FROM maps m
	INNER JOIN games g ON m.game_id = g.id
	INNER JOIN chapters c ON m.chapter_id = c.id
	WHERE m.id = $1`
	err = database.DB.QueryRow(sql, id).Scan(&mapData.GameName, &mapData.ChapterName, &mapData.MapName, &isDisabled)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	if isDisabled {
		c.JSON(http.StatusBadRequest, models.ErrorResponse("Map is not available for competitive boards."))
		return
	}
	// TODO: avatar and names for host & partner
	// Get records from the map
	if mapData.GameName == "Portal 2 - Cooperative" {
		var records []models.RecordMP
		sql = `SELECT id, host_id, partner_id, score_count, score_time, host_demo_id, partner_demo_id, record_date
		FROM (
		  SELECT id, host_id, partner_id, score_count, score_time, host_demo_id, partner_demo_id, record_date,
				 ROW_NUMBER() OVER (PARTITION BY host_id, partner_id ORDER BY score_count, score_time) AS rn
		  FROM records_mp
		  WHERE map_id = $1
		) sub
		WHERE rn = 1`
		rows, err := database.DB.Query(sql, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		placement := 1
		ties := 0
		for rows.Next() {
			var record models.RecordMP
			err := rows.Scan(&record.RecordID, &record.HostID, &record.PartnerID, &record.ScoreCount, &record.ScoreTime, &record.HostDemoID, &record.PartnerDemoID, &record.RecordDate)
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
			if len(records) != 0 && records[len(records)-1].ScoreTime == record.ScoreTime {
				ties++
				record.Placement = placement - ties
			} else {
				record.Placement = placement
			}
			records = append(records, record)
			placement++
		}
		mapRecordsData.Records = records
	} else {
		var records []models.RecordSP
		sql = `SELECT id, user_id, users.user_name, users.avatar_link, score_count, score_time, demo_id, record_date
		FROM (
		  SELECT id, user_id, score_count, score_time, demo_id, record_date,
				 ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY score_count, score_time) AS rn
		  FROM records_sp
		  WHERE map_id = $1
		) sub
		INNER JOIN users ON user_id = users.steam_id
		WHERE rn = 1`
		rows, err := database.DB.Query(sql, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		placement := 1
		ties := 0
		for rows.Next() {
			var record models.RecordSP
			err := rows.Scan(&record.RecordID, &record.UserID, &record.UserName, &record.UserAvatar, &record.ScoreCount, &record.ScoreTime, &record.DemoID, &record.RecordDate)
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
			if len(records) != 0 && records[len(records)-1].ScoreTime == record.ScoreTime {
				ties++
				record.Placement = placement - ties
			} else {
				record.Placement = placement
			}
			records = append(records, record)
			placement++
		}
		mapRecordsData.Records = records
	}
	// mapData.Data = mapRecordsData
	// Return response
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved map leaderboards.",
		Data:    mapData,
	})
}

// GET Games
//
//	@Summary	Get games from the leaderboards.
//	@Tags		games & chapters
//	@Produce	json
//	@Success	200	{object}	models.Response{data=[]models.Game}
//	@Failure	400	{object}	models.Response
//	@Router		/games [get]
func FetchGames(c *gin.Context) {
	rows, err := database.DB.Query(`SELECT id, name FROM games`)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	var games []models.Game
	for rows.Next() {
		var game models.Game
		if err := rows.Scan(&game.ID, &game.Name); err != nil {
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
//	@Summary	Get chapters from the specified game id.
//	@Tags		games & chapters
//	@Produce	json
//	@Param		id	path		int	true	"Game ID"
//	@Success	200	{object}	models.Response{data=models.ChaptersResponse}
//	@Failure	400	{object}	models.Response
//	@Router		/games/{id} [get]
func FetchChapters(c *gin.Context) {
	gameID := c.Param("id")
	intID, err := strconv.Atoi(gameID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	var response models.ChaptersResponse
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
//	@Summary	Get maps from the specified chapter id.
//	@Tags		games & chapters
//	@Produce	json
//	@Param		id	path		int	true	"Chapter ID"
//	@Success	200	{object}	models.Response{data=models.ChapterMapsResponse}
//	@Failure	400	{object}	models.Response
//	@Router		/chapters/{id} [get]
func FetchChapterMaps(c *gin.Context) {
	chapterID := c.Param("id")
	intID, err := strconv.Atoi(chapterID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	var response models.ChapterMapsResponse
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
