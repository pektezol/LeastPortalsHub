package models

import "time"

type User struct {
	SteamID     int64
	Username    string
	AvatarLink  string
	CountryCode string
	CreatedAt   time.Time
	UpdatedAt   time.Time
	UserType    int16
}
