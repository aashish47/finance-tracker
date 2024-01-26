package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.36

import (
	"context"
	"errors"
	"fmt"

	"github.com/aashish47/finance-tracker/backend/graph/model"
	"github.com/aashish47/finance-tracker/backend/middleware"
	"github.com/dgrijalva/jwt-go"
)

// Transactions is the resolver for the transactions field.
func (r *categoryResolver) Transactions(ctx context.Context, obj *model.Category, rangeArg *model.RangeInput) ([]*model.Transaction, error) {

	transactions := []*model.Transaction{}
	query := r.DB.Where("category_id = ?", obj.ID)

	if rangeArg != nil {
		query.Where("date >= ? AND date <= ?", rangeArg.StartDate, rangeArg.EndDate)

	}
	if err := query.Find(&transactions).Error; err != nil {
		return nil, err
	}

	return transactions, nil
}

// Total is the resolver for the total field.
func (r *categoryResolver) Total(ctx context.Context, obj *model.Category, rangeArg *model.RangeInput) (*float64, error) {
	var total float64
	transactions := []*model.Transaction{}

	query := r.DB.Where("category_id = ?", obj.ID)

	if rangeArg != nil {
		query.Where("date >= ? AND date <= ?", rangeArg.StartDate, rangeArg.EndDate)
	}

	if err := query.Find(&transactions).Error; err != nil {
		return nil, err
	}

	for _, transaction := range transactions {
		total += transaction.Amount
	}
	return &total, nil
}

// CreateTransaction is the resolver for the createTransaction field.
func (r *mutationResolver) CreateTransaction(ctx context.Context, input model.TransactionInput) (*model.Transaction, error) {
	category := &model.Category{}
	if err := r.DB.First(&category, input.CategoryID).Error; err != nil {
		return nil, err
	}

	newTransaction := &model.Transaction{
		Item: input.Item,
		// Category:   category,
		CategoryID: input.CategoryID,
		IsIncome:   input.IsIncome,
		Date:       input.Date,
		Amount:     input.Amount,
	}

	if err := r.DB.Create(newTransaction).Error; err != nil {
		return nil, err
	}

	return newTransaction, nil
}

// UpdateTransaction is the resolver for the updateTransaction field.
func (r *mutationResolver) UpdateTransaction(ctx context.Context, id int, input model.UpdateTransactionInput) (*model.Transaction, error) {
	transaction := model.Transaction{}

	if err := r.DB.First(&transaction, id).Error; err != nil {
		return nil, err
	}

	if input.CategoryID != nil {
		transaction.CategoryID = *input.CategoryID
	}

	if input.Amount != nil {
		transaction.Amount = *input.Amount
	}
	if input.Date != nil {
		transaction.Date = *input.Date
	}
	if input.IsIncome != nil {
		transaction.IsIncome = *input.IsIncome
	}
	if input.Item != nil {
		transaction.Item = *input.Item
	}

	if err := r.DB.Save(&transaction).Error; err != nil {
		return nil, err
	}

	return &transaction, nil
}

// DeleteTransaction is the resolver for the deleteTransaction field.
func (r *mutationResolver) DeleteTransaction(ctx context.Context, id int) (*bool, error) {
	transaction := model.Transaction{}
	bool := false
	if err := r.DB.Where("id = ?", id).First(&transaction).Error; err != nil {
		return &bool, err
	}

	if err := r.DB.Delete(&transaction).Error; err != nil {
		return nil, err
	}
	bool = true
	return &bool, nil
}

// Transactions is the resolver for the Transactions field.
func (r *queryResolver) Transactions(ctx context.Context, rangeArg *model.RangeInput) ([]*model.Transaction, error) {

	key := middleware.ContextKeyClaims
	claims, ok := ctx.Value(key).(jwt.MapClaims)
	if !ok {
		// Handle error: failed to retrieve claims from context
		// This could happen if the key or type is incorrect
		return nil, errors.New("failed to retrieve claims from context")
	}

	// Now you can access the claims and perform authentication and authorization checks

	for key, value := range claims {
		fmt.Printf("%s: %v\n", key, value)
	}

	transactions := []*model.Transaction{}

	query := r.DB

	if rangeArg != nil {
		query.Where("date >= ? AND date <= ?", rangeArg.StartDate, rangeArg.EndDate)
	}

	if err := query.Find(&transactions).Error; err != nil {
		return nil, err
	}

	return transactions, nil
}

// Transaction is the resolver for the Transaction field.
func (r *queryResolver) Transaction(ctx context.Context, id int) (*model.Transaction, error) {
	transaction := model.Transaction{}
	if err := r.DB.First(&transaction, id).Error; err != nil {
		return nil, err
	}

	return &transaction, nil
}

// Categories is the resolver for the Categories field.
func (r *queryResolver) Categories(ctx context.Context) ([]*model.Category, error) {
	categories := []*model.Category{}
	if err := r.DB.Find(&categories).Error; err != nil {
		return nil, err
	}

	return categories, nil
}

// Category is the resolver for the Category field.
func (r *queryResolver) Category(ctx context.Context, id int) (*model.Category, error) {
	category := model.Category{}

	if err := r.DB.First(&category, id).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

// Category is the resolver for the category field.
func (r *transactionResolver) Category(ctx context.Context, obj *model.Transaction) (*model.Category, error) {
	category := &model.Category{}

	if err := r.DB.First(&category, obj.CategoryID).Error; err != nil {
		return nil, err
	}
	return category, nil
}

// Category returns CategoryResolver implementation.
func (r *Resolver) Category() CategoryResolver { return &categoryResolver{r} }

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

// Transaction returns TransactionResolver implementation.
func (r *Resolver) Transaction() TransactionResolver { return &transactionResolver{r} }

type categoryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type transactionResolver struct{ *Resolver }
