package category

import (
	"github.com/aashish47/finance-tracker/backend/internal/graphql/model"
)

// Repository defines the interface for category data access
type Repository interface {
	GetCategoryTransactions(categoryID int, rangeArg *model.RangeInput) ([]*model.Transaction, error)
	GetCategoryTotal(categoryID int, rangeArg *model.RangeInput) (*float64, error)
	GetCategories(userID string, rangeArg *model.RangeInput) ([]*model.Category, error)
	GetCategory(id int) (*model.Category, error)
	GetYears(userID string) ([]*int, error)
}

// Service implements the Repository interface
type Service struct {
	repo Repository
}

// NewService creates a new instance that implements Repository
func NewService(r Repository) *Service {
	return &Service{repo: r}
}

// GetCategoryTransactions delegates to repository
func (s *Service) GetCategoryTransactions(categoryID int, rangeArg *model.RangeInput) ([]*model.Transaction, error) {
	return s.repo.GetCategoryTransactions(categoryID, rangeArg)
}

// GetCategoryTotal delegates to repository
func (s *Service) GetCategoryTotal(categoryID int, rangeArg *model.RangeInput) (*float64, error) {
	return s.repo.GetCategoryTotal(categoryID, rangeArg)
}

// GetCategories delegates to repository
func (s *Service) GetCategories(userID string, rangeArg *model.RangeInput) ([]*model.Category, error) {
	return s.repo.GetCategories(userID, rangeArg)
}

// GetCategory delegates to repository
func (s *Service) GetCategory(id int) (*model.Category, error) {
	return s.repo.GetCategory(id)
}

// GetYears delegates to repository
func (s *Service) GetYears(userID string) ([]*int, error) {
	return s.repo.GetYears(userID)
}
