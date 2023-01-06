package models

import "time"

type User struct {
	SteamID     string    `json:"steam_id"`
	Username    string    `json:"username"`
	AvatarLink  string    `json:"avatar_link"`
	CountryCode string    `json:"country_code"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
