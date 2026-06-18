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
	TransactionService *transaction.Service
	CategoryService    *category.Service
}

func NewResolver(transactionService *transaction.Service, categoryService *category.Service) *Resolver {
	return &Resolver{
		TransactionService: transactionService,
		CategoryService:    categoryService,
	}
}
