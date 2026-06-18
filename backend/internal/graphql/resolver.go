package graphql

import (
	"github.com/aashish47/finance-tracker/backend/internal/modules/category"
	"github.com/aashish47/finance-tracker/backend/internal/modules/transaction"
)

//go:generate go run github.com/99designs/gqlgen generate
// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	TransactionRepo *transaction.TransactionRepository
	CategoryRepo    *category.CategoryRepository
}

func NewResolver(transactionRepo *transaction.TransactionRepository, categoryRepo *category.CategoryRepository) *Resolver {
	return &Resolver{
		TransactionRepo: transactionRepo,
		CategoryRepo:    categoryRepo,
	}
}
