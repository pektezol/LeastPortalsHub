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
		c.JSON(http.StatusUnauthorized, gin.H{
			"code": http.StatusUnauthorized,
			"output": gin.H{
				"error": "User not logged in. Could be invalid token.",
			},
		})
		return
	} else {
		user := user.(models.User)
		c.JSON(http.StatusOK, gin.H{
			"code": http.StatusOK,
			"output": gin.H{
				"avatar":   user.AvatarLink,
				"country":  user.CountryCode,
				"types":    user.TypeToString(),
				"username": user.Username,
			},
			"profile": true,
		})
		return
	}
}

func FetchUser(c *gin.Context) {
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
			"avatar":   targetUser.AvatarLink,
			"country":  targetUser.CountryCode,
			"types":    targetUser.TypeToString(),
			"username": targetUser.Username,
		},
		"profile": false,
	})
	return
}

func UpdateUserCountry(c *gin.Context) {
	id := c.Param("id")
	cc := c.Param("country")
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
	// Check if valid country code length
	match, _ = regexp.MatchString("^[A-Z]{2}$", cc)
	if !match {
		c.JSON(http.StatusNotFound, gin.H{
			"code": http.StatusNotFound,
			"output": gin.H{
				"error": "Invalid country code.",
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
	user, exists := c.Get("user")
	if exists {
		user := user.(models.User)
		if user.SteamID == targetUser.SteamID {
			// Can change because it's our own profile
			// TODO:Check if country code exists in database // ADD countries TABLE
			var existingCC string
			database.DB.QueryRow(`SELECT country_code FROM countries WHERE country_code = $1;`, cc).Scan(&existingCC)
			if existingCC == "" {
				c.JSON(http.StatusNotFound, gin.H{
					"code": http.StatusForbidden,
					"output": gin.H{
						"error": "Given country code is not found.",
					},
				})
				return
			}
			// Valid to change
			database.DB.Exec(`UPDATE users SET country_code = $1 WHERE steam_id = $2`, cc, user.SteamID)
			c.JSON(http.StatusOK, gin.H{
				"code": http.StatusOK,
				"output": gin.H{
					"avatar":   user.AvatarLink,
					"country":  user.CountryCode,
					"types":    user.TypeToString(),
					"username": user.Username,
				},
				"profile": true,
			})
			return
		}
		c.JSON(http.StatusForbidden, gin.H{
			"code": http.StatusForbidden,
			"output": gin.H{
				"error": "Can not change country of another user.",
			},
		})
		return
	}
	c.JSON(http.StatusUnauthorized, gin.H{
		"code": http.StatusUnauthorized,
		"output": gin.H{
			"error": "User not logged in. Could be invalid token.",
		},
	})
	return
}
