package models

type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    any    `json:"data"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type ProfileResponse struct {
	Profile     bool   `json:"profile"`
	SteamID     string `json:"steam_id"`
	Username    string `json:"username"`
	AvatarLink  string `json:"avatar_link"`
	CountryCode string `json:"country_code"`
}

func ErrorResponse(message string) Response {
	return Response{
		Success: false,
		Message: message,
		Data:    nil,
	}
}
