package api

import (
	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportalshub/backend/handlers"
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
		v1.GET("/token", handlers.GetCookie)
		v1.DELETE("/token", handlers.DeleteCookie)
		v1.GET("/home", CheckAuth, handlers.Home)
		v1.GET("/login", handlers.Login)
		v1.GET("/profile", CheckAuth, handlers.Profile)
		v1.PUT("/profile", CheckAuth, handlers.UpdateCountryCode)
		v1.POST("/profile", CheckAuth, handlers.UpdateUser)
		v1.GET("/users/:id", CheckAuth, handlers.FetchUser)
		v1.GET("/demos", handlers.DownloadDemoWithID)
		v1.GET("/maps/:id/summary", handlers.FetchMapSummary)
		v1.POST("/maps/:id/summary", CheckAuth, handlers.CreateMapSummary)
		v1.PUT("/maps/:id/summary", CheckAuth, handlers.EditMapSummary)
		v1.DELETE("/maps/:id/summary", CheckAuth, handlers.DeleteMapSummary)
		v1.PUT("/maps/:id/image", CheckAuth, handlers.EditMapImage)
		v1.GET("/maps/:id/leaderboards", handlers.FetchMapLeaderboards)
		v1.POST("/maps/:id/record", CheckAuth, handlers.CreateRecordWithDemo)
		v1.GET("/rankings", handlers.Rankings)
		v1.GET("/search", handlers.SearchWithQuery)
		v1.GET("/games", handlers.FetchGames)
		v1.GET("/games/:id", handlers.FetchChapters)
		v1.GET("/chapters/:id", handlers.FetchChapterMaps)
		v1.GET("/logs/score", handlers.ScoreLogs)
		v1.GET("/logs/mod", CheckAuth, handlers.ModLogs)
	}
}
