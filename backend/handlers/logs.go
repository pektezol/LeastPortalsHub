package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/leastportalshub/backend/database"
	"github.com/pektezol/leastportalshub/backend/models"
)

const (
	LogTypeMod   string = "Mod"
	LogTypeScore string = "Score"
	LogTypeLogin string = "Login"

	LogDescriptionLoginSuccess      string = "Success"
	LogDescriptionLoginFailToken    string = "TokenFail"
	LogDescriptionLoginFailValidate string = "ValidateFail"
	LogDescriptionLoginFailSummary  string = "SummaryFail"
)

type Log struct {
	User        models.UserShort `json:"user"`
	Type        string           `json:"type"`
	Description string           `json:"description"`
}

type LogsResponse struct {
	Logs []LogsResponseDetails `json:"logs"`
}

type LogsResponseDetails struct {
	User models.UserShort `json:"user"`
	Log  string           `json:"detail"`
}

func ModLogs(c *gin.Context) {
	mod, exists := c.Get("mod")
	if !exists || !mod.(bool) {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse("Insufficient permissions."))
		return
	}
	response := LogsResponse{Logs: []LogsResponseDetails{}}
	sql := `SELECT u.user_name, l.user_id, l.type, l.description 
	FROM logs l INNER JOIN users u ON l.user_id = u.steam_id WHERE type != 'Score'`
	rows, err := database.DB.Query(sql)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	for rows.Next() {
		log := Log{}
		err = rows.Scan(log.User.UserName, log.User.SteamID, log.Type, log.Description)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		detail := fmt.Sprintf("%s.%s", log.Type, log.Description)
		response.Logs = append(response.Logs, LogsResponseDetails{
			User: models.UserShort{
				SteamID:  log.User.SteamID,
				UserName: log.User.UserName,
			},
			Log: detail,
		})
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved logs.",
		Data:    response,
	})
}

func ScoreLogs(c *gin.Context) {
	response := LogsResponse{Logs: []LogsResponseDetails{}}
	sql := `SELECT u.user_name, l.user_id, l.type, l.description 
	FROM logs l INNER JOIN users u ON l.user_id = u.steam_id WHERE type = 'Score'`
	rows, err := database.DB.Query(sql)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	for rows.Next() {
		log := Log{}
		err = rows.Scan(log.User.UserName, log.User.SteamID, log.Type, log.Description)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		detail := fmt.Sprintf("%s.%s", log.Type, log.Description)
		response.Logs = append(response.Logs, LogsResponseDetails{
			User: models.UserShort{
				SteamID:  log.User.SteamID,
				UserName: log.User.UserName,
			},
			Log: detail,
		})
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully retrieved score logs.",
		Data:    response,
	})
}

func CreateLog(user_id string, log_type string, log_description string) (err error) {
	sql := `INSERT INTO logs (user_id, "type", description) VALUES($1, $2, $3)`
	_, err = database.DB.Exec(sql)
	if err != nil {
		return err
	}
	return nil
}
