package models

import (
	"mime/multipart"
	"time"
)

type User struct {
	SteamID     string    `json:"steam_id"`
	Username    string    `json:"username"`
	AvatarLink  string    `json:"avatar_link"`
	CountryCode string    `json:"country_code"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Record struct {
	MapID      int    `json:"map_id" binding:"required"`
	ScoreCount int    `json:"score_count" binding:"required"`
	ScoreTime  int    `json:"score_time" binding:"required"`
	IsCoop     bool   `json:"is_coop" binding:"required"`
	PartnerID  string `json:"partner_id"`
}

type ds struct {
	File *multipart.FileHeader `form:"file" binding:"required"`
}
