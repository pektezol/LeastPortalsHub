package database

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
	"github.com/pektezol/leastportals/backend/controllers"
)

var DB *sql.DB

func ConnectDB() {
	host := controllers.GetEnvKey("DB_HOST")
	port := controllers.GetEnvKey("DB_PORT")
	user := controllers.GetEnvKey("DB_USER")
	pass := controllers.GetEnvKey("DB_PASS")
	name := controllers.GetEnvKey("DB_NAME")
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, pass, name)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	if err = db.Ping(); err != nil {
		panic(err)
	}
	DB = db
	fmt.Println("Successfully connected to database!")
}
