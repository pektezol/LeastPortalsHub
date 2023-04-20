package controllers

import (
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportals/backend/database"
	"github.com/pektezol/leastportals/backend/models"
)

// GET Profile
//
//	@Summary	Get profile page of session user.
//	@Accept		json
//	@Produce	json
//	@Param		Authorization	header		string	true	"JWT Token"
//	@Success	200				{object}	models.Response{data=models.ProfileResponse}
//	@Failure	400				{object}	models.Response
//	@Failure	401				{object}	models.Response
//	@Router		/profile [get]
func Profile(c *gin.Context) {
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse("User not logged in."))
		return
	}
	// Retrieve singleplayer records
	var scoresSP []models.ScoreResponse
	sql := `SELECT id, map_id, score_count, score_time, demo_id, record_date FROM records_sp WHERE user_id = $1 ORDER BY map_id;`
	rows, err := database.DB.Query(sql, user.(models.User).SteamID)
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
		scoresSP = append(scoresSP, models.ScoreResponse{
			MapID:   mapID,
			Records: recordsSP,
		})
	}
	// Retrieve multiplayer records
	var scoresMP []models.ScoreResponse
	sql = `SELECT id, map_id, host_id, partner_id, score_count, score_time, host_demo_id, partner_demo_id, record_date FROM records_mp
	WHERE host_id = $1 OR partner_id = $2 ORDER BY map_id;`
	rows, err = database.DB.Query(sql, user.(models.User).SteamID, user.(models.User).SteamID)
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
		scoresMP = append(scoresMP, models.ScoreResponse{
			MapID:   mapID,
			Records: recordsMP,
		})
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved user scores.",
		Data: models.ProfileResponse{
			Profile:     true,
			SteamID:     user.(models.User).SteamID,
			Username:    user.(models.User).Username,
			AvatarLink:  user.(models.User).AvatarLink,
			CountryCode: user.(models.User).CountryCode,
			ScoresSP:    scoresSP,
			ScoresMP:    scoresMP,
		},
	})
	return
}

// GET User
//
//	@Summary	Get profile page of another user.
//	@Accept		json
//	@Produce	json
//	@Param		id	path		int	true	"User ID"
//	@Success	200	{object}	models.Response{data=models.ProfileResponse}
//	@Failure	400	{object}	models.Response
//	@Failure	404	{object}	models.Response
//	@Router		/user/{id} [get]
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
	err := database.DB.QueryRow(`SELECT * FROM users WHERE steam_id = $1;`, id).Scan(
		&user.SteamID, &user.Username, &user.AvatarLink, &user.CountryCode,
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
	var scoresSP []models.ScoreResponse
	sql := `SELECT id, map_id, score_count, score_time, demo_id, record_date FROM records_sp WHERE user_id = $1 ORDER BY map_id;`
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
		scoresSP = append(scoresSP, models.ScoreResponse{
			MapID:   mapID,
			Records: recordsSP,
		})
	}
	// Retrieve multiplayer records
	var scoresMP []models.ScoreResponse
	sql = `SELECT id, map_id, host_id, partner_id, score_count, score_time, host_demo_id, partner_demo_id, record_date FROM records_mp
	WHERE host_id = $1 OR partner_id = $2 ORDER BY map_id;`
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
		scoresMP = append(scoresMP, models.ScoreResponse{
			MapID:   mapID,
			Records: recordsMP,
		})
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved user scores.",
		Data: models.ProfileResponse{
			Profile:     true,
			SteamID:     user.SteamID,
			Username:    user.Username,
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
//	@Summary	Update profile page of session user.
//	@Accept		json
//	@Produce	json
//	@Param		Authorization	header		string	true	"JWT Token"
//	@Success	200				{object}	models.Response{data=models.ProfileResponse}
//	@Failure	400				{object}	models.Response
//	@Failure	401				{object}	models.Response
//	@Router		/profile [post]
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
	WHERE steam_id = $5;`, profile.PersonaName, profile.AvatarFull, profile.LocCountryCode, time.Now().UTC(), user.(models.User).SteamID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully updated user.",
		Data: models.ProfileResponse{
			Profile:     true,
			SteamID:     user.(models.User).SteamID,
			Username:    profile.PersonaName,
			AvatarLink:  profile.AvatarFull,
			CountryCode: profile.LocCountryCode,
		},
	})
}

// PUT Profile/CountryCode
//
//	@Summary	Update country code of session user.
//	@Accept		json
//	@Produce	json
//	@Param		Authorization	header		string	true	"JWT Token"
//	@Param		country_code	query		string	true	"Country Code [XX]"
//	@Success	200				{object}	models.Response{data=models.ProfileResponse}
//	@Failure	400				{object}	models.Response
//	@Failure	401				{object}	models.Response
//	@Router		/profile [put]
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
	err := database.DB.QueryRow(`SELECT country_code FROM countries WHERE country_code = $1;`, code).Scan(&validCode)
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
