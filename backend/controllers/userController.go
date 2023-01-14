package controllers

import (
	"net/http"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportals/backend/database"
	"github.com/pektezol/leastportals/backend/models"
)

func Profile(c *gin.Context) {
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse("User not logged in."))
		return
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "",
		Data: models.ProfileResponse{
			Profile:     true,
			SteamID:     user.(models.User).SteamID,
			Username:    user.(models.User).Username,
			AvatarLink:  user.(models.User).AvatarLink,
			CountryCode: user.(models.User).CountryCode,
		},
	})
	return
}

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
	// Target user exists
	_, exists := c.Get("user")
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "",
		Data: models.ProfileResponse{
			Profile:     exists,
			SteamID:     user.SteamID,
			Username:    user.Username,
			AvatarLink:  user.AvatarLink,
			CountryCode: user.CountryCode,
		},
	})
	return
}

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
