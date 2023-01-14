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

func CreateRecordWithDemo(c *gin.Context) {
	mapId := c.Param("id")
	// Check if user exists
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse("User not logged in."))
		return
	}
	// Check if map is sp or mp
	var isCoop bool
	err := database.DB.QueryRow(`SELECT is_coop FROM maps WHERE id = $1;`, mapId).Scan(&isCoop)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
		return
	}
	// Get record request
	var record models.Record
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
		client := serviceAccount()
		srv, err := drive.New(client)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		file, err := createFile(srv, uuid+".dem", "application/octet-stream", f, os.Getenv("GOOGLE_FOLDER_ID"))
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
		if i == 0 {
			hostDemoUUID = uuid
		}
		if i == 1 {
			partnerDemoUUID = uuid
		}
		_, err = database.DB.Exec(`INSERT INTO demos (id,location_id) VALUES ($1,$2)`, uuid, file.Id)
		if err != nil {
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
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
	} else {
		sql := `INSERT INTO records_sp(map_id,score_count,score_time,user_id,demo_id) 
		VALUES($1, $2, $3, $4, $5);`
		_, err := database.DB.Exec(sql, mapId, record.ScoreCount, record.ScoreTime, user.(models.User).SteamID, hostDemoUUID)
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse(err.Error()))
			return
		}
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully created record.",
		Data:    record,
	})
	return
}

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
