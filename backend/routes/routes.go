package routes

import (
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportals/backend/controllers"
	"github.com/pektezol/leastportals/middleware"
)

func InitRoutes(router *gin.Engine) {
	store := cookie.NewStore([]byte(os.Getenv("SESSION_KEY")))
	router.Use(sessions.Sessions("session", store))
	api := router.Group("/api")
	{
		v1 := api.Group("/v1")
		v1.GET("/", controllers.Home)
		v1.GET("/login", controllers.Login)
		v1.GET("/logout", middleware.RequireAuth, controllers.Logout)
		v1.GET("/validate", middleware.RequireAuth, controllers.Validate)
	}
}
