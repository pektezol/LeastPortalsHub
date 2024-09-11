package main

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
)

func fetchLeaderboard(records *[]Record, overrides *map[string]map[string]int) *map[string]*Player {
	log.Println("fetching leaderboard")
	players := map[string]*Player{}
	// first init players map with records from portal gun and doors
	fetchAnotherPage := true
	start := 0
	end := 5000

	for fetchAnotherPage {
		portalGunEntries := fetchRecordsFromMap(47459, 0, 5000)
		fetchAnotherPage = portalGunEntries.needsAnotherPage(&(*records)[0])
		if fetchAnotherPage {
			start = end + 1
			end = start + 5000
		}
		for _, entry := range portalGunEntries.Entries.Entry {
			if entry.Score < 0 {
				continue // ban
			}
			players[entry.SteamID] = &Player{
				SteamID: entry.SteamID,
				Entries: []PlayerEntry{
					{
						MapID:    47459,
						MapScore: entry.Score,
					},
				},
				SpScoreCount: entry.Score,
				SpIterations: 1,
			}
		}
	}

	fetchAnotherPage = true
	start = 0
	end = 5000

	for fetchAnotherPage {
		doorsEntries := fetchRecordsFromMap(47740, start, end)
		fetchAnotherPage = doorsEntries.needsAnotherPage(&(*records)[51])
		if fetchAnotherPage {
			start = end + 1
			end = start + 5000
		}
		for _, entry := range doorsEntries.Entries.Entry {
			if entry.Score < 0 {
				continue // ban
			}
			player, ok := players[entry.SteamID]
			if !ok {
				players[entry.SteamID] = &Player{
					SteamID: entry.SteamID,
					Entries: []PlayerEntry{
						{
							MapID:    47740,
							MapScore: entry.Score,
						},
					},
					MpScoreCount: entry.Score,
					MpIterations: 1,
				}
			} else {
				player.Entries = append(player.Entries, PlayerEntry{
					MapID:    47740,
					MapScore: entry.Score,
				})
				player.MpScoreCount = entry.Score
				player.MpIterations++
			}
		}
	}

	for _, record := range *records {
		if record.MapID == 47459 || record.MapID == 47740 {
			continue
		}

		fetchAnotherPage := true
		start := 0
		end := 5000

		for fetchAnotherPage {
			entries := fetchRecordsFromMap(record.MapID, start, end)
			fetchAnotherPage = entries.needsAnotherPage(&record)
			if fetchAnotherPage {
				start = end + 1
				end = start + 5000
			}
			for _, entry := range (*entries).Entries.Entry {
				player, ok := players[entry.SteamID]
				if !ok {
					continue
				}
				score := entry.Score
				if entry.Score < record.MapWR {
					_, ok := (*overrides)[entry.SteamID]
					if ok {
						_, ok := (*overrides)[entry.SteamID][strconv.Itoa(record.MapID)]
						if ok {
							score = (*overrides)[entry.SteamID][strconv.Itoa(record.MapID)]
						} else {
							continue // ban
						}
					} else {
						continue // ban
					}
				}
				if record.MapLimit != nil && score > *record.MapLimit {
					continue // ignore above limit
				}
				player.Entries = append(player.Entries, PlayerEntry{
					MapID:    record.MapID,
					MapScore: score,
				})
				if record.MapMode == 1 {
					player.SpScoreCount += score
					player.SpIterations++
				} else if record.MapMode == 2 {
					player.MpScoreCount += score
					player.MpIterations++
				}
			}
		}

	}
	return &players
}

func fetchRecordsFromMap(mapID int, start int, end int) *Leaderboard {
	resp, err := http.Get(fmt.Sprintf("https://steamcommunity.com/stats/Portal2/leaderboards/%d?xml=1&start=%d&end=%d", mapID, start, end))
	if err != nil {
		log.Fatalln(err.Error())
	}
	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err.Error())
	}
	leaderboard := Leaderboard{}
	err = xml.Unmarshal(respBytes, &leaderboard)
	if err != nil {
		log.Fatalln(err.Error())
	}
	return &leaderboard
}

func fetchPlayerInfo(player *Player) {
	url := fmt.Sprintf("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=%s&steamids=%s", os.Getenv("API_KEY"), player.SteamID)
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err.Error())
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err.Error())
	}
	type PlayerSummary struct {
		PersonaName string `json:"personaname"`
		AvatarFull  string `json:"avatarfull"`
	}

	type Result struct {
		Response struct {
			Players []PlayerSummary `json:"players"`
		} `json:"response"`
	}
	var data Result
	if err := json.Unmarshal(body, &data); err != nil {
		log.Fatalln(err.Error())
	}
	player.AvatarLink = data.Response.Players[0].AvatarFull
	player.Username = data.Response.Players[0].PersonaName
}
