package models

import "time"

type User struct {
	SteamID     string
	Username    string
	AvatarLink  string
	CountryCode string
	CreatedAt   time.Time
	UpdatedAt   time.Time
	UserType    int16
}

func (user *User) TypeToString() []string {
	var list []string
	switch user.UserType {
	case 0:
		list = append(list, "Normal")
	}
	if len(list) == 0 {
		list = append(list, "Unknown")
	}
	return list
}
