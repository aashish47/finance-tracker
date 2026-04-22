/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation CreateTransaction($input: TransactionInput!) {\n  createTransaction(input: $input) {\n    id\n    item\n    date\n    amount\n    category {\n      id\n      name\n    }\n  }\n}": typeof types.CreateTransactionDocument,
    "mutation DeleteTransaction($id: ID!) {\n  deleteTransaction(id: $id) {\n    id\n    item\n    date\n    amount\n    category {\n      id\n      name\n    }\n  }\n}": typeof types.DeleteTransactionDocument,
    "query GetCategories($range: RangeInput) {\n  Categories(range: $range) {\n    id\n    name\n  }\n}": typeof types.GetCategoriesDocument,
    "query GetCategoryTotals($year: Int!, $month: Int, $search: String) {\n  GetCategoryTotals(year: $year, month: $month, search: $search) {\n    category\n    total\n    count\n  }\n}": typeof types.GetCategoryTotalsDocument,
    "query GetDaysData($range: RangeInput) {\n  Transactions(range: $range) {\n    id\n    item\n    amount\n    date\n    category {\n      id\n      name\n    }\n  }\n  Total(range: $range)\n}": typeof types.GetDaysDataDocument,
    "query GetLastDate {\n  LastDate\n}": typeof types.GetLastDateDocument,
    "query GetMonthlyTotals($year: Int!, $categoryID: ID, $search: String) {\n  GetMonthlyTotals(year: $year, categoryID: $categoryID, search: $search) {\n    month\n    total\n    count\n  }\n}": typeof types.GetMonthlyTotalsDocument,
    "query GetTransactionsPaginated($year: Int!, $month: Int, $categoryID: ID, $page: Int, $limit: Int, $search: String, $sort: String) {\n  GetTransactionsPaginated(\n    year: $year\n    month: $month\n    categoryID: $categoryID\n    page: $page\n    limit: $limit\n    search: $search\n    sort: $sort\n  ) {\n    edges {\n      node {\n        id\n        item\n        category {\n          id\n          name\n        }\n        amount\n        date\n        isIncome\n        userId\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    totalCount\n  }\n}": typeof types.GetTransactionsPaginatedDocument,
    "query GetYears {\n  Years\n}": typeof types.GetYearsDocument,
    "mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {\n  updateTransaction(id: $id, input: $input) {\n    id\n    item\n    category {\n      id\n      name\n    }\n    amount\n    date\n  }\n}": typeof types.UpdateTransactionDocument,
};
const documents: Documents = {
    "mutation CreateTransaction($input: TransactionInput!) {\n  createTransaction(input: $input) {\n    id\n    item\n    date\n    amount\n    category {\n      id\n      name\n    }\n  }\n}": types.CreateTransactionDocument,
    "mutation DeleteTransaction($id: ID!) {\n  deleteTransaction(id: $id) {\n    id\n    item\n    date\n    amount\n    category {\n      id\n      name\n    }\n  }\n}": types.DeleteTransactionDocument,
    "query GetCategories($range: RangeInput) {\n  Categories(range: $range) {\n    id\n    name\n  }\n}": types.GetCategoriesDocument,
    "query GetCategoryTotals($year: Int!, $month: Int, $search: String) {\n  GetCategoryTotals(year: $year, month: $month, search: $search) {\n    category\n    total\n    count\n  }\n}": types.GetCategoryTotalsDocument,
    "query GetDaysData($range: RangeInput) {\n  Transactions(range: $range) {\n    id\n    item\n    amount\n    date\n    category {\n      id\n      name\n    }\n  }\n  Total(range: $range)\n}": types.GetDaysDataDocument,
    "query GetLastDate {\n  LastDate\n}": types.GetLastDateDocument,
    "query GetMonthlyTotals($year: Int!, $categoryID: ID, $search: String) {\n  GetMonthlyTotals(year: $year, categoryID: $categoryID, search: $search) {\n    month\n    total\n    count\n  }\n}": types.GetMonthlyTotalsDocument,
    "query GetTransactionsPaginated($year: Int!, $month: Int, $categoryID: ID, $page: Int, $limit: Int, $search: String, $sort: String) {\n  GetTransactionsPaginated(\n    year: $year\n    month: $month\n    categoryID: $categoryID\n    page: $page\n    limit: $limit\n    search: $search\n    sort: $sort\n  ) {\n    edges {\n      node {\n        id\n        item\n        category {\n          id\n          name\n        }\n        amount\n        date\n        isIncome\n        userId\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    totalCount\n  }\n}": types.GetTransactionsPaginatedDocument,
    "query GetYears {\n  Years\n}": types.GetYearsDocument,
    "mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {\n  updateTransaction(id: $id, input: $input) {\n    id\n    item\n    category {\n      id\n      name\n    }\n    amount\n    date\n  }\n}": types.UpdateTransactionDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateTransaction($input: TransactionInput!) {\n  createTransaction(input: $input) {\n    id\n    item\n    date\n    amount\n    category {\n      id\n      name\n    }\n  }\n}"): typeof import('./graphql').CreateTransactionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteTransaction($id: ID!) {\n  deleteTransaction(id: $id) {\n    id\n    item\n    date\n    amount\n    category {\n      id\n      name\n    }\n  }\n}"): typeof import('./graphql').DeleteTransactionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetCategories($range: RangeInput) {\n  Categories(range: $range) {\n    id\n    name\n  }\n}"): typeof import('./graphql').GetCategoriesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetCategoryTotals($year: Int!, $month: Int, $search: String) {\n  GetCategoryTotals(year: $year, month: $month, search: $search) {\n    category\n    total\n    count\n  }\n}"): typeof import('./graphql').GetCategoryTotalsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetDaysData($range: RangeInput) {\n  Transactions(range: $range) {\n    id\n    item\n    amount\n    date\n    category {\n      id\n      name\n    }\n  }\n  Total(range: $range)\n}"): typeof import('./graphql').GetDaysDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetLastDate {\n  LastDate\n}"): typeof import('./graphql').GetLastDateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetMonthlyTotals($year: Int!, $categoryID: ID, $search: String) {\n  GetMonthlyTotals(year: $year, categoryID: $categoryID, search: $search) {\n    month\n    total\n    count\n  }\n}"): typeof import('./graphql').GetMonthlyTotalsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTransactionsPaginated($year: Int!, $month: Int, $categoryID: ID, $page: Int, $limit: Int, $search: String, $sort: String) {\n  GetTransactionsPaginated(\n    year: $year\n    month: $month\n    categoryID: $categoryID\n    page: $page\n    limit: $limit\n    search: $search\n    sort: $sort\n  ) {\n    edges {\n      node {\n        id\n        item\n        category {\n          id\n          name\n        }\n        amount\n        date\n        isIncome\n        userId\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n    totalCount\n  }\n}"): typeof import('./graphql').GetTransactionsPaginatedDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetYears {\n  Years\n}"): typeof import('./graphql').GetYearsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {\n  updateTransaction(id: $id, input: $input) {\n    id\n    item\n    category {\n      id\n      name\n    }\n    amount\n    date\n  }\n}"): typeof import('./graphql').UpdateTransactionDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
