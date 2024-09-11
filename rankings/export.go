package main

import (
	"encoding/json"
	"os"
)

func exportAll(spRankings, mpRankings, overallRankings *[]*Player) {
	sp, _ := os.Create("./output/sp.json")
	spRankingsOut, _ := json.Marshal(*spRankings)
	sp.Write(spRankingsOut)
	sp.Close()
	mp, _ := os.Create("./output/mp.json")
	mpRankingsOut, _ := json.Marshal(*mpRankings)
	mp.Write(mpRankingsOut)
	mp.Close()
	overall, _ := os.Create("./output/overall.json")
	overallRankingsOut, _ := json.Marshal(*overallRankings)
	overall.Write(overallRankingsOut)
	overall.Close()
}
