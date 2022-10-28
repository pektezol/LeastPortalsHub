package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportals/backend/controllers"
	"github.com/pektezol/leastportals/backend/middleware"
)

func InitRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		v1 := api.Group("/v1")
		v1.GET("/", middleware.CheckAuth, controllers.Home)
		v1.GET("/login", controllers.Login)
		v1.GET("/logout", middleware.CheckAuth, controllers.Logout)
	}
}
