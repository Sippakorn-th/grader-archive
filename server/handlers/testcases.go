package handlers

import (
	"cp-archive/models"
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (h *Handler) GetSubmissionTestcases(w http.ResponseWriter, r *http.Request) {
	// 1. Get the submission UUID from the URL
	submissionID := chi.URLParam(r, "id")

	// 2. Prepare the query
	// We order by testcase_num so they appear in order (1, 2, 3...)
	query := `
		SELECT testcase_num, runtime_sec, memory_mb, result_text, score 
		FROM submission_testcases 
		WHERE submission_id = $1
		ORDER BY testcase_num ASC
	`

	// 3. Execute Query
	rows, err := h.DB.Query(query, submissionID)
	if err != nil {
		log.Println("Query Error:", err)
		http.Error(w, "Database query error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// 4. Scan results
	var testcases []models.TestCase
	for rows.Next() {
		var t models.TestCase
		// We manually set the SubmissionID field since we already know it
		t.SubmissionID = submissionID
		
		err := rows.Scan(&t.TestcaseNum, &t.RuntimeSec, &t.MemoryMB, &t.ResultText, &t.Score)
		if err != nil {
			log.Println("Scan Error:", err)
			continue
		}
		testcases = append(testcases, t)
	}

	// 5. Send JSON (return empty list [] if null)
	w.Header().Set("Content-Type", "application/json")
	if testcases == nil {
		testcases = []models.TestCase{}
	}
	json.NewEncoder(w).Encode(testcases)
}