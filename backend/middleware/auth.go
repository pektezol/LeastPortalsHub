package middleware

import (
	"fmt"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/pektezol/leastportalshub/backend/database"
	"github.com/pektezol/leastportalshub/backend/models"
)

func CheckAuth(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	// Validate token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if token == nil {
		c.Next()
		return
	}
	if err != nil {
		c.Next()
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Check exp
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.Next()
			return
		}
		// Get user from DB
		var user models.User
		database.DB.QueryRow(`SELECT u.steam_id, u.user_name, u.avatar_link, u.country_code, u.created_at, u.updated_at FROM users u WHERE steam_id = $1`, claims["sub"]).Scan(
			&user.SteamID, &user.UserName, &user.AvatarLink,
			&user.CountryCode, &user.CreatedAt, &user.UpdatedAt)
		if user.SteamID == "" {
			c.Next()
			return
		}
		// Get user titles from DB
		user.Titles = []string{}
		rows, _ := database.DB.Query(`SELECT t.title_name FROM titles t WHERE t.user_id = $1`, user.SteamID)
		for rows.Next() {
			var title string
			rows.Scan(&title)
			user.Titles = append(user.Titles, title)
		}
		c.Set("user", user)
		c.Next()
	} else {
		c.Next()
		return
	}
}
