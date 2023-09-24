package handlers

import (
	"context"
	"encoding/base64"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/pektezol/leastportalshub/backend/database"
	"github.com/pektezol/leastportalshub/backend/models"
	"github.com/pektezol/leastportalshub/backend/parser"
	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2/jwt"
	"google.golang.org/api/drive/v3"
)

type RecordRequest struct {
	HostDemo        *multipart.FileHeader `json:"host_demo" form:"host_demo" binding:"required" swaggerignore:"true"`
	PartnerDemo     *multipart.FileHeader `json:"partner_demo" form:"partner_demo" swaggerignore:"true"`
	IsPartnerOrange bool                  `json:"is_partner_orange" form:"is_partner_orange"`
	PartnerID       string                `json:"partner_id" form:"partner_id"`
}

type RecordResponse struct {
	ScoreCount int `json:"score_count"`
	ScoreTime  int `json:"score_time"`
}

// POST Record
//
//	@Description	Post record with demo of a specific map.
//	@Tags			maps
//	@Accept			mpfd
//	@Produce		json
//	@Param			mapid				path		int		true	"Map ID"
//	@Param			Authorization		header		string	true	"JWT Token"
//	@Param			host_demo			formData	file	true	"Host Demo"
//	@Param			partner_demo		formData	file	false	"Partner Demo"
//	@Param			is_partner_orange	formData	boolean	false	"Is Partner Orange"
//	@Param			partner_id			formData	string	false	"Partner ID"
//	@Success		200					{object}	models.Response{data=RecordResponse}
//	@Router			/maps/{mapid}/record [post]
func CreateRecordWithDemo(c *gin.Context) {
	mapId := c.Param("mapid")
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusOK, models.ErrorResponse("User not logged in."))
		return
	}
	// Check if map is sp or mp
	var gameName string
	var isCoop bool
	var isDisabled bool
	sql := `SELECT g.name, m.is_disabled FROM maps m INNER JOIN games g ON m.game_id=g.id WHERE m.id = $1`
	err := database.DB.QueryRow(sql, mapId).Scan(&gameName, &isDisabled)
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	if isDisabled {
		CreateLog(user.(models.User).SteamID, LogTypeRecord, LogDescriptionRecordFailInvalidRequest)
		c.JSON(http.StatusOK, models.ErrorResponse("Map is not available for competitive boards."))
		return
	}
	if gameName == "Portal 2 - Cooperative" {
		isCoop = true
	}
	// Get record request
	var record RecordRequest
	if err := c.ShouldBind(&record); err != nil {
		CreateLog(user.(models.User).SteamID, LogTypeRecord, LogDescriptionRecordFailInvalidRequest)
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	if isCoop && (record.PartnerDemo == nil || record.PartnerID == "") {
		CreateLog(user.(models.User).SteamID, LogTypeRecord, LogDescriptionRecordFailInvalidRequest)
		c.JSON(http.StatusOK, models.ErrorResponse("Invalid entry for coop record submission."))
		return
	}
	// Demo files
	demoFiles := []*multipart.FileHeader{record.HostDemo}
	if isCoop {
		demoFiles = append(demoFiles, record.PartnerDemo)
	}
	var hostDemoUUID, hostDemoFileID, partnerDemoUUID, partnerDemoFileID string
	var hostDemoScoreCount, hostDemoScoreTime int
	client := serviceAccount()
	srv, err := drive.New(client)
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	// Create database transaction for inserts
	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	// Defer to a rollback in case anything fails
	defer tx.Rollback()
	for i, header := range demoFiles {
		uuid := uuid.New().String()
		// Upload & insert into demos
		err = c.SaveUploadedFile(header, "backend/parser/"+uuid+".dem")
		if err != nil {
			CreateLog(user.(models.User).SteamID, LogTypeRecord, LogDescriptionRecordFailSaveDemo)
			c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
			return
		}
		defer os.Remove("backend/parser/" + uuid + ".dem")
		f, err := os.Open("backend/parser/" + uuid + ".dem")
		if err != nil {
			CreateLog(user.(models.User).SteamID, LogTypeRecord, LogDescriptionRecordFailOpenDemo)
			c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
			return
		}
		defer f.Close()
		file, err := createFile(srv, uuid+".dem", "application/octet-stream", f, os.Getenv("GOOGLE_FOLDER_ID"))
		if err != nil {
			CreateLog(user.(models.User).SteamID, LogTypeRecord, LogDescriptionRecordFailCreateDemo)
			c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
			return
		}
		hostDemoScoreCount, hostDemoScoreTime, err = parser.ProcessDemo("backend/parser/" + uuid + ".dem")
		if err != nil {
			deleteFile(srv, file.Id)
			CreateLog(user.(models.User).SteamID, LogTypeRecord, LogDescriptionRecordFailProcessDemo)
			c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
			return
		}
		if i == 0 {
			hostDemoFileID = file.Id
			hostDemoUUID = uuid
		} else if i == 1 {
			partnerDemoFileID = file.Id
			partnerDemoUUID = uuid
		}
		_, err = tx.Exec(`INSERT INTO demos (id,location_id) VALUES ($1,$2)`, uuid, file.Id)
		if err != nil {
			deleteFile(srv, file.Id)
			CreateLog(user.(models.User).SteamID, LogTypeRecord, LogDescriptionRecordFailInsertDemo)
			c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
			return
		}
	}
	// Insert into records
	if isCoop {
		sql := `INSERT INTO records_mp(map_id,score_count,score_time,host_id,partner_id,host_demo_id,partner_demo_id) 
		VALUES($1, $2, $3, $4, $5, $6, $7)`
		var hostID string
		var partnerID string
		if record.IsPartnerOrange {
			hostID = user.(models.User).SteamID
			partnerID = record.PartnerID
		} else {
			partnerID = user.(models.User).SteamID
			hostID = record.PartnerID
		}
		_, err := tx.Exec(sql, mapId, hostDemoScoreCount, hostDemoScoreTime, hostID, partnerID, hostDemoUUID, partnerDemoUUID)
		if err != nil {
			deleteFile(srv, hostDemoFileID)
			deleteFile(srv, partnerDemoFileID)
			CreateLog(user.(models.User).SteamID, LogTypeRecord, LogDescriptionRecordFailInsertRecord)
			c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
			return
		}
		// If a new world record based on portal count
		// if record.ScoreCount < wrScore {
		// 	_, err := tx.Exec(`UPDATE maps SET wr_score = $1, wr_time = $2 WHERE id = $3`, record.ScoreCount, record.ScoreTime, mapId)
		// 	if err != nil {
		// 		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		// 		return
		// 	}
		// }
	} else {
		sql := `INSERT INTO records_sp(map_id,score_count,score_time,user_id,demo_id) 
		VALUES($1, $2, $3, $4, $5)`
		_, err := tx.Exec(sql, mapId, hostDemoScoreCount, hostDemoScoreTime, user.(models.User).SteamID, hostDemoUUID)
		if err != nil {
			deleteFile(srv, hostDemoFileID)
			CreateLog(user.(models.User).SteamID, LogTypeRecord, LogDescriptionRecordFailInsertRecord)
			c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
			return
		}
		// If a new world record based on portal count
		// if record.ScoreCount < wrScore {
		// 	_, err := tx.Exec(`UPDATE maps SET wr_score = $1, wr_time = $2 WHERE id = $3`, record.ScoreCount, record.ScoreTime, mapId)
		// 	if err != nil {
		// 		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		// 		return
		// 	}
		// }
	}
	if err = tx.Commit(); err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	CreateLog(user.(models.User).SteamID, LogTypeRecord, LogDescriptionRecordSuccess)
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully created record.",
		Data:    RecordResponse{ScoreCount: hostDemoScoreCount, ScoreTime: hostDemoScoreTime},
	})
}

// GET Demo
//
//	@Description	Get demo with specified demo uuid.
//	@Tags			demo
//	@Accept			json
//	@Produce		octet-stream
//	@Param			uuid	query	string	true	"Demo UUID"
//	@Success		200		{file}	binary	"Demo File"
//	@Router			/demos [get]
func DownloadDemoWithID(c *gin.Context) {
	uuid := c.Query("uuid")
	var locationID string
	if uuid == "" {
		c.JSON(http.StatusOK, models.ErrorResponse("Invalid id given."))
		return
	}
	err := database.DB.QueryRow(`SELECT location_id FROM demos WHERE id = $1`, uuid).Scan(&locationID)
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	if locationID == "" {
		c.JSON(http.StatusOK, models.ErrorResponse("Invalid id given."))
		return
	}
	url := "https://drive.google.com/uc?export=download&id=" + locationID
	fileName := uuid + ".dem"
	output, err := os.Create(fileName)
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	defer os.Remove(fileName)
	defer output.Close()
	response, err := http.Get(url)
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	defer response.Body.Close()
	_, err = io.Copy(output, response.Body)
	if err != nil {
		c.JSON(http.StatusOK, models.ErrorResponse(err.Error()))
		return
	}
	// Downloaded file
	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", "attachment; filename="+fileName)
	c.Header("Content-Type", "application/octet-stream")
	c.File(fileName)
	// c.FileAttachment()
}

// Use Service account
func serviceAccount() *http.Client {
	privateKey, _ := base64.StdEncoding.DecodeString(os.Getenv("GOOGLE_PRIVATE_KEY_BASE64"))
	config := &jwt.Config{
		Email:      os.Getenv("GOOGLE_CLIENT_EMAIL"),
		PrivateKey: []byte(privateKey),
		Scopes: []string{
			drive.DriveScope,
		},
		TokenURL: google.JWTTokenURL,
	}
	client := config.Client(context.Background())
	return client
}

// Create Gdrive file
func createFile(service *drive.Service, name string, mimeType string, content io.Reader, parentId string) (*drive.File, error) {
	f := &drive.File{
		MimeType: mimeType,
		Name:     name,
		Parents:  []string{parentId},
	}
	file, err := service.Files.Create(f).Media(content).Do()

	if err != nil {
		log.Println("Could not create file: " + err.Error())
		return nil, err
	}

	return file, nil
}

// Delete Gdrive file
func deleteFile(service *drive.Service, fileId string) {
	service.Files.Delete(fileId)
}
