package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportals/backend/controllers"
	"github.com/pektezol/leastportals/backend/middleware"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func InitRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		v1 := api.Group("/v1")
		v1.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
		v1.GET("/", middleware.CheckAuth, controllers.Home)
		v1.GET("/login", controllers.Login)
		v1.GET("/logout", middleware.CheckAuth, controllers.Logout)
		v1.GET("/profile", middleware.CheckAuth, controllers.Profile)
		v1.GET("/user/:id", middleware.CheckAuth, controllers.User)
	}
}
