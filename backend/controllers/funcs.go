package controllers

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func GetEnvKey(key string) string {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	return os.Getenv(key)
}
