package category

import (
	"sort"

	"github.com/aashish47/finance-tracker/backend/internal/graphql/model"
	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

// GetCategoryTransactions retrieves all transactions for a specific category with optional date range filter
func (r *CategoryRepository) GetCategoryTransactions(categoryID int, rangeArg *model.RangeInput) ([]*model.Transaction, error) {
	transactions := []*model.Transaction{}
	query := r.db.Where("category_id = ?", categoryID)

	if rangeArg != nil {
		query.Where("date Between ? AND ?", rangeArg.StartDate, rangeArg.EndDate)
	}

	if err := query.Preload("Category").Find(&transactions).Error; err != nil {
		return nil, err
	}

	return transactions, nil
}

// GetCategoryTotal calculates the total sum of transactions for a category with optional date range filter
func (r *CategoryRepository) GetCategoryTotal(categoryID int, rangeArg *model.RangeInput) (*float64, error) {
	var total float64
	query := r.db.Model(&model.Transaction{}).Where("category_id = ?", categoryID)

	if rangeArg != nil {
		query.Where("date Between ? AND ?", rangeArg.StartDate, rangeArg.EndDate)
	}

	if err := query.Select("COALESCE(SUM(amount), 0)").Scan(&total).Error; err != nil {
		return nil, err
	}

	return &total, nil
}

// GetCategories retrieves all categories with their transactions and totals for a user
func (r *CategoryRepository) GetCategories(userID string, rangeArg *model.RangeInput) ([]*model.Category, error) {
	// Query categories (ALL categories)
	var categories []*model.Category
	if err := r.db.Find(&categories).Error; err != nil {
		return nil, err
	}

	// Query transactions with totals, joined with categories
	// Querying all transactions for the user, filtering by range if provided
	query := r.db.Table("transactions").
		Select("transactions.category_id, transactions.id AS transaction_id, transactions.amount, transactions.item, transactions.date, COALESCE(SUM(transactions.amount), 0) AS total").
		Joins("LEFT JOIN categories ON categories.id = transactions.category_id").
		Where("transactions.user_id = ?", userID).
		Group("transactions.category_id, transactions.id")

	// Apply the date range filter for transactions if provided
	if rangeArg != nil {
		query = query.Where("transactions.date Between ? AND ?", rangeArg.StartDate, rangeArg.EndDate)
	}

	// Execute the query and get transactions with category totals
	var transactionsWithTotals []struct {
		CategoryID    int     `gorm:"column:category_id"`
		TransactionID int     `gorm:"column:transaction_id"`
		Amount        float64 `gorm:"column:amount"`
		Item          string  `gorm:"column:item"`
		Date          string  `gorm:"column:date"`
		Total         float64 `gorm:"column:total"`
	}

	if err := query.Scan(&transactionsWithTotals).Error; err != nil {
		return nil, err
	}

	// Initialize a map to store categories by their ID
	categoryMap := make(map[int]*model.Category)
	// Populate categoryMap with all categories
	for _, category := range categories {
		// Set default total to 0 if not already set
		if category.Total == nil {
			category.Total = new(float64)
		}
		// Ensure transactions is an empty array by default
		category.Transactions = []*model.Transaction{}
		categoryMap[category.ID] = category
	}

	// Map to store transactions for each category
	for _, data := range transactionsWithTotals {
		category, exists := categoryMap[data.CategoryID]
		if !exists {
			continue // Skip if no such category exists (shouldn't happen with all categories preloaded)
		}

		// Add the transaction to the category
		category.Transactions = append(category.Transactions, &model.Transaction{
			ID:       data.TransactionID,
			Amount:   data.Amount,
			Item:     data.Item,
			Date:     data.Date,
			Category: category,
		})

		// Update the total for the category
		*category.Total += data.Total
	}

	// Sort transactions by date (or any field you want)
	for _, category := range categoryMap {
		sort.Slice(category.Transactions, func(i, j int) bool {
			// Example sorting by date
			return category.Transactions[i].Date < category.Transactions[j].Date
		})
	}

	// Convert map to slice and sort categories by ID
	var finalCategories []*model.Category
	for _, category := range categoryMap {
		finalCategories = append(finalCategories, category)
	}

	// Sort categories by ID
	sort.Slice(finalCategories, func(i, j int) bool {
		return finalCategories[i].ID < finalCategories[j].ID
	})

	return finalCategories, nil
}

// GetCategory retrieves a single category by ID
func (r *CategoryRepository) GetCategory(id int) (*model.Category, error) {
	category := model.Category{}

	if err := r.db.First(&category, id).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

// GetYears retrieves all distinct years that have transactions for a user
func (r *CategoryRepository) GetYears(userID string) ([]*int, error) {
	var years []int

	if err := r.db.Table("distinct_years").
		Where("user_id = ?", userID).
		Select("year").
		Order("year DESC").
		Pluck("year", &years).Error; err != nil {
		return nil, err
	}

	var result []*int
	for _, year := range years {
		yearCopy := year
		result = append(result, &yearCopy)
	}

	return result, nil
}
