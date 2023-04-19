package controllers

import (
	"net/http"

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
//	@Summary	Get rankings of every player.
//	@Accept		json
//	@Produce	json
//	@Success	200		{object}	models.Response{data=models.RankingsResponse}
//	@Failure	400		{object}	models.Response
//	@Router		/demo [get]
func Rankings(c *gin.Context) {
	rows, err := database.DB.Query(`SELECT steam_id, username FROM users;`)
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
		WHERE is_coop = FALSE AND is_disabled = false) FROM records_sp WHERE user_id = $1;`
		err = database.DB.QueryRow(sql, userID).Scan(&uniqueSingleUserRecords, &totalSingleMaps)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		// Has all singleplayer records
		if uniqueSingleUserRecords == totalSingleMaps {
			var ranking models.UserRanking
			ranking.UserID = userID
			ranking.Username = username
			sql := `SELECT DISTINCT map_id, score_count FROM records_sp WHERE user_id = $1 ORDER BY map_id, score_count;`
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
		WHERE is_coop = TRUE AND is_disabled = false) FROM records_mp WHERE host_id = $1 OR partner_id = $2;`
		err = database.DB.QueryRow(sql, userID, userID).Scan(&uniqueMultiUserRecords, &totalMultiMaps)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		// Has all singleplayer records
		if uniqueMultiUserRecords == totalMultiMaps {
			var ranking models.UserRanking
			ranking.UserID = userID
			ranking.Username = username
			sql := `SELECT DISTINCT map_id, score_count FROM records_mp WHERE host_id = $1 OR partner_id = $2 ORDER BY map_id, score_count;`
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
