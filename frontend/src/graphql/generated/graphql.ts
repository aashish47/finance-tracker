/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  total?: Maybe<Scalars['Float']['output']>;
  transactions?: Maybe<Array<Maybe<Transaction>>>;
};


export type CategoryTotalArgs = {
  range?: InputMaybe<RangeInput>;
};


export type CategoryTransactionsArgs = {
  range?: InputMaybe<RangeInput>;
};

export type CategoryTotal = {
  __typename?: 'CategoryTotal';
  category: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  total: Scalars['Float']['output'];
};

export type MonthlyTotal = {
  __typename?: 'MonthlyTotal';
  count: Scalars['Int']['output'];
  month: Scalars['Int']['output'];
  total: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTransaction?: Maybe<Transaction>;
  deleteTransaction?: Maybe<Transaction>;
  updateTransaction?: Maybe<Transaction>;
};


export type MutationCreateTransactionArgs = {
  input: TransactionInput;
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTransactionArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTransactionInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  Categories?: Maybe<Array<Maybe<Category>>>;
  Category?: Maybe<Category>;
  GetCategoryTotals?: Maybe<Array<CategoryTotal>>;
  GetMonthlyTotals?: Maybe<Array<MonthlyTotal>>;
  GetTransactionsPaginated: TransactionConnection;
  LastDate?: Maybe<Scalars['String']['output']>;
  Total?: Maybe<Scalars['Float']['output']>;
  Transaction?: Maybe<Transaction>;
  Transactions?: Maybe<Array<Maybe<Transaction>>>;
  Years?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
};


export type QueryCategoriesArgs = {
  range?: InputMaybe<RangeInput>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
  range?: InputMaybe<RangeInput>;
};


export type QueryGetCategoryTotalsArgs = {
  month?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  year: Scalars['Int']['input'];
};


export type QueryGetMonthlyTotalsArgs = {
  categoryID?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  year: Scalars['Int']['input'];
};


export type QueryGetTransactionsPaginatedArgs = {
  categoryID?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  year: Scalars['Int']['input'];
};


export type QueryTotalArgs = {
  range?: InputMaybe<RangeInput>;
};


export type QueryTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTransactionsArgs = {
  range?: InputMaybe<RangeInput>;
};

export type RangeInput = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Float']['output'];
  category: Category;
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isIncome: Scalars['Boolean']['output'];
  item: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type TransactionConnection = {
  __typename?: 'TransactionConnection';
  edges: Array<TransactionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TransactionEdge = {
  __typename?: 'TransactionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type TransactionInput = {
  amount: Scalars['Float']['input'];
  categoryID: Scalars['ID']['input'];
  date: Scalars['String']['input'];
  isIncome: Scalars['Boolean']['input'];
  item: Scalars['String']['input'];
};

export type UpdateTransactionInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  categoryID?: InputMaybe<Scalars['ID']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  isIncome?: InputMaybe<Scalars['Boolean']['input']>;
  item?: InputMaybe<Scalars['String']['input']>;
};

export type CreateTransactionMutationVariables = Exact<{
  input: TransactionInput;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction?: { __typename?: 'Transaction', id: string, item: string, date: string, amount: number, category: { __typename?: 'Category', id: string, name: string } } | null };

export type DeleteTransactionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTransactionMutation = { __typename?: 'Mutation', deleteTransaction?: { __typename?: 'Transaction', id: string, item: string, date: string, amount: number, category: { __typename?: 'Category', id: string, name: string } } | null };

export type GetCategoriesQueryVariables = Exact<{
  range?: InputMaybe<RangeInput>;
}>;


export type GetCategoriesQuery = { __typename?: 'Query', Categories?: Array<{ __typename?: 'Category', id: string, name: string } | null> | null };

export type GetCategoryTotalsQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  month?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCategoryTotalsQuery = { __typename?: 'Query', GetCategoryTotals?: Array<{ __typename?: 'CategoryTotal', category: string, total: number, count: number }> | null };

export type GetDaysDataQueryVariables = Exact<{
  range?: InputMaybe<RangeInput>;
}>;


export type GetDaysDataQuery = { __typename?: 'Query', Total?: number | null, Transactions?: Array<{ __typename?: 'Transaction', id: string, item: string, amount: number, date: string, category: { __typename?: 'Category', id: string, name: string } } | null> | null };

export type GetLastDateQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLastDateQuery = { __typename?: 'Query', LastDate?: string | null };

export type GetMonthlyTotalsQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  categoryID?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMonthlyTotalsQuery = { __typename?: 'Query', GetMonthlyTotals?: Array<{ __typename?: 'MonthlyTotal', month: number, total: number, count: number }> | null };

export type GetTransactionsPaginatedQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  month?: InputMaybe<Scalars['Int']['input']>;
  categoryID?: InputMaybe<Scalars['ID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTransactionsPaginatedQuery = { __typename?: 'Query', GetTransactionsPaginated: { __typename?: 'TransactionConnection', totalCount: number, edges: Array<{ __typename?: 'TransactionEdge', cursor: string, node: { __typename?: 'Transaction', id: string, item: string, amount: number, date: string, isIncome: boolean, userId: string, category: { __typename?: 'Category', id: string, name: string } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } };

export type GetYearsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetYearsQuery = { __typename?: 'Query', Years?: Array<number | null> | null };

export type UpdateTransactionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateTransactionInput;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', updateTransaction?: { __typename?: 'Transaction', id: string, item: string, amount: number, date: string, category: { __typename?: 'Category', id: string, name: string } } | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const CreateTransactionDocument = new TypedDocumentString(`
    mutation CreateTransaction($input: TransactionInput!) {
  createTransaction(input: $input) {
    id
    item
    date
    amount
    category {
      id
      name
    }
  }
}
    `) as unknown as TypedDocumentString<CreateTransactionMutation, CreateTransactionMutationVariables>;
export const DeleteTransactionDocument = new TypedDocumentString(`
    mutation DeleteTransaction($id: ID!) {
  deleteTransaction(id: $id) {
    id
    item
    date
    amount
    category {
      id
      name
    }
  }
}
    `) as unknown as TypedDocumentString<DeleteTransactionMutation, DeleteTransactionMutationVariables>;
export const GetCategoriesDocument = new TypedDocumentString(`
    query GetCategories($range: RangeInput) {
  Categories(range: $range) {
    id
    name
  }
}
    `) as unknown as TypedDocumentString<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetCategoryTotalsDocument = new TypedDocumentString(`
    query GetCategoryTotals($year: Int!, $month: Int, $search: String) {
  GetCategoryTotals(year: $year, month: $month, search: $search) {
    category
    total
    count
  }
}
    `) as unknown as TypedDocumentString<GetCategoryTotalsQuery, GetCategoryTotalsQueryVariables>;
export const GetDaysDataDocument = new TypedDocumentString(`
    query GetDaysData($range: RangeInput) {
  Transactions(range: $range) {
    id
    item
    amount
    date
    category {
      id
      name
    }
  }
  Total(range: $range)
}
    `) as unknown as TypedDocumentString<GetDaysDataQuery, GetDaysDataQueryVariables>;
export const GetLastDateDocument = new TypedDocumentString(`
    query GetLastDate {
  LastDate
}
    `) as unknown as TypedDocumentString<GetLastDateQuery, GetLastDateQueryVariables>;
export const GetMonthlyTotalsDocument = new TypedDocumentString(`
    query GetMonthlyTotals($year: Int!, $categoryID: ID, $search: String) {
  GetMonthlyTotals(year: $year, categoryID: $categoryID, search: $search) {
    month
    total
    count
  }
}
    `) as unknown as TypedDocumentString<GetMonthlyTotalsQuery, GetMonthlyTotalsQueryVariables>;
export const GetTransactionsPaginatedDocument = new TypedDocumentString(`
    query GetTransactionsPaginated($year: Int!, $month: Int, $categoryID: ID, $page: Int, $limit: Int, $search: String, $sort: String) {
  GetTransactionsPaginated(
    year: $year
    month: $month
    categoryID: $categoryID
    page: $page
    limit: $limit
    search: $search
    sort: $sort
  ) {
    edges {
      node {
        id
        item
        category {
          id
          name
        }
        amount
        date
        isIncome
        userId
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
    `) as unknown as TypedDocumentString<GetTransactionsPaginatedQuery, GetTransactionsPaginatedQueryVariables>;
export const GetYearsDocument = new TypedDocumentString(`
    query GetYears {
  Years
}
    `) as unknown as TypedDocumentString<GetYearsQuery, GetYearsQueryVariables>;
export const UpdateTransactionDocument = new TypedDocumentString(`
    mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
  updateTransaction(id: $id, input: $input) {
    id
    item
    category {
      id
      name
    }
    amount
    date
  }
}
    `) as unknown as TypedDocumentString<UpdateTransactionMutation, UpdateTransactionMutationVariables>;