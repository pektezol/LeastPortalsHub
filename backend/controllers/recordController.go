package controllers

import (
	"context"
	b64 "encoding/base64"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/pektezol/leastportals/backend/database"
	"github.com/pektezol/leastportals/backend/models"
	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2/jwt"
	"google.golang.org/api/drive/v3"
)

// POST Record
//
//	@Summary	Post record with demo of a specific map.
//	@Tags		maps
//	@Accept		mpfd
//	@Produce	json
//	@Param		Authorization		header		string	true	"JWT Token"
//	@Param		demos				formData	[]file	true	"Demos"
//	@Param		score_count			formData	int		true	"Score Count"
//	@Param		score_time			formData	int		true	"Score Time"
//	@Param		is_partner_orange	formData	boolean	true	"Is Partner Orange"
//	@Param		partner_id			formData	string	true	"Partner ID"
//	@Success	200					{object}	models.Response{data=models.RecordRequest}
//	@Failure	400					{object}	models.Response
//	@Failure	401					{object}	models.Response
//	@Router		/maps/{id}/record [post]
func CreateRecordWithDemo(c *gin.Context) {
	mapId := c.Param("id")
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse("User not logged in."))
		return
	}
	// Check if map is sp or mp
	var wrScore int
	var wrTime int
	var isCoop bool
	var isDisabled bool
	err := database.DB.QueryRow(`SELECT wr_score, wr_time, is_coop, is_disabled FROM maps WHERE id = $1;`, mapId).Scan(&wrScore, &wrTime, &isCoop, &isDisabled)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	if isDisabled {
		c.JSON(http.StatusBadRequest, models.ErrorResponse("Map is not available for competitive boards."))
		return
	}
	// Get record request
	var record models.RecordRequest
	score_count, err := strconv.Atoi(c.PostForm("score_count"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	score_time, err := strconv.Atoi(c.PostForm("score_time"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	is_partner_orange, err := strconv.ParseBool(c.PostForm("is_partner_orange"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	record.ScoreCount = score_count
	record.ScoreTime = score_time
	record.PartnerID = c.PostForm("partner_id")
	record.IsPartnerOrange = is_partner_orange
	if record.PartnerID == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse("No partner id given."))
		return
	}
	// Multipart form
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	files := form.File["demos"]
	if len(files) != 2 && isCoop {
		c.JSON(http.StatusBadRequest, models.ErrorResponse("Not enough demos for coop submission."))
		return
	}
	if len(files) != 1 && !isCoop {
		c.JSON(http.StatusBadRequest, models.ErrorResponse("Too many demos for singleplayer submission."))
		return
	}
	var hostDemoUUID string
	var partnerDemoUUID string
	client := serviceAccount()
	srv, err := drive.New(client)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	fileID := ""
	for i, header := range files {
		uuid := uuid.New().String()
		// Upload & insert into demos
		err = c.SaveUploadedFile(header, "docs/"+header.Filename)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		f, err := os.Open("docs/" + header.Filename)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		defer f.Close()
		file, err := createFile(srv, uuid+".dem", "application/octet-stream", f, os.Getenv("GOOGLE_FOLDER_ID"))
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		fileID = file.Id
		if i == 0 {
			hostDemoUUID = uuid
		}
		if i == 1 {
			partnerDemoUUID = uuid
		}
		_, err = database.DB.Exec(`INSERT INTO demos (id,location_id) VALUES ($1,$2)`, uuid, file.Id)
		if err != nil {
			deleteFile(srv, file.Id)
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		os.Remove("docs/" + header.Filename)
	}
	// Insert into records
	if isCoop {
		sql := `INSERT INTO records_mp(map_id,score_count,score_time,host_id,partner_id,host_demo_id,partner_demo_id) 
		VALUES($1, $2, $3, $4, $5, $6, $7);`
		var hostID string
		var partnerID string
		if record.IsPartnerOrange {
			hostID = user.(models.User).SteamID
			partnerID = record.PartnerID
		} else {
			partnerID = user.(models.User).SteamID
			hostID = record.PartnerID
		}
		_, err := database.DB.Exec(sql, mapId, record.ScoreCount, record.ScoreTime, hostID, partnerID, hostDemoUUID, partnerDemoUUID)
		if err != nil {
			deleteFile(srv, fileID)
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		// If a new world record based on portal count
		if record.ScoreCount < wrScore {
			_, err := database.DB.Exec(`UPDATE maps SET wr_score = $1, wr_time = $2 WHERE id = $3;`, record.ScoreCount, record.ScoreTime, mapId)
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
		}
	} else {
		sql := `INSERT INTO records_sp(map_id,score_count,score_time,user_id,demo_id) 
		VALUES($1, $2, $3, $4, $5);`
		_, err := database.DB.Exec(sql, mapId, record.ScoreCount, record.ScoreTime, user.(models.User).SteamID, hostDemoUUID)
		if err != nil {
			deleteFile(srv, fileID)
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		// If a new world record based on portal count
		if record.ScoreCount < wrScore {
			_, err := database.DB.Exec(`UPDATE maps SET wr_score = $1, wr_time = $2 WHERE id = $3;`, record.ScoreCount, record.ScoreTime, mapId)
			if err != nil {
				c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
				return
			}
		}
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully created record.",
		Data:    record,
	})
	return
}

// GET Demo
//
//	@Summary	Get demo with specified demo uuid.
//	@Tags		demo
//	@Accept		json
//	@Produce	octet-stream
//	@Param		uuid	path		int		true	"Demo UUID"
//	@Success	200		{file}		binary	"Demo File"
//	@Failure	400		{object}	models.Response
//	@Router		/demo [get]
func DownloadDemoWithID(c *gin.Context) {
	uuid := c.Query("uuid")
	var locationID string
	if uuid == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse("Invalid id given."))
		return
	}
	err := database.DB.QueryRow(`SELECT location_id FROM demos WHERE id = $1;`, uuid).Scan(&locationID)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	if locationID == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse("Invalid id given."))
		return
	}
	url := "https://drive.google.com/uc?export=download&id=" + locationID
	fileName := uuid + ".dem"
	output, err := os.Create(fileName)
	defer os.Remove(fileName)
	defer output.Close()
	response, err := http.Get(url)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	defer response.Body.Close()
	_, err = io.Copy(output, response.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
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
	privateKey, _ := b64.StdEncoding.DecodeString(os.Getenv("GOOGLE_PRIVATE_KEY_BASE64"))
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

func deleteFile(service *drive.Service, fileId string) {
	service.Files.Delete(fileId)
}
