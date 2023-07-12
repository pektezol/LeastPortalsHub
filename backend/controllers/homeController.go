package controllers

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportals/backend/database"
	"github.com/pektezol/leastportals/backend/models"
)

func Home(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(200, "no id, not auth")
	} else {
		c.JSON(200, gin.H{
			"output": user,
		})
	}
}

// GET Rankings
//
//	@Description	Get rankings of every player.
//	@Tags			rankings
//	@Produce		json
//	@Success		200	{object}	models.Response{data=models.RankingsResponse}
//	@Failure		400	{object}	models.Response
//	@Router			/rankings [get]
func Rankings(c *gin.Context) {
	rows, err := database.DB.Query(`SELECT steam_id, user_name FROM users`)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	var spRankings []models.UserRanking
	var mpRankings []models.UserRanking
	for rows.Next() {
		var userID, username string
		err := rows.Scan(&userID, &username)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		// Getting all sp records for each user
		var uniqueSingleUserRecords, totalSingleMaps int
		sql := `SELECT COUNT(DISTINCT map_id), (SELECT COUNT(map_name) FROM maps 
		WHERE is_coop = FALSE AND is_disabled = false) FROM records_sp WHERE user_id = $1`
		err = database.DB.QueryRow(sql, userID).Scan(&uniqueSingleUserRecords, &totalSingleMaps)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		// Has all singleplayer records
		if uniqueSingleUserRecords == totalSingleMaps {
			var ranking models.UserRanking
			ranking.UserID = userID
			ranking.UserName = username
			sql := `SELECT DISTINCT map_id, score_count FROM records_sp WHERE user_id = $1 ORDER BY map_id, score_count`
			rows, err := database.DB.Query(sql, userID)
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
			totalScore := 0
			var maps []int
			for rows.Next() {
				var mapID, scoreCount int
				rows.Scan(&mapID, &scoreCount)
				if len(maps) != 0 && maps[len(maps)-1] == mapID {
					continue
				}
				totalScore += scoreCount
				maps = append(maps, mapID)
			}
			ranking.TotalScore = totalScore
			spRankings = append(spRankings, ranking)
		}
		// Getting all mp records for each user
		var uniqueMultiUserRecords, totalMultiMaps int
		sql = `SELECT COUNT(DISTINCT map_id), (SELECT COUNT(map_name) FROM maps 
		WHERE is_coop = TRUE AND is_disabled = false) FROM records_mp WHERE host_id = $1 OR partner_id = $2`
		err = database.DB.QueryRow(sql, userID, userID).Scan(&uniqueMultiUserRecords, &totalMultiMaps)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		// Has all singleplayer records
		if uniqueMultiUserRecords == totalMultiMaps {
			var ranking models.UserRanking
			ranking.UserID = userID
			ranking.UserName = username
			sql := `SELECT DISTINCT map_id, score_count FROM records_mp WHERE host_id = $1 OR partner_id = $2 ORDER BY map_id, score_count`
			rows, err := database.DB.Query(sql, userID, userID)
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
			totalScore := 0
			var maps []int
			for rows.Next() {
				var mapID, scoreCount int
				rows.Scan(&mapID, &scoreCount)
				if len(maps) != 0 && maps[len(maps)-1] == mapID {
					continue
				}
				totalScore += scoreCount
				maps = append(maps, mapID)
			}
			ranking.TotalScore = totalScore
			mpRankings = append(mpRankings, ranking)
		}
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved rankings.",
		Data: models.RankingsResponse{
			RankingsSP: spRankings,
			RankingsMP: mpRankings,
		},
	})
}

// GET Search With Query
//
//	@Description	Get all user and map data matching to the query.
//	@Tags			search
//	@Produce		json
//	@Param			q	query		string	false	"Search user or map name."
//	@Success		200	{object}	models.Response{data=models.SearchResponse}
//	@Failure		400	{object}	models.Response
//	@Router			/search [get]
func SearchWithQuery(c *gin.Context) {
	query := c.Query("q")
	query = strings.ToLower(query)
	log.Println(query)
	var response models.SearchResponse
	// Cache all maps for faster response
	var maps = []models.MapShort{
		{ID: 1, Name: "Container Ride"},
		{ID: 2, Name: "Portal Carousel"},
		{ID: 3, Name: "Portal Gun"},
		{ID: 4, Name: "Smooth Jazz"},
		{ID: 5, Name: "Cube Momentum"},
		{ID: 6, Name: "Future Starter"},
		{ID: 7, Name: "Secret Panel"},
		{ID: 8, Name: "Wakeup"},
		{ID: 9, Name: "Incinerator"},
		{ID: 10, Name: "Laser Intro"},
		{ID: 11, Name: "Laser Stairs"},
		{ID: 12, Name: "Dual Lasers"},
		{ID: 13, Name: "Laser Over Goo"},
		{ID: 14, Name: "Catapult Intro"},
		{ID: 15, Name: "Trust Fling"},
		{ID: 16, Name: "Pit Flings"},
		{ID: 17, Name: "Fizzler Intro"},
		{ID: 18, Name: "Ceiling Catapult"},
		{ID: 19, Name: "Ricochet"},
		{ID: 20, Name: "Bridge Intro"},
		{ID: 21, Name: "Bridge The Gap"},
		{ID: 22, Name: "Turret Intro"},
		{ID: 23, Name: "Laser Relays"},
		{ID: 24, Name: "Turret Blocker"},
		{ID: 25, Name: "Laser vs Turret"},
		{ID: 26, Name: "Pull The Rug"},
		{ID: 27, Name: "Column Blocker"},
		{ID: 28, Name: "Laser Chaining"},
		{ID: 29, Name: "Triple Laser"},
		{ID: 30, Name: "Jail Break"},
		{ID: 31, Name: "Escape"},
		{ID: 32, Name: "Turret Factory"},
		{ID: 33, Name: "Turret Sabotage"},
		{ID: 34, Name: "Neurotoxin Sabotage"},
		{ID: 35, Name: "Core"},
		{ID: 36, Name: "Underground"},
		{ID: 37, Name: "Cave Johnson"},
		{ID: 38, Name: "Repulsion Intro"},
		{ID: 39, Name: "Bomb Flings"},
		{ID: 40, Name: "Crazy Box"},
		{ID: 41, Name: "PotatOS"},
		{ID: 42, Name: "Propulsion Intro"},
		{ID: 43, Name: "Propulsion Flings"},
		{ID: 44, Name: "Conversion Intro"},
		{ID: 45, Name: "Three Gels"},
		{ID: 46, Name: "Test"},
		{ID: 47, Name: "Funnel Intro"},
		{ID: 48, Name: "Ceiling Button"},
		{ID: 49, Name: "Wall Button"},
		{ID: 50, Name: "Polarity"},
		{ID: 51, Name: "Funnel Catch"},
		{ID: 52, Name: "Stop The Box"},
		{ID: 53, Name: "Laser Catapult"},
		{ID: 54, Name: "Laser Platform"},
		{ID: 55, Name: "Propulsion Catch"},
		{ID: 56, Name: "Repulsion Polarity"},
		{ID: 57, Name: "Finale 1"},
		{ID: 58, Name: "Finale 2"},
		{ID: 59, Name: "Finale 3"},
		{ID: 60, Name: "Finale 4"},
		{ID: 61, Name: "Calibration"},
		{ID: 62, Name: "Hub"},
		{ID: 63, Name: "Doors"},
		{ID: 64, Name: "Buttons"},
		{ID: 65, Name: "Lasers"},
		{ID: 66, Name: "Rat Maze"},
		{ID: 67, Name: "Laser Crusher"},
		{ID: 68, Name: "Behind The Scenes"},
		{ID: 69, Name: "Flings"},
		{ID: 70, Name: "Infinifling"},
		{ID: 71, Name: "Team Retrieval"},
		{ID: 72, Name: "Vertical Flings"},
		{ID: 73, Name: "Catapults"},
		{ID: 74, Name: "Multifling"},
		{ID: 75, Name: "Fling Crushers"},
		{ID: 76, Name: "Industrial Fan"},
		{ID: 77, Name: "Cooperative Bridges"},
		{ID: 78, Name: "Bridge Swap"},
		{ID: 79, Name: "Fling Block"},
		{ID: 80, Name: "Catapult Block"},
		{ID: 81, Name: "Bridge Fling"},
		{ID: 82, Name: "Turret Walls"},
		{ID: 83, Name: "Turret Assasin"},
		{ID: 84, Name: "Bridge Testing"},
		{ID: 85, Name: "Cooperative Funnels"},
		{ID: 86, Name: "Funnel Drill"},
		{ID: 87, Name: "Funnel Catch"},
		{ID: 88, Name: "Funnel Laser"},
		{ID: 89, Name: "Cooperative Polarity"},
		{ID: 90, Name: "Funnel Hop"},
		{ID: 91, Name: "Advanced Polarity"},
		{ID: 92, Name: "Funnel Maze"},
		{ID: 93, Name: "Turret Warehouse"},
		{ID: 94, Name: "Repulsion Jumps"},
		{ID: 95, Name: "Double Bounce"},
		{ID: 96, Name: "Bridge Repulsion"},
		{ID: 97, Name: "Wall Repulsion"},
		{ID: 98, Name: "Propulsion Crushers"},
		{ID: 99, Name: "Turret Ninja"},
		{ID: 100, Name: "Propulsion Retrieval"},
		{ID: 101, Name: "Vault Entrance"},
		{ID: 102, Name: "Seperation"},
		{ID: 103, Name: "Triple Axis"},
		{ID: 104, Name: "Catapult Catch"},
		{ID: 105, Name: "Bridge Gels"},
		{ID: 106, Name: "Maintenance"},
		{ID: 107, Name: "Bridge Catch"},
		{ID: 108, Name: "Double Lift"},
		{ID: 109, Name: "Gel Maze"},
		{ID: 110, Name: "Crazier Box"},
	}
	var filteredMaps []models.MapShort
	for _, m := range maps {
		if strings.Contains(strings.ToLower(m.Name), strings.ToLower(query)) {
			filteredMaps = append(filteredMaps, m)
		}
	}
	response.Maps = filteredMaps
	if len(response.Maps) == 0 {
		response.Maps = []models.MapShort{}
	}
	rows, err := database.DB.Query("SELECT steam_id, user_name FROM users WHERE lower(user_name) LIKE $1", "%"+query+"%")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		var user models.UserShort
		if err := rows.Scan(&user.SteamID, &user.UserName); err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		response.Players = append(response.Players, user)
	}
	if len(response.Players) == 0 {
		response.Players = []models.UserShort{}
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Search successfully retrieved.",
		Data:    response,
	})
}
