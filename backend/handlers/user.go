package handlers

import (
	"log"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportalshub/backend/database"
	"github.com/pektezol/leastportalshub/backend/models"
)

type ProfileResponse struct {
	Profile     bool             `json:"profile"`
	SteamID     string           `json:"steam_id"`
	UserName    string           `json:"user_name"`
	AvatarLink  string           `json:"avatar_link"`
	CountryCode string           `json:"country_code"`
	Titles      []models.Title   `json:"titles"`
	Links       models.Links     `json:"links"`
	Rankings    ProfileRankings  `json:"rankings"`
	Records     []ProfileRecords `json:"records"`
}

type ProfileRankings struct {
	Overall      ProfileRankingsDetails `json:"overall"`
	Singleplayer ProfileRankingsDetails `json:"singleplayer"`
	Cooperative  ProfileRankingsDetails `json:"cooperative"`
}

type ProfileRankingsDetails struct {
	Rank            int `json:"rank"`
	CompletionCount int `json:"completion_count"`
	CompletionTotal int `json:"completion_total"`
}
type ProfileRecords struct {
	GameID     int             `json:"game_id"`
	CategoryID int             `json:"category_id"`
	MapID      int             `json:"map_id"`
	MapName    string          `json:"map_name"`
	MapWRCount int             `json:"map_wr_count"`
	Scores     []ProfileScores `json:"scores"`
}

type ProfileScores struct {
	DemoID     string    `json:"demo_id"`
	ScoreCount int       `json:"score_count"`
	ScoreTime  int       `json:"score_time"`
	Date       time.Time `json:"date"`
}

type ScoreResponse struct {
	MapID   int `json:"map_id"`
	Records any `json:"records"`
}

// GET Profile
//
//	@Description	Get profile page of session user.
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			Authorization	header		string	true	"JWT Token"
//	@Success		200				{object}	models.Response{data=ProfileResponse}
//	@Failure		400				{object}	models.Response
//	@Failure		401				{object}	models.Response
//	@Router			/profile [get]
func Profile(c *gin.Context) {
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse("User not logged in."))
		return
	}
	// Get user links
	links := models.Links{}
	sql := `SELECT u.p2sr, u.steam, u.youtube, u.twitch FROM users u WHERE u.steam_id = $1`
	err := database.DB.QueryRow(sql, user.(models.User).SteamID).Scan(&links.P2SR, &links.Steam, &links.YouTube, &links.Twitch)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	// TODO: Get rankings (all maps done in one game)
	records := []ProfileRecords{}
	// Get singleplayer records
	sql = `SELECT m.game_id, m.chapter_id, sp.map_id, m."name", (SELECT mr.score_count FROM map_routes mr WHERE mr.map_id = sp.map_id ORDER BY mr.score_count ASC LIMIT 1) AS wr_count, sp.score_count, sp.score_time, sp.demo_id, sp.record_date
	FROM records_sp sp INNER JOIN maps m ON sp.map_id = m.id WHERE sp.user_id = $1 ORDER BY sp.map_id, sp.score_count, sp.score_time;`
	rows, err := database.DB.Query(sql, user.(models.User).SteamID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	log.Println("rows:", rows)
	for rows.Next() {
		var gameID int
		var categoryID int
		var mapID int
		var mapName string
		var mapWR int
		score := ProfileScores{}
		rows.Scan(&gameID, &categoryID, &mapID, &mapName, &mapWR, &score.ScoreCount, &score.ScoreTime, &score.DemoID, &score.Date)
		// More than one record in one map
		if len(records) != 0 && mapID == records[len(records)-1].MapID {
			records[len(records)-1].Scores = append(records[len(records)-1].Scores, score)
			continue
		}
		// New map
		records = append(records, ProfileRecords{
			GameID:     gameID,
			CategoryID: categoryID,
			MapID:      mapID,
			MapName:    mapName,
			MapWRCount: mapWR,
			Scores:     []ProfileScores{},
		})
		records[len(records)-1].Scores = append(records[len(records)-1].Scores, score)
	}
	// Get multiplayer records
	sql = `SELECT m.game_id, m.chapter_id, mp.map_id, m."name", (SELECT mr.score_count FROM map_routes mr WHERE mr.map_id = mp.map_id ORDER BY mr.score_count ASC LIMIT 1) AS wr_count,  mp.score_count, mp.score_time, CASE WHEN host_id = $1 THEN mp.host_demo_id WHEN partner_id = $1 THEN mp.partner_demo_id END demo_id, mp.record_date
	FROM records_mp mp INNER JOIN maps m ON mp.map_id = m.id WHERE mp.host_id = $1 OR mp.partner_id = $1 ORDER BY mp.map_id, mp.score_count, mp.score_time;`
	rows, err = database.DB.Query(sql, user.(models.User).SteamID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	for rows.Next() {
		var gameID int
		var categoryID int
		var mapID int
		var mapName string
		var mapWR int
		score := ProfileScores{}
		rows.Scan(&gameID, &categoryID, &mapID, &mapName, &mapWR, &score.ScoreCount, &score.ScoreTime, &score.DemoID, &score.Date)
		// More than one record in one map
		if len(records) != 0 && mapID == records[len(records)-1].MapID {
			records[len(records)-1].Scores = append(records[len(records)-1].Scores, score)
			continue
		}
		// New map
		records = append(records, ProfileRecords{
			GameID:     gameID,
			CategoryID: categoryID,
			MapID:      mapID,
			MapName:    mapName,
			MapWRCount: mapWR,
			Scores:     []ProfileScores{},
		})
		records[len(records)-1].Scores = append(records[len(records)-1].Scores, score)
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved user scores.",
		Data: ProfileResponse{
			Profile:     true,
			SteamID:     user.(models.User).SteamID,
			UserName:    user.(models.User).UserName,
			AvatarLink:  user.(models.User).AvatarLink,
			CountryCode: user.(models.User).CountryCode,
			Titles:      user.(models.User).Titles,
			Links:       links,
			Rankings:    ProfileRankings{},
			Records:     records,
		},
	})
}

// GET User
//
//	@Description	Get profile page of another user.
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			id	path		int	true	"User ID"
//	@Success		200	{object}	models.Response{data=ProfileResponse}
//	@Failure		400	{object}	models.Response
//	@Failure		404	{object}	models.Response
//	@Router			/users/{id} [get]
func FetchUser(c *gin.Context) {
	id := c.Param("id")
	// Check if id is all numbers and 17 length
	match, _ := regexp.MatchString("^[0-9]{17}$", id)
	if !match {
		c.JSON(http.StatusNotFound, models.ErrorResponse("User not found."))
		return
	}
	// Check if user exists
	var user models.User
	links := models.Links{}
	sql := `SELECT u.steam_id, u.user_name, u.avatar_link, u.country_code, u.created_at, u.updated_at, u.p2sr, u.steam, u.youtube, u.twitch FROM users u WHERE u.steam_id = $1`
	err := database.DB.QueryRow(sql, id).Scan(&user.SteamID, &user.UserName, &user.AvatarLink, &user.CountryCode, &user.CreatedAt, &user.UpdatedAt, &links.P2SR, &links.Steam, &links.YouTube, &links.Twitch)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	if user.SteamID == "" {
		// User does not exist
		c.JSON(http.StatusNotFound, models.ErrorResponse("User not found."))
		return
	}
	// Get user titles
	sql = `SELECT t.title_name, t.title_color FROM titles t
	INNER JOIN user_titles ut ON t.id=ut.title_id WHERE ut.user_id = $1`
	rows, err := database.DB.Query(sql, user.SteamID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	for rows.Next() {
		var title models.Title
		if err := rows.Scan(&title.Name, &title.Color); err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		user.Titles = append(user.Titles, title)
	}
	// TODO: Get rankings (all maps done in one game)
	records := []ProfileRecords{}
	// Get singleplayer records
	sql = `SELECT m.game_id, m.chapter_id, sp.map_id, m."name", (SELECT mr.score_count FROM map_routes mr WHERE mr.map_id = sp.map_id ORDER BY mr.score_count ASC LIMIT 1) AS wr_count, sp.score_count, sp.score_time, sp.demo_id, sp.record_date
	FROM records_sp sp INNER JOIN maps m ON sp.map_id = m.id WHERE sp.user_id = $1 ORDER BY sp.map_id, sp.score_count, sp.score_time;`
	rows, err = database.DB.Query(sql, user.SteamID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	log.Println("rows:", rows)
	for rows.Next() {
		var gameID int
		var categoryID int
		var mapID int
		var mapName string
		var mapWR int
		score := ProfileScores{}
		rows.Scan(&gameID, &categoryID, &mapID, &mapName, &mapWR, &score.ScoreCount, &score.ScoreTime, &score.DemoID, &score.Date)
		// More than one record in one map
		if len(records) != 0 && mapID == records[len(records)-1].MapID {
			records[len(records)-1].Scores = append(records[len(records)-1].Scores, score)
			continue
		}
		// New map
		records = append(records, ProfileRecords{
			GameID:     gameID,
			CategoryID: categoryID,
			MapID:      mapID,
			MapName:    mapName,
			MapWRCount: mapWR,
			Scores:     []ProfileScores{},
		})
		records[len(records)-1].Scores = append(records[len(records)-1].Scores, score)
	}
	// Get multiplayer records
	sql = `SELECT m.game_id, m.chapter_id, mp.map_id, m."name", (SELECT mr.score_count FROM map_routes mr WHERE mr.map_id = mp.map_id ORDER BY mr.score_count ASC LIMIT 1) AS wr_count,  mp.score_count, mp.score_time, CASE WHEN host_id = $1 THEN mp.host_demo_id WHEN partner_id = $1 THEN mp.partner_demo_id END demo_id, mp.record_date
	FROM records_mp mp INNER JOIN maps m ON mp.map_id = m.id WHERE mp.host_id = $1 OR mp.partner_id = $1 ORDER BY mp.map_id, mp.score_count, mp.score_time;`
	rows, err = database.DB.Query(sql, user.SteamID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	for rows.Next() {
		var gameID int
		var categoryID int
		var mapID int
		var mapName string
		var mapWR int
		score := ProfileScores{}
		rows.Scan(&gameID, &categoryID, &mapID, &mapName, &mapWR, &score.ScoreCount, &score.ScoreTime, &score.DemoID, &score.Date)
		// More than one record in one map
		if len(records) != 0 && mapID == records[len(records)-1].MapID {
			records[len(records)-1].Scores = append(records[len(records)-1].Scores, score)
			continue
		}
		// New map
		records = append(records, ProfileRecords{
			GameID:     gameID,
			CategoryID: categoryID,
			MapID:      mapID,
			MapName:    mapName,
			MapWRCount: mapWR,
			Scores:     []ProfileScores{},
		})
		records[len(records)-1].Scores = append(records[len(records)-1].Scores, score)
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved user scores.",
		Data: ProfileResponse{
			Profile:     true,
			SteamID:     user.SteamID,
			UserName:    user.UserName,
			AvatarLink:  user.AvatarLink,
			CountryCode: user.CountryCode,
			Titles:      user.Titles,
			Links:       links,
			Rankings:    ProfileRankings{},
			Records:     records,
		},
	})
}

// PUT Profile
//
//	@Description	Update profile page of session user.
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			Authorization	header		string	true	"JWT Token"
//	@Success		200				{object}	models.Response{data=ProfileResponse}
//	@Failure		400				{object}	models.Response
//	@Failure		401				{object}	models.Response
//	@Router			/profile [post]
func UpdateUser(c *gin.Context) {
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse("User not logged in."))
		return
	}
	profile, err := GetPlayerSummaries(user.(models.User).SteamID, os.Getenv("API_KEY"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	// Update profile
	_, err = database.DB.Exec(`UPDATE users SET username = $1, avatar_link = $2, country_code = $3, updated_at = $4
	WHERE steam_id = $5`, profile.PersonaName, profile.AvatarFull, profile.LocCountryCode, time.Now().UTC(), user.(models.User).SteamID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully updated user.",
		Data: ProfileResponse{
			Profile:     true,
			SteamID:     user.(models.User).SteamID,
			UserName:    profile.PersonaName,
			AvatarLink:  profile.AvatarFull,
			CountryCode: profile.LocCountryCode,
		},
	})
}

// PUT Profile/CountryCode
//
//	@Description	Update country code of session user.
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			Authorization	header		string	true	"JWT Token"
//	@Param			country_code	query		string	true	"Country Code [XX]"
//	@Success		200				{object}	models.Response
//	@Failure		400				{object}	models.Response
//	@Failure		401				{object}	models.Response
//	@Router			/profile [put]
func UpdateCountryCode(c *gin.Context) {
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse("User not logged in."))
		return
	}
	code := c.Query("country_code")
	if code == "" {
		c.JSON(http.StatusNotFound, models.ErrorResponse("Enter a valid country code."))
		return
	}
	var validCode string
	err := database.DB.QueryRow(`SELECT country_code FROM countries WHERE country_code = $1`, code).Scan(&validCode)
	if err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse(err.Error()))
		return
	}
	// Valid code, update profile
	_, err = database.DB.Exec(`UPDATE users SET country_code = $1 WHERE steam_id = $2`, validCode, user.(models.User).SteamID)
	if err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully updated country code.",
	})
}
