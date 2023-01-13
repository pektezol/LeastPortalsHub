package models

import (
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
	ScoreCount      int    `json:"score_count" form:"score_count" binding:"required"`
	ScoreTime       int    `json:"score_time" form:"score_time" binding:"required"`
	PartnerID       string `json:"partner_id" form:"partner_id" binding:"required"`
	IsPartnerOrange bool   `json:"is_partner_orange" form:"is_partner_orange" binding:"required"`
	//Demos           []*multipart.FileHeader `form:"demos[]" binding:"required"`
}
