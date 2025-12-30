package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
)


type Submission struct {
	ID          string
	ProblemSlug string
	UserHandle  sql.NullString
	Language    sql.NullString
	Points      float64
}

func main() {

	dsn := "postgresql://postgres:root@localhost:5432/cp5"

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer db.Close() 

	err = db.Ping()
	if err != nil {
		log.Fatalf("Could not ping database: %v\n", err)
	}

	fmt.Println("Successfully connected to the database!")

	query := `
		SELECT id, problem_slug, user_handle, language, points
		FROM submissions
		WHERE points > 20
		LIMIT 20;
	`

	rows, err := db.Query(query)
	if err != nil {
		log.Fatalf("Query failed: %v\n", err)
	}
	defer rows.Close()

	fmt.Println("\n--- Last 5 Submissions ---")
	for rows.Next() {
		var s Submission

		err := rows.Scan(&s.ID, &s.ProblemSlug, &s.UserHandle, &s.Language, &s.Points)
		if err != nil {
			log.Fatalf("Failed to scan row: %v\n", err)
		}

		fmt.Printf("Problem: %-20s | Lang: %-10s | Points: %.2f\n", 
			s.ProblemSlug, s.Language.String, s.Points)
	}

	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}
}