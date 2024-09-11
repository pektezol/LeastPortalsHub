package main

type Record struct {
	MapID    int    `json:"id"`
	MapName  string `json:"name"`
	MapMode  int    `json:"mode"`
	MapWR    int    `json:"wr"`
	MapLimit *int   `json:"limit"`
}

type Leaderboard struct {
	Entries LeaderboardEntries `xml:"entries"`
}

func (l *Leaderboard) needsAnotherPage(record *Record) bool {
	if l.Entries.Entry[len(l.Entries.Entry)-1].Score == record.MapWR {
		return true
	} else if record.MapLimit != nil && l.Entries.Entry[len(l.Entries.Entry)-1].Score <= *record.MapLimit {
		return true
	}
	return false
}

type LeaderboardEntries struct {
	Entry []LeaderboardEntry `xml:"entry"`
}

type LeaderboardEntry struct {
	SteamID string `xml:"steamid"`
	Score   int    `xml:"score"`
}

type Player struct {
	Username          string        `json:"user_name"`
	AvatarLink        string        `json:"avatar_link"`
	SteamID           string        `json:"steam_id"`
	Entries           []PlayerEntry `json:"-"`
	SpScoreCount      int           `json:"sp_score"`
	MpScoreCount      int           `json:"mp_score"`
	OverallScoreCount int           `json:"overall_score"`
	SpRank            int           `json:"sp_rank"`
	MpRank            int           `json:"mp_rank"`
	OverallRank       int           `json:"overall_rank"`
	SpIterations      int           `json:"-"`
	MpIterations      int           `json:"-"`
}

type PlayerEntry struct {
	MapID    int
	MapScore int
}
