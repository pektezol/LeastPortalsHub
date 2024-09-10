package main

import (
	"fmt"
	"log"
	"os"

	"lphub/api"
	"lphub/database"
	_ "lphub/docs"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

//	@title			Least Portals Database API
//	@version		1.0
//	@description	Backend API endpoints for the Least Portals Database.

//	@license.name	GNU Affero General Public License, Version 3
//	@license.url	https://www.gnu.org/licenses/agpl-3.0.html

// @host		lp.ardapektezol.com
// @BasePath	/api/v1
func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	if os.Getenv("ENV") == "PROD" {
		gin.SetMode(gin.ReleaseMode)
	}
	router := gin.Default()
	database.ConnectDB()
	api.InitRoutes(router)
	router.Run(fmt.Sprintf(":%s", os.Getenv("PORT")))
}
