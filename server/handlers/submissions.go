package handlers

import (
	"cp-archive/models"
	"encoding/json"
	"log"
	"net/http"
)

func (h *Handler) GetSubmissions(w http.ResponseWriter, r *http.Request) {
	// 1. Query the database (using h.DB from the struct)
	query := `
		SELECT id, problem_slug, user_handle, language, points 
		FROM submissions 
	`
	rows, err := h.DB.Query(query)
	if err != nil {
		http.Error(w, "Database query error", http.StatusInternalServerError)
		log.Println("Query Error:", err)
		return
	}
	defer rows.Close()

	// 2. Scan results into a slice (list) of Submissions
	var submissions []models.Submission

	for rows.Next() {
		var s models.Submission
		// Scan directly into the struct fields
		err := rows.Scan(&s.ID, &s.ProblemSlug, &s.UserHandle, &s.Language, &s.Points)
		if err != nil {
			log.Println("Scan Error:", err)
			continue
		}

		submissions = append(submissions, s)
	}

	// 3. Send JSON response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(submissions)
}