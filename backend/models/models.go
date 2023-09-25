package models

import (
	"time"
)

type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    any    `json:"data"`
}

func ErrorResponse(message string) Response {
	return Response{
		Success: false,
		Message: message,
		Data:    nil,
	}
}

type User struct {
	SteamID     string    `json:"steam_id"`
	UserName    string    `json:"user_name"`
	AvatarLink  string    `json:"avatar_link"`
	CountryCode string    `json:"country_code"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Titles      []Title   `json:"titles"`
}

type UserShort struct {
	SteamID  string `json:"steam_id"`
	UserName string `json:"user_name"`
}

type UserShortWithAvatar struct {
	SteamID    string `json:"steam_id"`
	UserName   string `json:"user_name"`
	AvatarLink string `json:"avatar_link"`
}

type Map struct {
	ID          int    `json:"id"`
	GameName    string `json:"game_name"`
	ChapterName string `json:"chapter_name"`
	MapName     string `json:"map_name"`
	Image       string `json:"image"`
	IsCoop      bool   `json:"is_coop"`
}

type MapShort struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type MapSummary struct {
	Routes []MapRoute `json:"routes"`
}

type MapHistory struct {
	RunnerName string    `json:"runner_name"`
	ScoreCount int       `json:"score_count"`
	Date       time.Time `json:"date"`
}

type MapRoute struct {
	RouteID         int        `json:"route_id"`
	Category        Category   `json:"category"`
	History         MapHistory `json:"history"`
	Rating          float32    `json:"rating"`
	CompletionCount int        `json:"completion_count"`
	Description     string     `json:"description"`
	Showcase        string     `json:"showcase"`
}

type MapRecords struct {
	Records any `json:"records"`
}

type UserRanking struct {
	Placement  int                 `json:"placement"`
	User       UserShortWithAvatar `json:"user"`
	TotalScore int                 `json:"total_score"`
}

type Game struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	IsCoop bool   `json:"is_coop"`
}

type Chapter struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Title struct {
	Name  string `json:"name"`
	Color string `json:"color"`
}

type Links struct {
	P2SR    string `json:"p2sr"`
	Steam   string `json:"steam"`
	YouTube string `json:"youtube"`
	Twitch  string `json:"twitch"`
}

type Pagination struct {
	TotalRecords int `json:"total_records"`
	TotalPages   int `json:"total_pages"`
	CurrentPage  int `json:"current_page"`
	PageSize     int `json:"page_size"`
}

type PlayerSummaries struct {
	SteamId                  string `json:"steamid"`
	CommunityVisibilityState int    `json:"communityvisibilitystate"`
	ProfileState             int    `json:"profilestate"`
	PersonaName              string `json:"personaname"`
	LastLogOff               int    `json:"lastlogoff"`
	ProfileUrl               string `json:"profileurl"`
	Avatar                   string `json:"avatar"`
	AvatarMedium             string `json:"avatarmedium"`
	AvatarFull               string `json:"avatarfull"`
	PersonaState             int    `json:"personastate"`

	CommentPermission int    `json:"commentpermission"`
	RealName          string `json:"realname"`
	PrimaryClanId     string `json:"primaryclanid"`
	TimeCreated       int    `json:"timecreated"`
	LocCountryCode    string `json:"loccountrycode"`
	LocStateCode      string `json:"locstatecode"`
	LocCityId         int    `json:"loccityid"`
	GameId            int    `json:"gameid"`
	GameExtraInfo     string `json:"gameextrainfo"`
	GameServerIp      string `json:"gameserverip"`
}
