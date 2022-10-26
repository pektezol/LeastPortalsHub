package controllers

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/pektezol/leastportals/backend/database"
	"github.com/solovev/steam_go"
)

func Home(c *gin.Context) {
	session := sessions.Default(c)
	if session.Get("id") == nil {
		c.JSON(200, "no id, not auth")
	} else {
		var user *steam_go.PlayerSummaries
		user, err := steam_go.GetPlayerSummaries(session.Get("id").(string), os.Getenv("API_KEY"))
		if err != nil {
			c.JSON(200, "authenticated, but err")
			log.Panic(err)
		} else {
			c.JSON(200, gin.H{
				"output": user,
			})
		}
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
			http.Error(c.Writer, err.Error(), http.StatusInternalServerError)
		}
		// Create user if new
		var checkSteamID int64
		database.DB.QueryRow("SELECT steam_id FROM users WHERE steamid = $1", steamID).Scan(&checkSteamID)
		// User does not exist
		if checkSteamID == 0 {
			user, err := steam_go.GetPlayerSummaries(steamID, os.Getenv("API_KEY"))
			if err != nil {
				log.Panic(err)
			}
			// Insert new user to database
			database.DB.Exec(`INSERT INTO users (steam_id, username, avatar_link, country_code, created_at, updated_at, user_type)
			VALUES ($1, $2, $3, $4, $5, $6, $7)`, steamID, user.PersonaName, user.Avatar, user.LocCountryCode, time.Now().UTC(), time.Now().UTC(), 0)
		}
		// Update updated_at
		database.DB.Exec(`UPDATE users SET updated_at = $1 WHERE steam_id = $2`, time.Now().UTC(), steamID)
		// Generate JWT token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"sub": steamID,
			"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
		})
		// Sign and get the complete encoded token as a string using the secret
		tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "failed to create token",
			})
			return
		}
		// Create auth cookie
		c.SetSameSite(http.SameSiteLaxMode)
		c.SetCookie("auth", tokenString, 3600*24*30, "/", "", true, true)
		c.Redirect(http.StatusMovedPermanently, "/")
	}
}

func Logout(c *gin.Context) {
	// Check if user exists
	_, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "not logged in",
		})
	} else {
		// Set auth cookie to die
		tokenString, _ := c.Cookie("auth")
		c.SetCookie("auth", tokenString, -1, "/", "", true, true)
		c.JSON(http.StatusOK, gin.H{
			"output": "logout success",
		})
		//c.Redirect(http.StatusPermanentRedirect, "/")
	}
}

func Validate(c *gin.Context) {
	user, _ := c.Get("user")
	c.JSON(http.StatusOK, gin.H{
		"output": user,
	})
}
