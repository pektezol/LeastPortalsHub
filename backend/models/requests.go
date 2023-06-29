package models

import (
	"mime/multipart"
	"time"
)

type CreateMapSummaryRequest struct {
	CategoryID  int       `json:"category_id" binding:"required"`
	Description string    `json:"description" binding:"required"`
	Showcase    string    `json:"showcase" binding:"required"`
	UserName    string    `json:"user_name" binding:"required"`
	ScoreCount  int       `json:"score_count" binding:"required"`
	RecordDate  time.Time `json:"record_date" binding:"required"`
}

type EditMapSummaryRequest struct {
	RouteID     int       `json:"route_id" binding:"required"`
	Description string    `json:"description" binding:"required"`
	Showcase    string    `json:"showcase" binding:"required"`
	UserName    string    `json:"user_name" binding:"required"`
	ScoreCount  int       `json:"score_count" binding:"required"`
	RecordDate  time.Time `json:"record_date" binding:"required"`
}

type RecordRequest struct {
	HostDemo        *multipart.FileHeader `json:"host_demo" form:"host_demo" binding:"required" swaggerignore:"true"`
	PartnerDemo     *multipart.FileHeader `json:"partner_demo" form:"partner_demo" swaggerignore:"true"`
	IsPartnerOrange bool                  `json:"is_partner_orange" form:"is_partner_orange"`
	PartnerID       string                `json:"partner_id" form:"partner_id"`
}
