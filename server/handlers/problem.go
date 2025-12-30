package handlers

import (
	"cp-archive/models"
	"encoding/json"
	"log"
	"net/http"
)

func (h *Handler) GetProblems(w http.ResponseWriter, r *http.Request) {
	// 1. Write the SQL Query
	query := `
		SELECT slug, name, difficulty_stars, course, total_submissions, highest_points
		FROM problems
	`

	// 2. Execute Query
	rows, err := h.DB.Query(query)
	if err != nil {
		http.Error(w, "Database query error", http.StatusInternalServerError)
		log.Println("Query Error:", err)
		return
	}
	defer rows.Close()

	// 3. Scan results
	var problems []models.Problem
	for rows.Next() {
		var p models.Problem
		// Order must match the SQL SELECT above
		if err := rows.Scan(&p.Slug, &p.Name, &p.Difficulty, &p.Course, &p.TotalSubmissions, &p.HighestPoints); err != nil {
			log.Println("Scan Error:", err)
			continue
		}
		problems = append(problems, p)
	}

	// 4. Send JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(problems)
}