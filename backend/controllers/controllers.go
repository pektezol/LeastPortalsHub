package controllers

import (
	"log"
	"net/http"
	"os"
	"regexp"
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
			VALUES ($1, $2, $3, $4, $5, $6, $7)`, steamID, user.PersonaName, user.AvatarFull, user.LocCountryCode, time.Now().UTC(), time.Now().UTC(), 0)
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
	}
}

func Profile(c *gin.Context) {
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code": http.StatusUnauthorized,
			"output": gin.H{
				"error": "User not logged in. Could be invalid token.",
			},
		})
	} else {
		user := user.(models.User)
		c.JSON(http.StatusOK, gin.H{
			"code": http.StatusOK,
			"output": gin.H{
				"username": user.Username,
				"avatar":   user.AvatarLink,
				"types":    user.TypeToString(),
			},
			"profile": true,
		})
	}
}

func User(c *gin.Context) {
	id := c.Param("id")
	// Check if id is all numbers and 17 length
	match, _ := regexp.MatchString("^[0-9]{17}$", id)
	if !match {
		c.JSON(http.StatusNotFound, gin.H{
			"code": http.StatusNotFound,
			"output": gin.H{
				"error": "User not found.",
			},
		})
		return
	}
	// Check if user exists
	var targetUser models.User
	database.DB.QueryRow(`SELECT * FROM users WHERE steam_id = $1;`, id).Scan(
		&targetUser.SteamID, &targetUser.Username, &targetUser.AvatarLink, &targetUser.CountryCode,
		&targetUser.CreatedAt, &targetUser.UpdatedAt, &targetUser.UserType)
	if targetUser.SteamID == "" {
		// User does not exist
		c.JSON(http.StatusNotFound, gin.H{
			"code": http.StatusNotFound,
			"output": gin.H{
				"error": "User not found.",
			},
		})
		return
	}
	// Target user exists
	_, exists := c.Get("user")
	if exists {
		c.Redirect(http.StatusFound, "/api/v1/profile")
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"code": http.StatusOK,
		"output": gin.H{
			"username": targetUser.Username,
			"avatar":   targetUser.AvatarLink,
			"types":    targetUser.TypeToString(),
		},
		"profile": false,
	})
}
