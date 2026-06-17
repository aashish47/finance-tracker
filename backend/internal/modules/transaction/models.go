package transaction

import (
	"time"

	"github.com/aashish47/finance-tracker/backend/internal/modules/category"
)

type Transaction struct {
	ID         uint
	Item       string
	Amount     float64
	Date       time.Time
	IsIncome   bool
	CategoryID uint
	Category   category.Category
	UserId     string
}
