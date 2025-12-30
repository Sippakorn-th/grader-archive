package handlers

import (
	"cp-archive/models"
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
)

// func (h *Handler) GetSubmissions(w http.ResponseWriter, r *http.Request) {
// 	// 1. Query the database (using h.DB from the struct)
// 	query := `
// 		SELECT id, problem_slug, user_handle, language, points
// 		FROM submissions
// 	`
// 	rows, err := h.DB.Query(query)
// 	if err != nil {
// 		http.Error(w, "Database query error", http.StatusInternalServerError)
// 		log.Println("Query Error:", err)
// 		return
// 	}
// 	defer rows.Close()

// 	// 2. Scan results into a slice (list) of Submissions
// 	var submissions []models.Submission

// 	for rows.Next() {
// 		var s models.Submission
// 		// Scan directly into the struct fields
// 		err := rows.Scan(&s.ID, &s.ProblemSlug, &s.UserHandle, &s.Language, &s.Points)
// 		if err != nil {
// 			log.Println("Scan Error:", err)
// 			continue
// 		}

// 		submissions = append(submissions, s)
// 	}

// 	// 3. Send JSON response
// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(submissions)
// }

// Add this function to your existing handlers/submissions.go file

func (h *Handler) GetProblemSubmissions(w http.ResponseWriter, r *http.Request) {
	// 1. Get the slug from the URL URL
	slug := chi.URLParam(r, "slug")

	// 2. Write the SQL Query with a placeholder ($1)
	query := `
		SELECT 
			id, problem_slug, external_id, user_handle, language, 
			result_summary, points, memory_kb, runtime_sec, 
			submitted_at, code_path, ai_analysis, tries
		FROM submissions
		WHERE problem_slug = $1
		ORDER BY submitted_at DESC
	`

	// 3. Execute Query (pass 'slug' to fill the $1 placeholder)
	rows, err := h.DB.Query(query, slug)
	if err != nil {
		http.Error(w, "Database query error", http.StatusInternalServerError)
		log.Println("Query Error:", err)
		return
	}
	defer rows.Close()

	// 4. Scan results
	var submissions []models.Submission
	for rows.Next() {
		var s models.Submission
		// The order here MUST match the SELECT order above
		err := rows.Scan(
			&s.ID, &s.Slug, &s.ExternalID, &s.UserHandle, &s.Language,
			&s.ResultSummary, &s.Points, &s.MemoryKB, &s.RuntimeSec,
			&s.SubmittedAt, &s.CodePath, &s.AIAnalysis, &s.Tries,
		)
		if err != nil {
			log.Println("Scan Error:", err)
			continue
		}
		submissions = append(submissions, s)
	}

	// 5. Send JSON
	w.Header().Set("Content-Type", "application/json")
	// If no submissions found, return empty list [] instead of null
	if submissions == nil {
		submissions = []models.Submission{}
	}
	json.NewEncoder(w).Encode(submissions)
}