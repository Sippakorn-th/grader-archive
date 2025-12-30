package models

import (
	"encoding/json"
	"time"
)

type Submission struct {
	Slug          string           `json:"problem_slug"`
	ExternalID    *string          `json:"external_id"`
	UserHandle    *string          `json:"user_handle"`
	Language      *string          `json:"language"`
	ResultSummary *string          `json:"result_summary"`
	Points        *float64         `json:"points"`
	MemoryKB      *int             `json:"memory_kb"`
	RuntimeSec    *float64         `json:"runtime_sec"`
	SubmittedAt   *time.Time       `json:"submitted_at"`
	CodePath      *string          `json:"code_path"`
	AIAnalysis    *json.RawMessage `json:"ai_analysis"` // Handles JSONB column
	Tries         *int             `json:"tries"`
}