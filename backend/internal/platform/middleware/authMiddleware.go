package middleware

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Regex to find the name after 'query', 'mutation', or 'subscription'
var reOpName = regexp.MustCompile(`(?i)(query|mutation|subscription)\s+([a-zA-Z0-9_]+)`)

// GQLRequest represents the standard GraphQL POST body
type GQLRequest struct {
	OperationName string `json:"operationName"`
	Query         string `json:"query"`
}

// Define a custom type for the context key
type ContextKey string

// Define context keys for different values
const (
	ContextKeyClaims ContextKey = "claims"
)

func ValidateToken(tokenString string) (jwt.MapClaims, error) {
	secret := os.Getenv("JWT_SECRET")
	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Check the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		// Return the secret key used for signing
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}

	// Verify token validity
	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	// Extract claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, fmt.Errorf("unable to extract claims")
}

func extractOperationName(body GQLRequest) string {
	// If the client actually sent the operationName field, use it
	if body.OperationName != "" {
		return body.OperationName
	}

	// Otherwise, peek into the query string
	matches := reOpName.FindStringSubmatch(body.Query)
	if len(matches) > 2 {
		return matches[2]
	}

	return "anonymous"
}

func getOperationName(r *http.Request) string {
	if r.Method != http.MethodPost {
		return "non-gql"
	}

	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		return "read-error"
	}

	// This is the most important line for your middleware chain
	r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

	var gqlReq GQLRequest
	if err := json.Unmarshal(bodyBytes, &gqlReq); err != nil {
		return "anonymous"
	}

	return extractOperationName(gqlReq)
}

func printRequestStats(start time.Time, path string, opName string) {
	if os.Getenv("PORT") == "" {
		// time.Since calculates the TRUE duration at this exact moment
		log.Printf("[GQL] %s | Op: %s | Duration: %v", path, opName, time.Since(start))
	}
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Only initialize logging logic if in Dev (PORT == "")
		if os.Getenv("PORT") == "" {
			start := time.Now()
			// Capture name and restore body immediately
			opName := getOperationName(r)
			// Defer the print to run after next.ServeHTTP
			defer printRequestStats(start, r.URL.Path, opName)
		}

		authorizationHeader := r.Header.Get("Authorization")
		token := strings.TrimPrefix(authorizationHeader, "Bearer ")

		claims, err := ValidateToken(token)
		if err != nil {
			http.Error(w, fmt.Sprintf("Unauthorized: %v", err), http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), ContextKeyClaims, claims)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}
