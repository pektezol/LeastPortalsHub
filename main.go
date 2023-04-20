package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/pektezol/leastportals/backend/database"
	"github.com/pektezol/leastportals/backend/routes"
	_ "github.com/pektezol/leastportals/docs"
)

//	@title			Least Portals Database API
//	@version		1.0
//	@description	Backend API endpoints for Least Portals Database.

//	@license.name	GNU General Public License, Version 2
//	@license.url	https://www.gnu.org/licenses/old-licenses/gpl-2.0.html

//	@host		lp.ardapektezol.com/api
//	@BasePath	/v1
func main() {
	if os.Getenv("ENV") == "PROD" {
		gin.SetMode(gin.ReleaseMode)
	}
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	router := gin.Default()
	database.ConnectDB()
	router.Use(static.Serve("/", static.LocalFile("./frontend/dist", true)))
	routes.InitRoutes(router)
	router.Run(fmt.Sprintf(":%s", os.Getenv("PORT")))
}
