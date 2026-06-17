package model

type Transaction struct {
	ID         int       `json:"id" gorm:"primaryKey"`
	Item       string    `json:"item"`
	Category   *Category `json:"category"`
	CategoryID int       `json:"categoryId"`
	IsIncome   bool      `json:"isIncome"`
	Date       string    `json:"date"`
	Amount     float64   `json:"amount"`
	UserId     string    `json:"userId"`
}
