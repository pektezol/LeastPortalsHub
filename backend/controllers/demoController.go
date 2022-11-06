package controllers

import (
	"context"
	b64 "encoding/base64"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2/jwt"
	"google.golang.org/api/drive/v3"
)

func UploadDemo(c *gin.Context) {
	// Check if user exists
	/*user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code": http.StatusUnauthorized,
			"output": gin.H{
				"error": "User not logged in. Could be invalid token.",
			},
		})
		return
	} else {
		user := user.(models.User)
		c.JSON(http.StatusOK, gin.H{
			"code": http.StatusOK,
			"output": gin.H{
				"avatar":   user.AvatarLink,
				"country":  user.CountryCode,
				"types":    user.TypeToString(),
				"username": user.Username,
			},
			"profile": true,
		})
		return
	}*/
	f, err := os.Open("test.txt")
	if err != nil {
		panic(fmt.Sprintf("cannot open file: %v", err))
	}
	defer f.Close()
	client := serviceAccount()
	srv, err := drive.New(client)
	if err != nil {
		log.Fatalf("Unable to retrieve drive Client %v", err)
	}
	file, err := createFile(srv, f.Name(), "application/octet-stream", f, os.Getenv("GOOGLE_FOLDER_ID"))
	if err != nil {
		panic(fmt.Sprintf("Could not create file: %v\n", err))
	}

	fmt.Printf("File '%s' successfully uploaded", file.Name)
	fmt.Printf("\nFile Id: '%s' ", file.Id)
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
