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
		v1.GET("/", func(c *gin.Context) {
			c.File("docs/index.html")
		})
		v1.GET("/token", controllers.GetCookie)
		v1.DELETE("/token", controllers.DeleteCookie)
		v1.GET("/home", middleware.CheckAuth, controllers.Home)
		v1.GET("/login", controllers.Login)
		v1.GET("/profile", middleware.CheckAuth, controllers.Profile)
		v1.PUT("/profile", middleware.CheckAuth, controllers.UpdateCountryCode)
		v1.POST("/profile", middleware.CheckAuth, controllers.UpdateUser)
		v1.GET("/users/:id", middleware.CheckAuth, controllers.FetchUser)
		v1.GET("/demos", controllers.DownloadDemoWithID)
		v1.GET("/maps/:id/summary", controllers.FetchMapSummary)
		v1.POST("/maps/:id/summary", middleware.CheckAuth, controllers.CreateMapSummary)
		v1.PUT("/maps/:id/summary", middleware.CheckAuth, controllers.EditMapSummary)
		v1.DELETE("/maps/:id/summary", middleware.CheckAuth, controllers.DeleteMapSummary)
		v1.GET("/maps/:id/leaderboards", controllers.FetchMapLeaderboards)
		v1.POST("/maps/:id/record", middleware.CheckAuth, controllers.CreateRecordWithDemo)
		v1.GET("/rankings", controllers.Rankings)
		v1.GET("/search", controllers.SearchWithQuery)
		v1.GET("/games", controllers.FetchGames)
		v1.GET("/games/:id", controllers.FetchChapters)
		v1.GET("/chapters/:id", controllers.FetchChapterMaps)
	}
}
