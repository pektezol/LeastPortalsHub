package controllers

import (
	"context"
	b64 "encoding/base64"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
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
		c.JSON(http.StatusUnauthorized, gin.H{
			"code": http.StatusUnauthorized,
			"output": gin.H{
				"error": "User not logged in. Could be invalid token.",
			},
		})
		return
	}
	var record models.Record
	err := c.Bind(&record)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse(err.Error()))
		return
	}
	var recordCount int
	err = database.DB.QueryRow(`SELECT COUNT(id) FROM records;`).Scan(&recordCount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse(err.Error()))
		return
	}
	// var mapName string
	// err = database.DB.QueryRow(`SELECT map_name FROM maps WHERE id = $1;`, mapId).Scan(&mapName)
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, models.ErrorResponse(err.Error()))
	// 	return
	// }
	outputDemoName := fmt.Sprintf("%s_%s_%d", time.Now().UTC().Format("2006-01-02"), user.(models.User).SteamID, recordCount)
	header, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse(err.Error()))
		return
	}
	err = c.SaveUploadedFile(header, "docs/"+header.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse(err.Error()))
		return
	}
	f, err := os.Open("docs/" + header.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse(err.Error()))
		return
	}
	defer f.Close()
	client := serviceAccount()
	srv, err := drive.New(client)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse(err.Error()))
		return
	}
	file, err := createFile(srv, outputDemoName, "application/octet-stream", f, os.Getenv("GOOGLE_FOLDER_ID"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse(err.Error()))
		return
	}
	os.Remove("docs/" + header.Filename)
	// Demo upload success
	// Insert record into database
	sql := `INSERT INTO records(map_id,host_id,score_count,score_time,is_coop,partner_id,demo_id) 
	VALUES ($1, $2, $3, $4, $5, $6, $7);`
	_, err = database.DB.Exec(sql, mapId, user.(models.User).SteamID, record.ScoreCount, record.ScoreTime, record.IsCoop, record.PartnerID, file.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully created record.",
	})
	return
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
