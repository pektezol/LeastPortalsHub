package controllers

import (
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/solovev/steam_go"
)

func Home(c *gin.Context) {
	session := sessions.Default(c)
	if session.Get("id") == nil {
		c.JSON(200, "no id, not auth")
	} else {
		var user *steam_go.PlayerSummaries
		user, err := steam_go.GetPlayerSummaries(session.Get("id").(string), GetEnvKey("API_KEY"))
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
	opId := steam_go.NewOpenId(c.Request)
	switch opId.Mode() {
	case "":
		http.Redirect(c.Writer, c.Request, opId.AuthUrl(), 301)
	case "cancel":
		c.Writer.Write([]byte("Authorization cancelled"))
	default:
		steamId, err := opId.ValidateAndGetId()
		if err != nil {
			http.Error(c.Writer, err.Error(), http.StatusInternalServerError)
		}
		session := sessions.Default(c)
		session.Set("id", steamId)
		session.Save()
		// Do whatever you want with steam id
		c.Redirect(http.StatusMovedPermanently, "/")
		c.Writer.Write([]byte(steamId))
	}
}

func Logout(c *gin.Context) {
	session := sessions.Default(c)
	if session.Get("id") == nil {
		c.JSON(http.StatusBadRequest, "no id, not auth")
	} else {
		session.Set("id", "")
		session.Clear()
		session.Options(sessions.Options{Path: "/", MaxAge: -1})
		session.Save()
		log.Print("id", session.Get("id"))
		c.Redirect(http.StatusPermanentRedirect, "/")
	}
}
