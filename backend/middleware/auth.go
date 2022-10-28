package middleware

import (
	"fmt"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/pektezol/leastportals/backend/database"
	"github.com/pektezol/leastportals/backend/models"
)

func CheckAuth(c *gin.Context) {
	// Get auth cookie
	tokenString, err := c.Cookie("auth")
	if err != nil {
		c.Next()
		return
	}
	// Validate token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Check exp
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.Next()
			return
		}
		// Get user from DB
		var user models.User
		database.DB.QueryRow(`SELECT * FROM users WHERE steam_id = $1;`, claims["sub"]).Scan(
			&user.SteamID, &user.Username, &user.AvatarLink, &user.CountryCode,
			&user.CreatedAt, &user.UpdatedAt, &user.UserType)
		if user.SteamID == 0 {
			c.Next()
			return
		}
		c.Set("user", user)
		c.Next()
	} else {
		c.Next()
		return
	}
}
