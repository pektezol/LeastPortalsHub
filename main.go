package main

import (
	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportals/backend/controllers"
)

func main() {
	if controllers.GetEnvKey("ENV") == "PROD" {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.Default()
	router.Run(":4000")
}
