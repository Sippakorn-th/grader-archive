package models

type Submission struct {
	ID          string  `json:"id"`
	ProblemSlug string  `json:"problem_slug"`
	UserHandle  *string `json:"user_handle"` // Pointer allows nulls in JSON
	Language    *string `json:"language"`    // Pointer allows nulls in JSON
	Points      float64 `json:"points"`
}