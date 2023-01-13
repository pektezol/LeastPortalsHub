package controllers

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/pektezol/leastportals/backend/database"
	"github.com/pektezol/leastportals/backend/models"
	"github.com/solovev/steam_go"
)

func Home(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(200, "no id, not auth")
	} else {
		c.JSON(200, gin.H{
			"output": user,
		})
	}
}

func Login(c *gin.Context) {
	openID := steam_go.NewOpenId(c.Request)
	switch openID.Mode() {
	case "":
		c.Redirect(http.StatusMovedPermanently, openID.AuthUrl())
	case "cancel":
		c.Redirect(http.StatusMovedPermanently, "/")
	default:
		steamID, err := openID.ValidateAndGetId()
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		// Create user if new
		var checkSteamID int64
		err = database.DB.QueryRow("SELECT steam_id FROM users WHERE steam_id = $1", steamID).Scan(&checkSteamID)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		// User does not exist
		if checkSteamID == 0 {
			user, err := steam_go.GetPlayerSummaries(steamID, os.Getenv("API_KEY"))
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
			// Insert new user to database
			database.DB.Exec(`INSERT INTO users (steam_id, username, avatar_link, country_code)
			VALUES ($1, $2, $3, $4)`, steamID, user.PersonaName, user.AvatarFull, user.LocCountryCode)
		}
		// Generate JWT token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"sub": steamID,
			"exp": time.Now().Add(time.Hour * 24 * 365).Unix(),
		})
		// Sign and get the complete encoded token as a string using the secret
		tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse("Failed to generate token."))
			return
		}
		c.JSON(http.StatusOK, models.Response{
			Success: true,
			Message: "Successfully generated token.",
			Data: models.LoginResponse{
				Token: tokenString,
			},
		})
		return
	}
}
