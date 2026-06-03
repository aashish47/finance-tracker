package config

import (
	_ "embed"
	"fmt"
	"log"
	"os"

	"github.com/aashish47/finance-tracker/backend/database/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

//go:embed seed.sql
var SeedSQL string

//go:embed schema.sql
var SchemaSQL string

var db *gorm.DB

func InitDB() *gorm.DB {

	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")
	sslmode := os.Getenv("DB_SSLMODE")
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", host, user, password, name, port, sslmode)

	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	} else {
		log.Print("Database Connected")
	}

	err = db.AutoMigrate(&models.Transaction{}, &models.Category{})

	if err != nil {
		log.Fatalf("GORM AutoMigrate failed: %v", err)
	}

	log.Println("AutoMigrate successful")

	// 2. Execute your manual database-level changes
	log.Println("Applying custom indexes, triggers, and views...")
	err = db.Exec(SchemaSQL).Error
	if err != nil {
		log.Fatalf("Failed to apply custom database schema: %v", err)
	}

	log.Println("Database schema is fully up to date!")

	seed := os.Getenv(("SEED"))
	if seed == "true" {
		log.Println("Excuting seed.sql script...")

		if err := db.Exec(SeedSQL).Error; err != nil {
			log.Fatalf("Failed to execute seed.sql: %v", err)
		}

		log.Println("Database successfully seeded! Exiting seeder task.")
		// os.Exit(0)
	}

	return db
}
