package handlers

import (
	"cp-archive/models"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
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

func (h *Handler) GetProblemBySlug(w http.ResponseWriter, r *http.Request) {
	// 1. Get the slug from the URL
	slug := chi.URLParam(r, "slug")

	// 2. Prepare the query
	query := `
		SELECT slug, name, difficulty_stars, course, total_submissions, highest_points
		FROM problems
		WHERE slug = $1
	`

	// 3. Execute and Scan (QueryRow is for single results)
	var p models.Problem
	err := h.DB.QueryRow(query, slug).Scan(
		&p.Slug, &p.Name, &p.Difficulty, &p.Course, &p.TotalSubmissions, &p.HighestPoints,
	)

	// 4. Handle Errors
	if err != nil {
		if err == sql.ErrNoRows { // NOTE: Standard sql.ErrNoRows, see import below
			http.Error(w, "Problem not found", http.StatusNotFound)
		} else {
			log.Println("Query Error:", err)
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	// 5. Send JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}