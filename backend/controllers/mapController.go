package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportals/backend/database"
	"github.com/pektezol/leastportals/backend/models"
)

func FetchMap(c *gin.Context) {
	id := c.Param("id")
	// Get map data
	var mapData models.Map
	var isDisabled bool
	intID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	mapData.ID = intID
	sql := `SELECT map_name, wr_score, wr_time, is_coop, is_disabled FROM maps WHERE id = $1;`
	err = database.DB.QueryRow(sql, id).Scan(&mapData.Name, &mapData.ScoreWR, &mapData.TimeWR, &mapData.IsCoop, &isDisabled)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	if isDisabled {
		c.JSON(http.StatusBadRequest, models.ErrorResponse("Map is not available for competitive boards."))
		return
	}
	// Get records from the map
	if mapData.IsCoop {
		var records []models.RecordMP
		sql = `SELECT id, host_id, partner_id, score_count, score_time, host_demo_id, partner_demo_id, record_date
		FROM records_mp WHERE map_id = $1 ORDER BY score_count, score_time;`
		rows, err := database.DB.Query(sql, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		placement := 1
		ties := 0
		for rows.Next() {
			var record models.RecordMP
			err := rows.Scan(&record.RecordID, &record.HostID, &record.PartnerID, &record.ScoreCount, &record.ScoreTime, &record.HostDemoID, &record.PartnerDemoID, &record.RecordDate)
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
		mapData.Records = records
	} else {
		var records []models.RecordSP
		sql = `SELECT id, user_id, score_count, score_time, demo_id, record_date
		FROM records_sp WHERE map_id = $1 ORDER BY score_count, score_time;`
		rows, err := database.DB.Query(sql, id)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		placement := 1
		ties := 0
		for rows.Next() {
			var record models.RecordSP
			err := rows.Scan(&record.RecordID, &record.UserID, &record.ScoreCount, &record.ScoreTime, &record.DemoID, &record.RecordDate)
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
		mapData.Records = records
	}
	// Return response
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved map data.",
		Data:    mapData,
	})
}
