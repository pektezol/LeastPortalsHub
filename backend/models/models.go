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

type Map struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	ScoreWR int    `json:"wr_score"`
	TimeWR  int    `json:"wr_time"`
	IsCoop  bool   `json:"is_coop"`
	Records any    `json:"records"`
}

type RecordSP struct {
	RecordID   int       `json:"record_id"`
	UserID     string    `json:"user_id"`
	ScoreCount int       `json:"score_count"`
	ScoreTime  int       `json:"score_time"`
	DemoID     string    `json:"demo_id"`
	RecordDate time.Time `json:"record_date"`
}

type RecordMP struct {
	RecordID      int       `json:"record_id"`
	HostID        string    `json:"host_id"`
	PartnerID     string    `json:"partner_id"`
	ScoreCount    int       `json:"score_count"`
	ScoreTime     int       `json:"score_time"`
	HostDemoID    string    `json:"host_demo_id"`
	PartnerDemoID string    `json:"partner_demo_id"`
	RecordDate    time.Time `json:"record_date"`
}

type RecordRequest struct {
	ScoreCount      int    `json:"score_count" form:"score_count" binding:"required"`
	ScoreTime       int    `json:"score_time" form:"score_time" binding:"required"`
	PartnerID       string `json:"partner_id" form:"partner_id" binding:"required"`
	IsPartnerOrange bool   `json:"is_partner_orange" form:"is_partner_orange" binding:"required"`
}
