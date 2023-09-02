package handlers

import (
	"log"
	"net/http"
	"sort"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportalshub/backend/database"
	"github.com/pektezol/leastportalshub/backend/models"
)

type SearchResponse struct {
	Players []models.UserShort `json:"players"`
	Maps    []models.MapShort  `json:"maps"`
}

type RankingsResponse struct {
	Overall      []models.UserRanking `json:"rankings_overall"`
	Singleplayer []models.UserRanking `json:"rankings_singleplayer"`
	Multiplayer  []models.UserRanking `json:"rankings_multiplayer"`
}

// GET Rankings
//
//	@Description	Get rankings of every player.
//	@Tags			rankings
//	@Produce		json
//	@Success		200	{object}	models.Response{data=RankingsResponse}
//	@Failure		400	{object}	models.Response
//	@Router			/rankings [get]
func Rankings(c *gin.Context) {
	response := RankingsResponse{
		Overall:      []models.UserRanking{},
		Singleplayer: []models.UserRanking{},
		Multiplayer:  []models.UserRanking{},
	}
	// Singleplayer rankings
	sql := `SELECT u.steam_id, u.user_name, COUNT(DISTINCT map_id), 
	(SELECT COUNT(maps.name) FROM maps INNER JOIN games g ON maps.game_id = g.id WHERE g.is_coop = FALSE AND is_disabled = false), 
	(SELECT SUM(min_score_count) AS total_min_score_count FROM (
			SELECT
			user_id,
			MIN(score_count) AS min_score_count
			FROM records_sp
			GROUP BY user_id, map_id
			) AS subquery
		WHERE user_id = u.steam_id) 
	FROM records_sp sp JOIN users u ON u.steam_id = sp.user_id GROUP BY u.steam_id, u.user_name`
	rows, err := database.DB.Query(sql)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	for rows.Next() {
		ranking := models.UserRanking{}
		var currentCount int
		var totalCount int
		err = rows.Scan(&ranking.User.SteamID, &ranking.User.UserName, &currentCount, &totalCount, &ranking.TotalScore)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		if currentCount != totalCount {
			continue
		}
		response.Singleplayer = append(response.Singleplayer, ranking)
	}
	// Multiplayer rankings
	sql = `SELECT u.steam_id, u.user_name, COUNT(DISTINCT map_id), 
	(SELECT COUNT(maps.name) FROM maps INNER JOIN games g ON maps.game_id = g.id WHERE g.is_coop = FALSE AND is_disabled = false),
	(SELECT SUM(min_score_count) AS total_min_score_count FROM (
			SELECT
			host_id,
			partner_id,
			MIN(score_count) AS min_score_count
			FROM records_mp
			GROUP BY host_id, partner_id, map_id
			) AS subquery
		WHERE host_id = u.steam_id OR partner_id = u.steam_id) 
	FROM records_mp mp JOIN users u ON u.steam_id = mp.host_id OR u.steam_id = mp.partner_id GROUP BY u.steam_id, u.user_name`
	rows, err = database.DB.Query(sql)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	for rows.Next() {
		ranking := models.UserRanking{}
		var currentCount int
		var totalCount int
		err = rows.Scan(&ranking.User.SteamID, &ranking.User.UserName, &currentCount, &totalCount, &ranking.TotalScore)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		if currentCount != totalCount {
			continue
		}
		response.Multiplayer = append(response.Multiplayer, ranking)
	}
	// Has both so they are qualified for overall ranking
	for _, spRanking := range response.Singleplayer {
		for _, mpRanking := range response.Multiplayer {
			if spRanking.User.SteamID == mpRanking.User.SteamID {
				totalScore := spRanking.TotalScore + mpRanking.TotalScore
				overallRanking := models.UserRanking{
					User:       spRanking.User,
					TotalScore: totalScore,
				}
				response.Overall = append(response.Overall, overallRanking)
			}
		}
	}
	sort.Slice(response.Singleplayer, func(i, j int) bool {
		return response.Singleplayer[i].TotalScore < response.Singleplayer[j].TotalScore
	})
	sort.Slice(response.Multiplayer, func(i, j int) bool {
		return response.Multiplayer[i].TotalScore < response.Multiplayer[j].TotalScore
	})
	sort.Slice(response.Overall, func(i, j int) bool {
		return response.Overall[i].TotalScore < response.Overall[j].TotalScore
	})
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved rankings.",
		Data:    response,
	})
}

// GET Search With Query
//
//	@Description	Get all user and map data matching to the query.
//	@Tags			search
//	@Produce		json
//	@Param			q	query		string	false	"Search user or map name."
//	@Success		200	{object}	models.Response{data=SearchResponse}
//	@Failure		400	{object}	models.Response
//	@Router			/search [get]
func SearchWithQuery(c *gin.Context) {
	query := c.Query("q")
	query = strings.ToLower(query)
	log.Println(query)
	var response SearchResponse
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
