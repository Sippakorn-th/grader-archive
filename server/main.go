package main

import (
	"cp-archive/database"
	"cp-archive/handlers"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	// 1. Init Database
	db := database.ConnectDB()
	defer db.Close()

	// 2. Init Handler (Inject the DB)
	h := handlers.NewHandler(db)

	// 3. Init Router (Chi)
	r := chi.NewRouter()

	// 4. Setup CORS (Allow Next.js on port 3000)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type"},
	}))

	// 5. Define Routes
	// r.Get("/submissions", h.GetSubmissions)
	r.Get("/problems", h.GetProblems)
	r.Get("/problems/{slug}/submissions", h.GetProblemSubmissions)

	// 6. Start Server
	log.Println("Server starting on :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}