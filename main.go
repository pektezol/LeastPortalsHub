package main

import (
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportals/backend/controllers"
	"github.com/pektezol/leastportals/backend/routes"
)

func main() {
	if controllers.GetEnvKey("ENV") == "PROD" {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./frontend/dist", true)))
	routes.InitRoutes(router)
	router.Run(":4000")
}
