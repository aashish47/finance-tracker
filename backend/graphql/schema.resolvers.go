package graphql

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.45

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/aashish47/finance-tracker/backend/graphql/model"
	"github.com/aashish47/finance-tracker/backend/middleware"
	jwt "github.com/dgrijalva/jwt-go"
)

// Transactions is the resolver for the transactions field.
func (r *categoryResolver) Transactions(ctx context.Context, obj *model.Category, rangeArg *model.RangeInput) ([]*model.Transaction, error) {
	key := middleware.ContextKeyClaims
	claims, ok := ctx.Value(key).(jwt.MapClaims)
	if !ok {

		return nil, errors.New("failed to retrieve claims from context")
	}

	transactions := []*model.Transaction{}
	userId, ok := claims["sub"].(string)
	if !ok {
		return nil, errors.New("user id not found in claims")
	}

	query := r.DB.Where("category_id = ? AND user_id = ?", obj.ID, userId)

	if rangeArg != nil {
		query = query.Where("date >= ? AND date <= ?", rangeArg.StartDate, rangeArg.EndDate)
	}

	if err := query.Find(&transactions).Error; err != nil {
		return nil, err
	}

	return transactions, nil
}

// Total is the resolver for the total field.
func (r *categoryResolver) Total(ctx context.Context, obj *model.Category, rangeArg *model.RangeInput) (*float64, error) {
	key := middleware.ContextKeyClaims
	claims, ok := ctx.Value(key).(jwt.MapClaims)
	if !ok {
		return nil, errors.New("failed to retrieve claims from context")
	}

	var total sql.NullFloat64
	userId, ok := claims["sub"].(string)
	if !ok {
		return nil, errors.New("user id not found in claims")
	}

	query := r.DB.Model(&model.Transaction{}).Select("COALESCE(SUM(amount), 0)").Where("category_id = ? AND user_id = ?", obj.ID, userId)

	if rangeArg != nil {
		query = query.Where("date >= ? AND date <= ?", rangeArg.StartDate, rangeArg.EndDate)
	}

	if err := query.Row().Scan(&total); err != nil {
		return nil, err
	}

	if !total.Valid {
		return nil, nil
	}

	return &total.Float64, nil
}

// CreateTransaction is the resolver for the createTransaction field.
func (r *mutationResolver) CreateTransaction(ctx context.Context, input model.TransactionInput) (*model.Transaction, error) {
	key := middleware.ContextKeyClaims
	claims, ok := ctx.Value(key).(jwt.MapClaims)
	if !ok {
		return nil, errors.New("failed to retrieve claims from context")
	}

	userId, ok := claims["sub"].(string)
	if !ok {
		return nil, errors.New("user id not found in claims")
	}

	category := &model.Category{}
	if err := r.DB.First(&category, input.CategoryID).Error; err != nil {
		return nil, err
	}

	newTransaction := &model.Transaction{
		Item:       input.Item,
		CategoryID: input.CategoryID,
		IsIncome:   input.IsIncome,
		Date:       input.Date,
		Amount:     input.Amount,
		UserId:     userId,
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
func (r *mutationResolver) DeleteTransaction(ctx context.Context, id int) (*model.Transaction, error) {
	transaction := model.Transaction{}
	if err := r.DB.Where("id = ?", id).First(&transaction).Error; err != nil {
		fmt.Print(err)
		return nil, err
	}

	deletedTransaction := transaction
	if err := r.DB.Delete(&transaction).Error; err != nil {
		return nil, err
	}
	return &deletedTransaction, nil
}

// Transactions is the resolver for the Transactions field.
func (r *queryResolver) Transactions(ctx context.Context, rangeArg *model.RangeInput) ([]*model.Transaction, error) {
	key := middleware.ContextKeyClaims
	claims, ok := ctx.Value(key).(jwt.MapClaims)
	if !ok {
		return nil, errors.New("failed to retrieve claims from context")
	}

	transactions := []*model.Transaction{}
	userId, ok := claims["sub"].(string)
	if !ok {
		return nil, errors.New("user id not found in claims")
	}

	query := r.DB.Where("user_id = ?", userId)

	if rangeArg != nil {
		query.Where("date >= ? AND date <= ?", rangeArg.StartDate, rangeArg.EndDate)
	}

	query = query.Order("date DESC")

	if err := query.Find(&transactions).Error; err != nil {
		return nil, err
	}

	return transactions, nil
}

// Transaction is the resolver for the Transaction field.
func (r *queryResolver) Transaction(ctx context.Context, id int) (*model.Transaction, error) {
	key := middleware.ContextKeyClaims
	claims, ok := ctx.Value(key).(jwt.MapClaims)
	if !ok {
		return nil, errors.New("failed to retrieve claims from context")
	}

	transaction := model.Transaction{}
	userId, ok := claims["sub"].(string)
	if !ok {
		return nil, errors.New("user id not found in claims")
	}

	// Query the transaction ensuring it belongs to the authenticated user
	if err := r.DB.Where("id = ? AND user_id = ?", id, userId).First(&transaction).Error; err != nil {
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

// Years is the resolver for the Years field.
func (r *queryResolver) Years(ctx context.Context) ([]*int, error) {
	var years []*int
	key := middleware.ContextKeyClaims
	claims, ok := ctx.Value(key).(jwt.MapClaims)
	if !ok {
		return nil, errors.New("failed to retrieve claims from context")
	}

	userId, ok := claims["sub"].(string)
	if !ok {
		return nil, errors.New("user id not found in claims")
	}

	rows, err := r.DB.Raw("SELECT DISTINCT extract(YEAR FROM DATE) AS year FROM transactions WHERE user_id = ? ORDER BY year DESC", userId).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var year int
		if err := rows.Scan(&year); err != nil {
			return nil, err
		}
		years = append(years, &year)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return years, nil
}

// LastDate is the resolver for the LastDate field.
func (r *queryResolver) LastDate(ctx context.Context) (*string, error) {
	key := middleware.ContextKeyClaims
	claims, ok := ctx.Value(key).(jwt.MapClaims)
	if !ok {
		return nil, errors.New("failed to retrieve claims from context")
	}

	userId, ok := claims["sub"].(string)
	if !ok {
		return nil, errors.New("user id not found in claims")
	}

	transaction := &model.Transaction{}
	var lastDate time.Time

	if err := r.DB.Model(&transaction).Where("user_id = ?", userId).Order("date DESC").Limit(1).Pluck("date", &lastDate).Error; err != nil {
		return nil, err
	}

	if lastDate.IsZero() {
		return nil, nil
	}

	formattedDate := lastDate.Format("2006-01-02T15:04:05-0700")

	result := &formattedDate

	return result, nil
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
