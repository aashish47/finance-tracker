package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/aashish47/finance-tracker/backend/internal/database"
	"github.com/aashish47/finance-tracker/backend/internal/graphql"
	"github.com/aashish47/finance-tracker/backend/internal/modules/category"
	"github.com/aashish47/finance-tracker/backend/internal/modules/transaction"
	"github.com/aashish47/finance-tracker/backend/internal/platform/config"
	"github.com/aashish47/finance-tracker/backend/internal/platform/middleware"
	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/cors"
)

const defaultPort = "8080"

func main() {

	db := database.InitDB(config.LoadDBConfig())

	// Initialize repositories
	transactionRepo := transaction.NewRepository(db)
	categoryRepo := category.NewRepository(db)

	// Initialize services
	transactionService := transaction.NewService(transactionRepo)
	categoryService := category.NewService(categoryRepo)

	// Create resolver with services
	resolver := graphql.NewResolver(transactionService, categoryService)

	port := os.Getenv("PORT")
	origin := "https://fintrack-1scr.onrender.com"
	if port == "" {
		port = defaultPort
		origin = "http://localhost:3000"
	}

	srv := handler.NewDefaultServer(graphql.NewExecutableSchema(graphql.Config{Resolvers: resolver}))

	// Enable CORS
	authMiddleware := middleware.AuthMiddleware(srv)
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{origin}, // Replace with your frontend's origin
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(authMiddleware)

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	// http.Handle("/query", corsHandler)

	http.Handle("/query", corsHandler)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
