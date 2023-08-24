package controllers

import (
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportalshub/backend/database"
	"github.com/pektezol/leastportalshub/backend/models"
)

type ProfileResponse struct {
	Profile     bool            `json:"profile"`
	SteamID     string          `json:"steam_id"`
	UserName    string          `json:"user_name"`
	AvatarLink  string          `json:"avatar_link"`
	CountryCode string          `json:"country_code"`
	Titles      []models.Title  `json:"titles"`
	Links       models.Links    `json:"links"`
	Rankings    ProfileRankings `json:"rankings"`
	Records     ProfileRecords  `json:"records"`
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
	P2Singleplayer ProfileRecordsDetails `json:"portal2_singleplayer"`
	P2Cooperative  ProfileRecordsDetails `json:"portal2_cooperative"`
}

type ProfileRecordsDetails struct {
	MapID  int             `json:"map_id"`
	Scores []ProfileScores `json:"scores"`
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
	// Get user titles
	titles := []models.Title{}
	sql := `SELECT t.title_name, t.title_color FROM titles t
	INNER JOIN user_titles ut ON t.id=ut.title_id WHERE ut.user_id = $1`
	rows, err := database.DB.Query(sql, user.(models.User).SteamID)
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
		titles = append(titles, title)
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
			Links:       models.Links{},
			Rankings:    ProfileRankings{},
			Records:     ProfileRecords{},
		},
	})
	return
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
	err := database.DB.QueryRow(`SELECT * FROM users WHERE steam_id = $1`, id).Scan(
		&user.SteamID, &user.UserName, &user.AvatarLink, &user.CountryCode,
		&user.CreatedAt, &user.UpdatedAt)
	if user.SteamID == "" {
		// User does not exist
		c.JSON(http.StatusNotFound, models.ErrorResponse("User not found."))
		return
	}
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	// Retrieve singleplayer records
	var scoresSP []ScoreResponse
	sql := `SELECT id, map_id, score_count, score_time, demo_id, record_date FROM records_sp WHERE user_id = $1 ORDER BY map_id`
	rows, err := database.DB.Query(sql, user.SteamID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	var recordsSP []models.RecordSP
	for rows.Next() {
		var mapID int
		var record models.RecordSP
		rows.Scan(&record.RecordID, &mapID, &record.ScoreCount, &record.ScoreTime, &record.DemoID, &record.RecordDate)
		// More than one record in one map
		if len(scoresSP) != 0 && mapID == scoresSP[len(scoresSP)-1].MapID {
			scoresSP[len(scoresSP)-1].Records = append(scoresSP[len(scoresSP)-1].Records.([]models.RecordSP), record)
			continue
		}
		// New map
		recordsSP = []models.RecordSP{}
		recordsSP = append(recordsSP, record)
		scoresSP = append(scoresSP, ScoreResponse{
			MapID:   mapID,
			Records: recordsSP,
		})
	}
	// Retrieve multiplayer records
	var scoresMP []ScoreResponse
	sql = `SELECT id, map_id, host_id, partner_id, score_count, score_time, host_demo_id, partner_demo_id, record_date FROM records_mp
	WHERE host_id = $1 OR partner_id = $2 ORDER BY map_id`
	rows, err = database.DB.Query(sql, user.SteamID, user.SteamID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	var recordsMP []models.RecordMP
	for rows.Next() {
		var mapID int
		var record models.RecordMP
		rows.Scan(&record.RecordID, &mapID, &record.HostID, &record.PartnerID, &record.ScoreCount, &record.ScoreTime, &record.HostDemoID, &record.PartnerDemoID, &record.RecordDate)
		// More than one record in one map
		if len(scoresMP) != 0 && mapID == scoresMP[len(scoresMP)-1].MapID {
			scoresMP[len(scoresMP)-1].Records = append(scoresMP[len(scoresMP)-1].Records.([]models.RecordMP), record)
			continue
		}
		// New map
		recordsMP = []models.RecordMP{}
		recordsMP = append(recordsMP, record)
		scoresMP = append(scoresMP, ScoreResponse{
			MapID:   mapID,
			Records: recordsMP,
		})
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
			ScoresSP:    scoresSP,
			ScoresMP:    scoresMP,
		},
	})
	return
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
