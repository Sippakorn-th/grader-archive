package main

import (
	"database/sql"
	"fmt"
	"log"

	// Import the pgx driver for database/sql
	_ "github.com/jackc/pgx/v5/stdlib"
)

// Submission represents a row from your 'submissions' table
type Submission struct {
	ID          string // UUIDs are typically handled as strings in simple Go apps
	ProblemSlug string
	UserHandle  sql.NullString // Handle potential NULLs safely
	Language    sql.NullString
	Points      float64
}

func main() {
	// 1. Define the connection string (DSN)
	dsn := "postgresql://postgres:root@localhost:5432/cp5"

	// 2. Open the database connection
	// We use "pgx" as the driver name because we imported pgx/v5/stdlib
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer db.Close() // Close the connection when main() finishes

	// 3. Test the connection (Ping)
	err = db.Ping()
	if err != nil {
		log.Fatalf("Could not ping database: %v\n", err)
	}
	
	fmt.Println("Successfully connected to the database!")

	// 4. Write the SQL Query
	// We select a few columns to keep it simple
	query := `
		SELECT id, problem_slug, user_handle, language, points
		FROM submissions
		WHERE points > 20
		LIMIT 20;
	`

	// 5. Execute the query
	rows, err := db.Query(query)
	if err != nil {
		log.Fatalf("Query failed: %v\n", err)
	}
	defer rows.Close()

	// 6. Iterate through the results
	fmt.Println("\n--- Last 5 Submissions ---")
	for rows.Next() {
		var s Submission

		// Scan copies the columns from the current row into our struct fields
		// Order must match the SELECT statement above
		err := rows.Scan(&s.ID, &s.ProblemSlug, &s.UserHandle, &s.Language, &s.Points)
		if err != nil {
			log.Fatalf("Failed to scan row: %v\n", err)
		}

		// Print the result
		// We use .String on NullString types to get the text value (empty if null)
		fmt.Printf("Problem: %-20s | Lang: %-10s | Points: %.2f\n", 
			s.ProblemSlug, s.Language.String, s.Points)
	}

	// Check for errors encountered during iteration
	if err = rows.Err(); err != nil {
		log.Fatal(err)
	}
}