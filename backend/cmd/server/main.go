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
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}

	port := os.Getenv("PORT")
	origin := "https://fintrack47.vercel.app"

	if env == "development" {
		port = defaultPort
		origin = "http://localhost:3000"
	}

	db := database.InitDB(config.LoadDBConfig())

	// Initialize repositories
	transactionRepo := transaction.NewRepository(db)
	categoryRepo := category.NewRepository(db)

	// Initialize services
	transactionService := transaction.NewService(transactionRepo)
	categoryService := category.NewService(categoryRepo)

	resolver := graphql.NewResolver(transactionService, categoryService)
	srv := handler.NewDefaultServer(graphql.NewExecutableSchema(graphql.Config{Resolvers: resolver}))

	// Enable CORS
	authMiddleware := middleware.AuthMiddleware(srv)
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{origin}, // Replace with your frontend's origin
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(authMiddleware)

	mux := http.NewServeMux()

	if port == defaultPort {
		mux.Handle("/", playground.Handler("GraphQL playground", "/query"))
		log.Println("GraphQL Playground enabled at http://localhost:" + port)
	} else {
		mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("Not Found"))
		})
	}

	mux.Handle("/query", corsHandler)

	log.Fatal(http.ListenAndServe(":"+port, mux))
}
