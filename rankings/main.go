package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalln("Error loading .env file:", err.Error())
	}
	c := cron.New()
	_, err = c.AddFunc("0 0 * * *", run)
	if err != nil {
		log.Fatalln("Error scheduling daily reminder:", err.Error())
	}
	c.Start()
	log.Println("ready for jobs")
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)
	<-sc
}

func run() {
	log.Println("started job")
	records := readRecords()
	overrides := readOverrides()
	players := fetchLeaderboard(records, overrides)

	spRankings := []*Player{}
	mpRankings := []*Player{}
	overallRankings := []*Player{}

	log.Println("filtering rankings")
	filterRankings(&spRankings, &mpRankings, &overallRankings, players)

	log.Println("exporting jsons")
	exportAll(&spRankings, &mpRankings, &overallRankings)
}
