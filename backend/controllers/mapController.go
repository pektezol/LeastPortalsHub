package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"github.com/pektezol/leastportals/backend/database"
	"github.com/pektezol/leastportals/backend/models"
)

// GET Map Summary
//
//	@Summary	Get map summary with specified id.
//	@Tags		maps
//	@Accept		json
//	@Produce	json
//	@Param		id	path		int	true	"Map ID"
//	@Success	200	{object}	models.Response{data=models.Map{data=models.MapSummary}}
//	@Failure	400	{object}	models.Response
//	@Router		/maps/{id}/summary [get]
func FetchMapSummary(c *gin.Context) {
	id := c.Param("id")
	// Get map data
	var mapData models.Map
	var mapSummaryData models.MapSummary
	intID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	mapData.ID = intID
	var routers pq.StringArray
	sql := `SELECT g.name, c.name, m.name, m.description, m.showcase,
	(
	  SELECT user_name 
	  FROM map_history 
	  WHERE map_id = $1 
	  ORDER BY score_count 
	  LIMIT 1
	), 
	(
	  SELECT array_agg(user_name) 
	  FROM map_routers 
	  WHERE map_id = $1 
		AND score_count = (
		  SELECT score_count 
		  FROM map_history 
		  WHERE map_id = $1 
		  ORDER BY score_count 
		  LIMIT 1
		) 
	  GROUP BY map_routers.user_name 
	  ORDER BY user_name
	),
	(
		SELECT COALESCE(avg(rating), 0.0)
		FROM map_ratings
		WHERE map_id = $1
	)
	FROM maps m
	INNER JOIN games g ON m.game_id = g.id
	INNER JOIN chapters c ON m.chapter_id = c.id
	WHERE m.id = $1;`
	// TODO: CategoryScores
	err = database.DB.QueryRow(sql, id).Scan(&mapData.GameName, &mapData.ChapterName, &mapData.MapName, &mapSummaryData.Description, &mapSummaryData.Showcase, &mapSummaryData.FirstCompletion, &routers, &mapSummaryData.Rating)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	mapSummaryData.Routers = routers
	mapData.Data = mapSummaryData
	// Return response
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved map summary.",
		Data:    mapData,
	})
}

// GET Map Leaderboards
//
//	@Summary	Get map leaderboards with specified id.
//	@Tags		maps
//	@Accept		json
//	@Produce	json
//	@Param		id	path		int	true	"Map ID"
//	@Success	200	{object}	models.Response{data=models.Map{data=models.MapRecords}}
//	@Failure	400	{object}	models.Response
//	@Router		/maps/{id}/leaderboards [get]
func FetchMapLeaderboards(c *gin.Context) {
	id := c.Param("id")
	// Get map data
	var mapData models.Map
	var mapRecordsData models.MapRecords
	var isDisabled bool
	intID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	mapData.ID = intID
	sql := `SELECT g.name, c.name, m.name, is_disabled 
	FROM maps m
	INNER JOIN games g ON m.game_id = g.id
	INNER JOIN chapters c ON m.chapter_id = c.id
	WHERE m.id = $1;`
	err = database.DB.QueryRow(sql, id).Scan(&mapData.GameName, &mapData.ChapterName, &mapData.MapName, &isDisabled)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	if isDisabled {
		c.JSON(http.StatusBadRequest, models.ErrorResponse("Map is not available for competitive boards."))
		return
	}
	// TODO: avatar and names for host & partner
	// Get records from the map
	if mapData.GameName == "Portal 2 - Cooperative" {
		var records []models.RecordMP
		sql = `SELECT id, host_id, partner_id, score_count, score_time, host_demo_id, partner_demo_id, record_date
		FROM (
		  SELECT id, host_id, partner_id, score_count, score_time, host_demo_id, partner_demo_id, record_date,
				 ROW_NUMBER() OVER (PARTITION BY host_id, partner_id ORDER BY score_count, score_time) AS rn
		  FROM records_mp
		  WHERE map_id = $1
		) sub
		WHERE rn = 1;`
		rows, err := database.DB.Query(sql, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		placement := 1
		ties := 0
		for rows.Next() {
			var record models.RecordMP
			err := rows.Scan(&record.RecordID, &record.HostID, &record.HostName, &record.HostAvatar, &record.PartnerID, &record.PartnerName, &record.PartnerAvatar, &record.ScoreCount, &record.ScoreTime, &record.HostDemoID, &record.PartnerDemoID, &record.RecordDate)
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
			if len(records) != 0 && records[len(records)-1].ScoreTime == record.ScoreTime {
				ties++
				record.Placement = placement - ties
			} else {
				record.Placement = placement
			}
			records = append(records, record)
			placement++
		}
		mapRecordsData.Records = records
	} else {
		var records []models.RecordSP
		sql = `SELECT id, user_id, users.user_name, users.avatar_link, score_count, score_time, demo_id, record_date
		FROM (
		  SELECT id, user_id, score_count, score_time, demo_id, record_date,
				 ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY score_count, score_time) AS rn
		  FROM records_sp
		  WHERE map_id = $1
		) sub
		INNER JOIN users ON user_id = users.steam_id
		WHERE rn = 1;`
		rows, err := database.DB.Query(sql, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		placement := 1
		ties := 0
		for rows.Next() {
			var record models.RecordSP
			err := rows.Scan(&record.RecordID, &record.UserID, &record.UserName, &record.UserAvatar, &record.ScoreCount, &record.ScoreTime, &record.DemoID, &record.RecordDate)
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
			if len(records) != 0 && records[len(records)-1].ScoreTime == record.ScoreTime {
				ties++
				record.Placement = placement - ties
			} else {
				record.Placement = placement
			}
			records = append(records, record)
			placement++
		}
		mapRecordsData.Records = records
	}
	mapData.Data = mapRecordsData
	// Return response
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved map leaderboards.",
		Data:    mapData,
	})
}
