package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportals/backend/database"
	"github.com/pektezol/leastportals/backend/models"
)

// PUT Map Summary
//
//	@Summary	Edit map summary with specified map id.
//	@Tags		maps
//	@Produce	json
//	@Param		id		path		int								true	"Map ID"
//	@Param		request	body		models.EditMapSummaryRequest	true	"Body"
//	@Success	200		{object}	models.Response{data=models.EditMapSummaryRequest}
//	@Failure	400		{object}	models.Response
//	@Router		/maps/{id}/summary [put]
func EditMapSummary(c *gin.Context) {
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse("User not logged in."))
		return
	}
	var moderator bool
	for _, title := range user.(models.User).Titles {
		if title == "Moderator" {
			moderator = true
		}
	}
	if !moderator {
		c.JSON(http.StatusUnauthorized, "Insufficient permissions.")
		return
	}
	// Bind parameter and body
	id := c.Param("id")
	mapID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	var request models.EditMapSummaryRequest
	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	// Fetch route category and score count
	var categoryID, scoreCount int
	sql := `SELECT mr.category_id, mr.score_count
	FROM map_routes mr
	INNER JOIN maps m
	WHERE m.id = $1 AND mr.id = $2`
	err = database.DB.QueryRow(sql, mapID, request.RouteID).Scan(&categoryID, &scoreCount)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	// Start database transaction
	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse(err.Error()))
		return
	}
	defer tx.Rollback()
	// Update database with new data
	sql = `UPDATE map_routes SET score_count = $2, description = $3, showcase = $4 WHERE id = $1`
	_, err = tx.Exec(sql, request.RouteID, request.ScoreCount, request.Description, request.Showcase)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	sql = `UPDATE map_history SET user_name = $3, score_count = $4, record_date = $5 WHERE map_id = $1 AND category_id = $2`
	_, err = tx.Exec(sql, mapID, categoryID, request.UserName, request.ScoreCount, request.RecordDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	if err = tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse(err.Error()))
		return
	}
	// Return response
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully updated map summary.",
		Data:    request,
	})
}
