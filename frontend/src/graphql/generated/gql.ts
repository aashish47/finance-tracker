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
    "query GetDaysData($range: RangeInput) {\n  Transactions(range: $range) {\n    id\n    item\n    amount\n    date\n    category {\n      id\n      name\n    }\n  }\n  Total(range: $range)\n}": typeof types.GetDaysDataDocument,
    "query GetLastDate {\n  LastDate\n}": typeof types.GetLastDateDocument,
    "query GetTransactions($range: RangeInput) {\n  Transactions(range: $range) {\n    id\n    item\n    category {\n      id\n      name\n    }\n    date\n    amount\n  }\n}": typeof types.GetTransactionsDocument,
    "query GetTransactionsByMonth($year: Int!) {\n  TransactionsByMonth(year: $year) {\n    categories {\n      id\n      name\n      transactions {\n        id\n        item\n        date\n        amount\n        category {\n          id\n          name\n        }\n      }\n      total\n    }\n    total\n  }\n}": typeof types.GetTransactionsByMonthDocument,
    "query GetYearlyData($year: Int!, $range: RangeInput) {\n  TransactionsByMonth(year: $year) {\n    total\n    categories {\n      total\n      name\n      transactions {\n        id\n        item\n        amount\n        date\n        category {\n          id\n          name\n        }\n      }\n    }\n  }\n  Categories(range: $range) {\n    id\n    name\n    total(range: $range)\n  }\n  Years\n}": typeof types.GetYearlyDataDocument,
    "query GetYears {\n  Years\n}": typeof types.GetYearsDocument,
    "mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {\n  updateTransaction(id: $id, input: $input) {\n    id\n    item\n    category {\n      id\n      name\n    }\n    amount\n    date\n  }\n}": typeof types.UpdateTransactionDocument,
};
const documents: Documents = {
    "mutation CreateTransaction($input: TransactionInput!) {\n  createTransaction(input: $input) {\n    id\n    item\n    date\n    amount\n    category {\n      id\n      name\n    }\n  }\n}": types.CreateTransactionDocument,
    "mutation DeleteTransaction($id: ID!) {\n  deleteTransaction(id: $id) {\n    id\n    item\n    date\n    amount\n    category {\n      id\n      name\n    }\n  }\n}": types.DeleteTransactionDocument,
    "query GetCategories($range: RangeInput) {\n  Categories(range: $range) {\n    id\n    name\n  }\n}": types.GetCategoriesDocument,
    "query GetDaysData($range: RangeInput) {\n  Transactions(range: $range) {\n    id\n    item\n    amount\n    date\n    category {\n      id\n      name\n    }\n  }\n  Total(range: $range)\n}": types.GetDaysDataDocument,
    "query GetLastDate {\n  LastDate\n}": types.GetLastDateDocument,
    "query GetTransactions($range: RangeInput) {\n  Transactions(range: $range) {\n    id\n    item\n    category {\n      id\n      name\n    }\n    date\n    amount\n  }\n}": types.GetTransactionsDocument,
    "query GetTransactionsByMonth($year: Int!) {\n  TransactionsByMonth(year: $year) {\n    categories {\n      id\n      name\n      transactions {\n        id\n        item\n        date\n        amount\n        category {\n          id\n          name\n        }\n      }\n      total\n    }\n    total\n  }\n}": types.GetTransactionsByMonthDocument,
    "query GetYearlyData($year: Int!, $range: RangeInput) {\n  TransactionsByMonth(year: $year) {\n    total\n    categories {\n      total\n      name\n      transactions {\n        id\n        item\n        amount\n        date\n        category {\n          id\n          name\n        }\n      }\n    }\n  }\n  Categories(range: $range) {\n    id\n    name\n    total(range: $range)\n  }\n  Years\n}": types.GetYearlyDataDocument,
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
export function graphql(source: "query GetDaysData($range: RangeInput) {\n  Transactions(range: $range) {\n    id\n    item\n    amount\n    date\n    category {\n      id\n      name\n    }\n  }\n  Total(range: $range)\n}"): typeof import('./graphql').GetDaysDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetLastDate {\n  LastDate\n}"): typeof import('./graphql').GetLastDateDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTransactions($range: RangeInput) {\n  Transactions(range: $range) {\n    id\n    item\n    category {\n      id\n      name\n    }\n    date\n    amount\n  }\n}"): typeof import('./graphql').GetTransactionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetTransactionsByMonth($year: Int!) {\n  TransactionsByMonth(year: $year) {\n    categories {\n      id\n      name\n      transactions {\n        id\n        item\n        date\n        amount\n        category {\n          id\n          name\n        }\n      }\n      total\n    }\n    total\n  }\n}"): typeof import('./graphql').GetTransactionsByMonthDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetYearlyData($year: Int!, $range: RangeInput) {\n  TransactionsByMonth(year: $year) {\n    total\n    categories {\n      total\n      name\n      transactions {\n        id\n        item\n        amount\n        date\n        category {\n          id\n          name\n        }\n      }\n    }\n  }\n  Categories(range: $range) {\n    id\n    name\n    total(range: $range)\n  }\n  Years\n}"): typeof import('./graphql').GetYearlyDataDocument;
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
