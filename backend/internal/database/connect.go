package database

import (
	_ "embed"
	"fmt"
	"log"

	"github.com/aashish47/finance-tracker/backend/internal/modules/category"
	"github.com/aashish47/finance-tracker/backend/internal/modules/transaction"
	"github.com/aashish47/finance-tracker/backend/internal/platform/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

//go:embed schema.sql
var schemaSQL string

//go:embed seed.sql
var seedSQL string

func InitDB(cfg config.DBConfig) *gorm.DB {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.Host, cfg.User, cfg.Password, cfg.Name, cfg.Port, cfg.SSLMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	log.Print("Database Connected successfully via GORM")

	err = db.AutoMigrate(&transaction.Transaction{}, &category.Category{})
	if err != nil {
		log.Fatalf("GORM AutoMigrate failed: %v", err)
	}
	log.Println("AutoMigrate successful")

	log.Println("Applying custom database schema...")
	if err := db.Exec(schemaSQL).Error; err != nil {
		log.Fatalf("Failed to apply custom database schema: %v", err)
	}

	if cfg.RunSeed {
		log.Println("Executing seed.sql script...")
		if err := db.Exec(seedSQL).Error; err != nil {
			log.Fatalf("Failed to execute seed.sql: %v", err)
		}
		log.Println("Database successfully seeded!")
	}

	return db
}
