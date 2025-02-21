// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type Category struct {
	ID           int            `json:"id"`
	Name         string         `json:"name"`
	Transactions []*Transaction `json:"transactions,omitempty"`
	Total        *float64       `json:"total,omitempty"`
}

type MonthSummary struct {
	Month      int         `json:"month"`
	Categories []*Category `json:"categories,omitempty"`
	Total      *float64    `json:"total,omitempty"`
}

type Mutation struct {
}

type Query struct {
}

type RangeInput struct {
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
}

type TransactionInput struct {
	Item       string  `json:"item"`
	CategoryID int     `json:"categoryID"`
	IsIncome   bool    `json:"isIncome"`
	Date       string  `json:"date"`
	Amount     float64 `json:"amount"`
}

type UpdateTransactionInput struct {
	Item       *string  `json:"item,omitempty"`
	CategoryID *int     `json:"categoryID,omitempty"`
	IsIncome   *bool    `json:"isIncome,omitempty"`
	Date       *string  `json:"date,omitempty"`
	Amount     *float64 `json:"amount,omitempty"`
}
