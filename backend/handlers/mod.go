package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportalshub/backend/database"
	"github.com/pektezol/leastportalshub/backend/models"
)

type CreateMapSummaryRequest struct {
	CategoryID  int       `json:"category_id" binding:"required"`
	Description string    `json:"description" binding:"required"`
	Showcase    string    `json:"showcase"`
	UserName    string    `json:"user_name" binding:"required"`
	ScoreCount  *int      `json:"score_count"`
	RecordDate  time.Time `json:"record_date" binding:"required"`
}

type EditMapSummaryRequest struct {
	RouteID     int       `json:"route_id" binding:"required"`
	Description string    `json:"description" binding:"required"`
	Showcase    string    `json:"showcase"`
	UserName    string    `json:"user_name" binding:"required"`
	ScoreCount  int       `json:"score_count"`
	RecordDate  time.Time `json:"record_date" binding:"required"`
}

type DeleteMapSummaryRequest struct {
	RouteID int `json:"route_id" binding:"required"`
}

type EditMapImageRequest struct {
	Image string `json:"image" binding:"required"`
}

// POST Map Summary
//
//	@Description	Create map summary with specified map id.
//	@Tags			maps / summary
//	@Produce		json
//	@Param			Authorization	header		string					true	"JWT Token"
//	@Param			mapid			path		int						true	"Map ID"
//	@Param			request			body		CreateMapSummaryRequest	true	"Body"
//	@Success		200				{object}	models.Response{data=CreateMapSummaryRequest}
//	@Router			/maps/{mapid}/summary [post]
func CreateMapSummary(c *gin.Context) {
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusOK, models.ErrorResponse("User not logged in."))
		return
	}
	mod, exists := c.Get("mod")
	if !exists || !mod.(bool) {
		c.JSON(http.StatusOK, models.ErrorResponse("Insufficient permissions."))
		return
	}
	// Bind parameter and body
	id := c.Param("mapid")
	mapID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	var request CreateMapSummaryRequest
	if err := c.BindJSON(&request); err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryCreateFail, fmt.Sprintf("BIND: %s", err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	// Start database transaction
	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	defer tx.Rollback()
	// Fetch route category and score count
	var checkMapID int
	sql := `SELECT m.id FROM maps m WHERE m.id = $1`
	err = database.DB.QueryRow(sql, mapID).Scan(&checkMapID)
	if err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryCreateFail, fmt.Sprintf("SELECT#maps: %s", err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	if mapID != checkMapID {
		c.JSON(http.StatusOK, models.ErrorResponse("Map ID does not exist."))
		return
	}
	// Update database with new data
	sql = `INSERT INTO map_routes (map_id,category_id,score_count,description,showcase)
	VALUES ($1,$2,$3,$4,$5)`
	_, err = tx.Exec(sql, mapID, request.CategoryID, request.ScoreCount, request.Description, request.Showcase)
	if err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryCreateFail, fmt.Sprintf("INSERT#map_routes: %s", err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	sql = `INSERT INTO map_history (map_id,category_id,user_name,score_count,record_date)
	VALUES ($1,$2,$3,$4,$5)`
	_, err = tx.Exec(sql, mapID, request.CategoryID, request.UserName, request.ScoreCount, request.RecordDate)
	if err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryCreateFail, fmt.Sprintf("INSERT#map_history: %s", err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	if err = tx.Commit(); err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryCreateSuccess, fmt.Sprintf("MapID: %d | CategoryID: %d | ScoreCount: %d", mapID, request.CategoryID, *request.ScoreCount))
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully created map summary.",
		Data:    request,
	})
}

// PUT Map Summary
//
//	@Description	Edit map summary with specified map id.
//	@Tags			maps / summary
//	@Produce		json
//	@Param			Authorization	header		string					true	"JWT Token"
//	@Param			mapid			path		int						true	"Map ID"
//	@Param			request			body		EditMapSummaryRequest	true	"Body"
//	@Success		200				{object}	models.Response{data=EditMapSummaryRequest}
//	@Router			/maps/{mapid}/summary [put]
func EditMapSummary(c *gin.Context) {
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusOK, models.ErrorResponse("User not logged in."))
		return
	}
	mod, exists := c.Get("mod")
	if !exists || !mod.(bool) {
		c.JSON(http.StatusOK, models.ErrorResponse("Insufficient permissions."))
		return
	}
	// Bind parameter and body
	id := c.Param("mapid")
	mapID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	var request EditMapSummaryRequest
	if err := c.BindJSON(&request); err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryEditFail, fmt.Sprintf("BIND: %s", err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	// Start database transaction
	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	defer tx.Rollback()
	// Fetch route category and score count
	var categoryID, scoreCount, historyID int
	sql := `SELECT mr.category_id, mr.score_count FROM map_routes mr INNER JOIN maps m ON m.id = mr.map_id WHERE m.id = $1 AND mr.id = $2`
	err = database.DB.QueryRow(sql, mapID, request.RouteID).Scan(&categoryID, &scoreCount)
	if err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryEditFail, fmt.Sprintf("(RouteID: %d) SELECT#map_routes: %s", request.RouteID, err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	sql = `SELECT mh.id FROM map_history mh WHERE mh.score_count = $1 AND mh.category_id = $2 AND mh.map_id = $3`
	err = database.DB.QueryRow(sql, scoreCount, categoryID, mapID).Scan(&historyID)
	if err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryEditFail, fmt.Sprintf("(RouteID: %d) SELECT#map_history: %s", request.RouteID, err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	// Update database with new data
	sql = `UPDATE map_routes SET score_count = $2, description = $3, showcase = $4 WHERE id = $1`
	_, err = tx.Exec(sql, request.RouteID, request.ScoreCount, request.Description, request.Showcase)
	if err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryEditFail, fmt.Sprintf("(RouteID: %d) UPDATE#map_routes: %s", request.RouteID, err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	sql = `UPDATE map_history SET user_name = $2, score_count = $3, record_date = $4 WHERE id = $1`
	_, err = tx.Exec(sql, historyID, request.UserName, request.ScoreCount, request.RecordDate)
	if err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryEditFail, fmt.Sprintf("(HistoryID: %d) UPDATE#map_history: %s", historyID, err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	if err = tx.Commit(); err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryEditSuccess, fmt.Sprintf("MapID: %d | CategoryID: %d | ScoreCount: %d", mapID, categoryID, scoreCount))
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully updated map summary.",
		Data:    request,
	})
}

// DELETE Map Summary
//
//	@Description	Delete map summary with specified map id.
//	@Tags			maps / summary
//	@Produce		json
//	@Param			Authorization	header		string					true	"JWT Token"
//	@Param			mapid			path		int						true	"Map ID"
//	@Param			request			body		DeleteMapSummaryRequest	true	"Body"
//	@Success		200				{object}	models.Response{data=DeleteMapSummaryRequest}
//	@Router			/maps/{mapid}/summary [delete]
func DeleteMapSummary(c *gin.Context) {
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusOK, models.ErrorResponse("User not logged in."))
		return
	}
	mod, exists := c.Get("mod")
	if !exists || !mod.(bool) {
		c.JSON(http.StatusOK, models.ErrorResponse("Insufficient permissions."))
		return
	}
	// Bind parameter and body
	id := c.Param("mapid")
	mapID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	var request DeleteMapSummaryRequest
	if err := c.BindJSON(&request); err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryEditFail, fmt.Sprintf("(RouteID: %d) BIND: %s", request.RouteID, err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	// Start database transaction
	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	defer tx.Rollback()
	// Fetch route category and score count
	var checkMapID, scoreCount, categoryID, mapHistoryID int
	sql := `SELECT m.id, mr.score_count, mr.category_id FROM maps m INNER JOIN map_routes mr ON m.id=mr.map_id WHERE m.id = $1 AND mr.id = $2`
	err = database.DB.QueryRow(sql, mapID, request.RouteID).Scan(&checkMapID, &scoreCount, &categoryID)
	if err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryDeleteFail, fmt.Sprintf("(RouteID: %d) SELECT#map_routes: %s", request.RouteID, err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	if mapID != checkMapID {
		c.JSON(http.StatusOK, models.ErrorResponse("Map ID does not exist."))
		return
	}
	sql = `SELECT mh.id FROM maps m INNER JOIN map_routes mr ON m.id=mr.map_id INNER JOIN map_history mh ON m.id=mh.map_id WHERE m.id = $1 AND mh.category_id = $2 AND mh.score_count = $3`
	err = database.DB.QueryRow(sql, mapID, categoryID, scoreCount).Scan(&mapHistoryID)
	if err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryDeleteFail, fmt.Sprintf("(RouteID: %d) SELECT#map_history: %s", request.RouteID, err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	// Update database with new data
	sql = `DELETE FROM map_routes mr WHERE mr.id = $1 `
	_, err = tx.Exec(sql, request.RouteID)
	if err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryDeleteFail, fmt.Sprintf("(RouteID: %d) DELETE#map_routes: %s", request.RouteID, err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	sql = `DELETE FROM map_history mh WHERE mh.id = $1`
	_, err = tx.Exec(sql, mapHistoryID)
	if err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryDeleteFail, fmt.Sprintf("(HistoryID: %d) DELETE#map_history: %s", mapHistoryID, err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	if err = tx.Commit(); err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryDeleteSuccess, fmt.Sprintf("MapID: %d | CategoryID: %d | ScoreCount: %d", mapID, categoryID, scoreCount))
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully delete map summary.",
		Data:    request,
	})
}

// PUT Map Image
//
//	@Description	Edit map image with specified map id.
//	@Tags			maps / summary
//	@Produce		json
//	@Param			Authorization	header		string				true	"JWT Token"
//	@Param			mapid			path		int					true	"Map ID"
//	@Param			request			body		EditMapImageRequest	true	"Body"
//	@Success		200				{object}	models.Response{data=EditMapImageRequest}
//	@Router			/maps/{mapid}/image [put]
func EditMapImage(c *gin.Context) {
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusOK, models.ErrorResponse("User not logged in."))
		return
	}
	mod, exists := c.Get("mod")
	if !exists || !mod.(bool) {
		c.JSON(http.StatusOK, models.ErrorResponse("Insufficient permissions."))
		return
	}
	// Bind parameter and body
	id := c.Param("mapid")
	mapID, err := strconv.Atoi(id)
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	var request EditMapImageRequest
	if err := c.BindJSON(&request); err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryEditImageFail, fmt.Sprintf("BIND: %s", err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	// Update database with new data
	sql := `UPDATE maps SET image = $2 WHERE id = $1`
	_, err = database.DB.Exec(sql, mapID, request.Image)
	if err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryEditImageFail, fmt.Sprintf("UPDATE#maps: %s", err.Error()))
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	CreateLog(user.(models.User).SteamID, LogTypeMod, LogDescriptionMapSummaryEditImageSuccess)
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully updated map image.",
		Data:    request,
	})
}
