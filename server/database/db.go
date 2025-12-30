package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func ConnectDB() *sql.DB {
	dsn := "postgresql://postgres:root@localhost:5432/cp5"

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatalf("Could not ping database: %v\n", err)
	}

	fmt.Println("Connected to PostgreSQL!")
	return db
}