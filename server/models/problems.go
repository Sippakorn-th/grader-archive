package models

type Problem struct {
	Slug             string  `json:"slug"`
	Name             string  `json:"name"`
	Difficulty       float64 `json:"difficulty"` // Maps to difficulty_stars
	Course           string  `json:"course"`
	TotalSubmissions int     `json:"total_submissions"` // Maps to total_submissions
	HighestPoints    float64 `json:"highest_points"`    // Maps to highest_points
}