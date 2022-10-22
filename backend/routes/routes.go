package routes

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportals/backend/controllers"
)

func InitRoutes(router *gin.Engine) {
	store := cookie.NewStore([]byte(controllers.GetEnvKey("SESSION_KEY")))
	router.Use(sessions.Sessions("session", store))
	router.GET("/", controllers.Home)
	router.GET("/login", controllers.Login)
	router.GET("/logout", controllers.Logout)
}
