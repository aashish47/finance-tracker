package transaction

import (
	"encoding/base64"
	"fmt"
	"time"

	"github.com/aashish47/finance-tracker/backend/internal/graphql/model"
	"gorm.io/gorm"
)

// repository implements Repository interface
type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

// CreateTransaction creates a new transaction in the database
func (r *repository) CreateTransaction(transaction *model.Transaction) (*model.Transaction, error) {
	if err := r.db.Create(transaction).Error; err != nil {
		return nil, err
	}
	return transaction, nil
}

// UpdateTransaction updates an existing transaction
func (r *repository) UpdateTransaction(id int, input model.UpdateTransactionInput) (*model.Transaction, error) {
	transaction := model.Transaction{}

	if err := r.db.First(&transaction, id).Error; err != nil {
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

	if err := r.db.Save(&transaction).Error; err != nil {
		return nil, err
	}

	return &transaction, nil
}

// DeleteTransaction deletes a transaction from the database
func (r *repository) DeleteTransaction(id int) (*model.Transaction, error) {
	transaction := model.Transaction{}

	if err := r.db.Where("id = ?", id).First(&transaction).Error; err != nil {
		return nil, err
	}

	deletedTransaction := transaction
	if err := r.db.Delete(&transaction).Error; err != nil {
		return nil, err
	}
	return &deletedTransaction, nil
}

// GetTransactions retrieves all transactions for a user with optional date range filter
func (r *repository) GetTransactions(userID string, rangeArg *model.RangeInput) ([]*model.Transaction, error) {
	transactions := []*model.Transaction{}
	query := r.db.Where("user_id = ?", userID)

	if rangeArg != nil {
		query.Where("date Between ? AND ?", rangeArg.StartDate, rangeArg.EndDate)
	}

	query = query.Order("date DESC")

	if err := query.Preload("Category").Find(&transactions).Error; err != nil {
		return nil, err
	}

	return transactions, nil
}

// GetTransaction retrieves a single transaction by ID for a specific user
func (r *repository) GetTransaction(id int, userID string) (*model.Transaction, error) {
	transaction := model.Transaction{}

	if err := r.db.Preload("Category").Where("id = ? AND user_id = ?", id, userID).First(&transaction).Error; err != nil {
		return nil, err
	}

	return &transaction, nil
}

// GetCategoryTotals retrieves aggregated category totals for a specific year, optionally filtered by month and search
func (r *repository) GetCategoryTotals(userID string, year int, month *int, search *string) ([]*model.CategoryTotal, error) {
	var rows []struct {
		Category string  `gorm:"column:category"`
		Total    float64 `gorm:"column:total"`
		Count    int     `gorm:"column:count"`
	}

	query := r.db.Table("transactions").
		Select("categories.name as category, COALESCE(SUM(transactions.amount),0) as total, COUNT(transactions.id) as count").
		Joins("LEFT JOIN categories ON categories.id = transactions.category_id").
		Where("transactions.user_id = ? AND EXTRACT(YEAR FROM transactions.date) = ?", userID, year)

	if month != nil {
		query = query.Where("EXTRACT(MONTH FROM transactions.date) = ?", *month)
	}
	if search != nil && *search != "" {
		query = query.Where("transactions.item ILIKE ?", "%"+*search+"%")
	}
	query = query.Group("categories.id, categories.name").Order("total DESC")

	if err := query.Scan(&rows).Error; err != nil {
		return nil, err
	}

	result := make([]*model.CategoryTotal, 0, len(rows))
	for _, rrow := range rows {
		ct := &model.CategoryTotal{
			Category: rrow.Category,
			Total:    rrow.Total,
			Count:    rrow.Count,
		}
		result = append(result, ct)
	}

	return result, nil
}

// GetMonthlyTotals retrieves monthly aggregated totals for a specific year, optionally filtered by category and search
func (r *repository) GetMonthlyTotals(userID string, year int, categoryID *int, search *string) ([]*model.MonthlyTotal, error) {
	var rows []struct {
		Month int     `gorm:"column:month"`
		Total float64 `gorm:"column:total"`
		Count int     `gorm:"column:count"`
	}

	query := r.db.Table("transactions").
		Select("EXTRACT(MONTH FROM date) AS month, COALESCE(SUM(amount),0) AS total, COUNT(id) AS count").
		Where("user_id = ? AND EXTRACT(YEAR FROM date) = ?", userID, year)

	if categoryID != nil {
		query = query.Where("category_id = ?", *categoryID)
	}
	if search != nil && *search != "" {
		query = query.Where("item ILIKE ?", "%"+*search+"%")
	}
	query = query.Group("month").Order("month ASC")

	if err := query.Scan(&rows).Error; err != nil {
		return nil, err
	}

	// prepare 12 months default
	monthlyMap := make(map[int]*model.MonthlyTotal)
	for _, row := range rows {
		monthlyMap[row.Month] = &model.MonthlyTotal{Month: row.Month, Total: row.Total, Count: row.Count}
	}

	result := make([]*model.MonthlyTotal, 12)
	for m := 1; m <= 12; m++ {
		if v, ok := monthlyMap[m]; ok {
			result[m-1] = v
		} else {
			result[m-1] = &model.MonthlyTotal{Month: m, Total: 0, Count: 0}
		}
	}

	return result, nil
}

// GetTransactionsPaginated retrieves paginated transactions with filtering and sorting options
func (r *repository) GetTransactionsPaginated(userID string, year int, month *int, categoryID *int, page *int, limit *int, search *string, sort *string) (*model.TransactionConnection, error) {
	p := 1
	l := 20
	if page != nil && *page > 0 {
		p = *page
	}
	if limit != nil && *limit > 0 {
		l = *limit
	}

	baseQuery := r.db.Model(&model.Transaction{}).Where("user_id = ? AND EXTRACT(YEAR FROM date) = ?", userID, year)
	if month != nil {
		baseQuery = baseQuery.Where("EXTRACT(MONTH FROM date) = ?", *month)
	}
	if categoryID != nil {
		baseQuery = baseQuery.Where("category_id = ?", *categoryID)
	}
	if search != nil && *search != "" {
		baseQuery = baseQuery.Where("item ILIKE ?", "%"+*search+"%")
	}

	var totalCount int64
	if err := baseQuery.Count(&totalCount).Error; err != nil {
		return nil, err
	}

	// --- Dynamic Sorting Logic ---
	orderClause := "date DESC" // Default
	if sort != nil {
		switch *sort {
		case "date_asc":
			orderClause = "date ASC"
		case "date_desc":
			orderClause = "date DESC"
		case "amnt_asc":
			orderClause = "amount ASC"
		case "amnt_desc":
			orderClause = "amount DESC"
		}
	}

	transactions := []*model.Transaction{}
	offset := (p - 1) * l
	if err := baseQuery.Preload("Category").Order(orderClause).Limit(l).Offset(offset).Find(&transactions).Error; err != nil {
		return nil, err
	}

	edges := make([]*model.TransactionEdge, 0, len(transactions))
	for _, t := range transactions {
		cursorRaw := fmt.Sprintf("%d:%s", t.ID, t.Date)
		cursor := base64.StdEncoding.EncodeToString([]byte(cursorRaw))
		edges = append(edges, &model.TransactionEdge{Node: t, Cursor: cursor})
	}

	var startCursor *string
	var endCursor *string
	if len(edges) > 0 {
		startCursor = &edges[0].Cursor
		endCursor = &edges[len(edges)-1].Cursor
	}

	hasNext := int64(offset+len(transactions)) < totalCount
	hasPrev := p > 1

	conn := &model.TransactionConnection{
		Edges: edges,
		PageInfo: &model.PageInfo{
			HasNextPage:     hasNext,
			HasPreviousPage: hasPrev,
			StartCursor:     startCursor,
			EndCursor:       endCursor,
		},
		TotalCount: int(totalCount),
	}

	return conn, nil
}

// GetLastTransactionDate retrieves the most recent transaction date for a user
func (r *repository) GetLastTransactionDate(userID string) (*string, error) {
	transaction := &model.Transaction{}
	var lastDate time.Time

	if err := r.db.Model(&transaction).Where("user_id = ?", userID).Order("date DESC").Limit(1).Pluck("date", &lastDate).Error; err != nil {
		return nil, err
	}

	if lastDate.IsZero() {
		return nil, nil
	}

	formattedDate := lastDate.Format(time.RFC3339)
	return &formattedDate, nil
}

// GetTotal calculates the total sum of transactions for a user with optional date range filter
func (r *repository) GetTotal(userID string, rangeArg *model.RangeInput) (*float64, error) {
	var total float64
	query := r.db.Model(&model.Transaction{}).Where("user_id = ?", userID)

	if rangeArg != nil {
		query.Where("date Between ? AND ?", rangeArg.StartDate, rangeArg.EndDate)
	}

	if err := query.Select("COALESCE(SUM(amount), 0)").Scan(&total).Error; err != nil {
		return nil, err
	}

	return &total, nil
}

// GetCategoryForTransaction fetches the category associated with a transaction
func (r *repository) GetCategoryForTransaction(categoryID int) (*model.Category, error) {
	category := &model.Category{}
	if err := r.db.First(&category, categoryID).Error; err != nil {
		return nil, err
	}
	return category, nil
}
