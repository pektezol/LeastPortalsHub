package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportalshub/backend/database"
	"github.com/pektezol/leastportalshub/backend/models"
)

const (
	LogTypeMod    string = "Mod"
	LogTypeUser   string = "User"
	LogTypeRecord string = "Record"

	LogDescriptionUserLoginSuccess         string = "LoginSuccess"
	LogDescriptionUserLoginFailToken       string = "LoginTokenFail"
	LogDescriptionUserLoginFailValidate    string = "LoginValidateFail"
	LogDescriptionUserLoginFailSummary     string = "LoginSummaryFail"
	LogDescriptionUserUpdateSuccess        string = "UpdateSuccess"
	LogDescriptionUserUpdateFail           string = "UpdateFail"
	LogDescriptionUserUpdateSummaryFail    string = "UpdateSummaryFail"
	LogDescriptionUserUpdateCountrySuccess string = "UpdateCountrySuccess"
	LogDescriptionUserUpdateCountryFail    string = "UpdateCountryFail"

	LogDescriptionMapSummaryCreateSuccess    string = "MapSummaryCreateSuccess"
	LogDescriptionMapSummaryCreateFail       string = "MapSummaryCreateFail"
	LogDescriptionMapSummaryEditSuccess      string = "MapSummaryEditSuccess"
	LogDescriptionMapSummaryEditFail         string = "MapSummaryEditFail"
	LogDescriptionMapSummaryEditImageSuccess string = "MapSummaryEditImageSuccess"
	LogDescriptionMapSummaryEditImageFail    string = "MapSummaryEditImageFail"
	LogDescriptionMapSummaryDeleteSuccess    string = "MapSummaryDeleteSuccess"
	LogDescriptionMapSummaryDeleteFail       string = "MapSummaryDeleteFail"

	LogDescriptionCreateRecordSuccess            string = "CreateRecordSuccess"
	LogDescriptionCreateRecordInsertRecordFail   string = "InsertRecordFail"
	LogDescriptionCreateRecordInsertDemoFail     string = "InsertDemoFail"
	LogDescriptionCreateRecordProcessDemoFail    string = "ProcessDemoFail"
	LogDescriptionCreateRecordCreateDemoFail     string = "CreateDemoFail"
	LogDescriptionCreateRecordOpenDemoFail       string = "OpenDemoFail"
	LogDescriptionCreateRecordSaveDemoFail       string = "SaveDemoFail"
	LogDescriptionCreateRecordInvalidRequestFail string = "InvalidRequestFail"
	LogDescriptionDeleteRecordSuccess            string = "DeleteRecordSuccess"
	LogDescriptionDeleteRecordFail               string = "DeleteRecordFail"
)

type Log struct {
	User        models.UserShort `json:"user"`
	Type        string           `json:"type"`
	Description string           `json:"description"`
	Message     string           `json:"message"`
	Date        time.Time        `json:"date"`
}

type LogsResponse struct {
	Logs []LogsResponseDetails `json:"logs"`
}

type LogsResponseDetails struct {
	User    models.UserShort `json:"user"`
	Log     string           `json:"detail"`
	Message string           `json:"message"`
	Date    time.Time        `json:"date"`
}

type ScoreLogsResponse struct {
	Logs []ScoreLogsResponseDetails `json:"scores"`
}

type ScoreLogsResponseDetails struct {
	Game       models.Game      `json:"game"`
	User       models.UserShort `json:"user"`
	Map        models.MapShort  `json:"map"`
	ScoreCount int              `json:"score_count"`
	ScoreTime  int              `json:"score_time"`
	DemoID     string           `json:"demo_id"`
	Date       time.Time        `json:"date"`
}

// GET Mod Logs
//
//	@Description	Get mod logs.
//	@Tags			logs
//	@Produce		json
//	@Param			Authorization	header		string	true	"JWT Token"
//	@Success		200				{object}	models.Response{data=LogsResponse}
//	@Router			/logs/mod [get]
func ModLogs(c *gin.Context) {
	mod, exists := c.Get("mod")
	if !exists || !mod.(bool) {
		c.JSON(http.StatusOK, models.ErrorResponse("Insufficient permissions."))
		return
	}
	response := LogsResponse{Logs: []LogsResponseDetails{}}
	sql := `SELECT u.user_name, l.user_id, l.type, l.description, l.date 
	FROM logs l INNER JOIN users u ON l.user_id = u.steam_id WHERE type != 'Score'
	ORDER BY l.date DESC LIMIT 100;`
	rows, err := database.DB.Query(sql)
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	for rows.Next() {
		log := Log{}
		err = rows.Scan(&log.User.UserName, &log.User.SteamID, &log.Type, &log.Description, &log.Date)
		if err != nil {
			c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
			return
		}
		detail := fmt.Sprintf("%s.%s", log.Type, log.Description)
		response.Logs = append(response.Logs, LogsResponseDetails{
			User: models.UserShort{
				SteamID:  log.User.SteamID,
				UserName: log.User.UserName,
			},
			Log:     detail,
			Message: log.Message,
			Date:    log.Date,
		})
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved logs.",
		Data:    response,
	})
}

// GET Score Logs
//
//	@Description	Get score logs of every player.
//	@Tags			logs
//	@Produce		json
//	@Success		200	{object}	models.Response{data=ScoreLogsResponse}
//	@Router			/logs/score [get]
func ScoreLogs(c *gin.Context) {
	response := ScoreLogsResponse{Logs: []ScoreLogsResponseDetails{}}
	sql := `SELECT g.id,
		g."name",
		g.is_coop,
		rs.map_id,
		m.name AS map_name,
		u.steam_id,
		u.user_name,
		rs.score_count,
		rs.score_time,
		rs.demo_id,
		rs.record_date
	FROM (
		SELECT id, map_id, user_id, score_count, score_time, demo_id, record_date
		FROM records_sp WHERE is_deleted = false

		UNION ALL

		SELECT id, map_id, host_id AS user_id, score_count, score_time, host_demo_id AS demo_id, record_date
		FROM records_mp WHERE is_deleted = false

		UNION ALL

		SELECT id, map_id, partner_id AS user_id, score_count, score_time, partner_demo_id AS demo_id, record_date
		FROM records_mp WHERE is_deleted = false
	) AS rs
	JOIN users u ON rs.user_id = u.steam_id
	JOIN maps m ON rs.map_id = m.id
	JOIN games g ON m.game_id = g.id 
	ORDER BY rs.record_date DESC LIMIT 100;`
	rows, err := database.DB.Query(sql)
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	for rows.Next() {
		score := ScoreLogsResponseDetails{}
		err = rows.Scan(&score.Game.ID, &score.Game.Name, &score.Game.IsCoop, &score.Map.ID, &score.Map.Name, &score.User.SteamID, &score.User.UserName, &score.ScoreCount, &score.ScoreTime, &score.DemoID, &score.Date)
		if err != nil {
			c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
			return
		}
		response.Logs = append(response.Logs, score)
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved score logs.",
		Data:    response,
	})
}

func CreateLog(userID string, logType string, logDescription string, logMessage ...string) (err error) {
	message := "-"
	if len(logMessage) == 1 {
		message = logMessage[0]
	}
	sql := `INSERT INTO logs (user_id, "type", description, message) VALUES($1, $2, $3, $4)`
	_, err = database.DB.Exec(sql, userID, logType, logDescription, message)
	if err != nil {
		return err
	}
	return nil
}
