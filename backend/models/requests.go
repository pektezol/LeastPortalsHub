package models

type RecordRequest struct {
	ScoreCount      int    `json:"score_count" form:"score_count" binding:"required"`
	ScoreTime       int    `json:"score_time" form:"score_time" binding:"required"`
	PartnerID       string `json:"partner_id" form:"partner_id" binding:"required"`
	IsPartnerOrange bool   `json:"is_partner_orange" form:"is_partner_orange" binding:"required"`
}
