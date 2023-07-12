package models

type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    any    `json:"data"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type RankingsResponse struct {
	RankingsSP []UserRanking `json:"rankings_sp"`
	RankingsMP []UserRanking `json:"rankings_mp"`
}

type ProfileResponse struct {
	Profile     bool            `json:"profile"`
	SteamID     string          `json:"steam_id"`
	UserName    string          `json:"user_name"`
	AvatarLink  string          `json:"avatar_link"`
	CountryCode string          `json:"country_code"`
	ScoresSP    []ScoreResponse `json:"scores_sp"`
	ScoresMP    []ScoreResponse `json:"scores_mp"`
}

type ScoreResponse struct {
	MapID   int `json:"map_id"`
	Records any `json:"records"`
}

type MapSummaryResponse struct {
	Map     Map        `json:"map"`
	Summary MapSummary `json:"summary"`
}

type SearchResponse struct {
	Players []UserShort `json:"players"`
	Maps    []MapShort  `json:"maps"`
}

type ChaptersResponse struct {
	Game     Game      `json:"game"`
	Chapters []Chapter `json:"chapters"`
}

type ChapterMapsResponse struct {
	Chapter Chapter    `json:"chapter"`
	Maps    []MapShort `json:"maps"`
}

type RecordResponse struct {
	ScoreCount int `json:"score_count"`
	ScoreTime  int `json:"score_time"`
}

func ErrorResponse(message string) Response {
	return Response{
		Success: false,
		Message: message,
		Data:    nil,
	}
}
