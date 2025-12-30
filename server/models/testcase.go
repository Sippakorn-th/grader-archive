package models

type TestCase struct {
	SubmissionID string   `json:"submission_id,omitempty"`
	TestcaseNum  int      `json:"testcase_num"`
	RuntimeSec   *float64 `json:"runtime_sec"`
	MemoryMB     *float64 `json:"memory_mb"`
	ResultText   *string  `json:"result_text"`
	Score        *float64 `json:"score"`
}