package transaction

import (
	"github.com/aashish47/finance-tracker/backend/internal/graphql/model"
)

// Repository defines the interface for transaction data access
type Repository interface {
	CreateTransaction(transaction *model.Transaction) (*model.Transaction, error)
	UpdateTransaction(id int, input model.UpdateTransactionInput) (*model.Transaction, error)
	DeleteTransaction(id int) (*model.Transaction, error)
	GetTransactions(userID string, rangeArg *model.RangeInput) ([]*model.Transaction, error)
	GetTransaction(id int, userID string) (*model.Transaction, error)
	GetCategoryTotals(userID string, year int, month *int, search *string) ([]*model.CategoryTotal, error)
	GetMonthlyTotals(userID string, year int, categoryID *int, search *string) ([]*model.MonthlyTotal, error)
	GetTransactionsPaginated(userID string, year int, month *int, categoryID *int, page *int, limit *int, search *string, sort *string) (*model.TransactionConnection, error)
	GetLastTransactionDate(userID string) (*string, error)
	GetTotal(userID string, rangeArg *model.RangeInput) (*float64, error)
	GetCategoryForTransaction(categoryID int) (*model.Category, error)
}

// Service implements the Repository interface
type Service struct {
	repo Repository
}

// NewService creates a new instance that implements Repository
func NewService(r Repository) *Service {
	return &Service{repo: r}
}

// CreateTransaction delegates to repository
func (s *Service) CreateTransaction(transaction *model.Transaction) (*model.Transaction, error) {
	return s.repo.CreateTransaction(transaction)
}

// UpdateTransaction delegates to repository
func (s *Service) UpdateTransaction(id int, input model.UpdateTransactionInput) (*model.Transaction, error) {
	return s.repo.UpdateTransaction(id, input)
}

// DeleteTransaction delegates to repository
func (s *Service) DeleteTransaction(id int) (*model.Transaction, error) {
	return s.repo.DeleteTransaction(id)
}

// GetTransactions delegates to repository
func (s *Service) GetTransactions(userID string, rangeArg *model.RangeInput) ([]*model.Transaction, error) {
	return s.repo.GetTransactions(userID, rangeArg)
}

// GetTransaction delegates to repository
func (s *Service) GetTransaction(id int, userID string) (*model.Transaction, error) {
	return s.repo.GetTransaction(id, userID)
}

// GetCategoryTotals delegates to repository
func (s *Service) GetCategoryTotals(userID string, year int, month *int, search *string) ([]*model.CategoryTotal, error) {
	return s.repo.GetCategoryTotals(userID, year, month, search)
}

// GetMonthlyTotals delegates to repository
func (s *Service) GetMonthlyTotals(userID string, year int, categoryID *int, search *string) ([]*model.MonthlyTotal, error) {
	return s.repo.GetMonthlyTotals(userID, year, categoryID, search)
}

// GetTransactionsPaginated delegates to repository
func (s *Service) GetTransactionsPaginated(userID string, year int, month *int, categoryID *int, page *int, limit *int, search *string, sort *string) (*model.TransactionConnection, error) {
	return s.repo.GetTransactionsPaginated(userID, year, month, categoryID, page, limit, search, sort)
}

// GetLastTransactionDate delegates to repository
func (s *Service) GetLastTransactionDate(userID string) (*string, error) {
	return s.repo.GetLastTransactionDate(userID)
}

// GetTotal delegates to repository
func (s *Service) GetTotal(userID string, rangeArg *model.RangeInput) (*float64, error) {
	return s.repo.GetTotal(userID, rangeArg)
}

// GetCategoryForTransaction delegates to repository
func (s *Service) GetCategoryForTransaction(categoryID int) (*model.Category, error) {
	return s.repo.GetCategoryForTransaction(categoryID)
}
