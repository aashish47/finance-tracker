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

export type MonthSummary = {
  __typename?: 'MonthSummary';
  categories?: Maybe<Array<Maybe<Category>>>;
  month: Scalars['Int']['output'];
  total?: Maybe<Scalars['Float']['output']>;
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

export type Query = {
  __typename?: 'Query';
  Categories?: Maybe<Array<Maybe<Category>>>;
  Category?: Maybe<Category>;
  LastDate?: Maybe<Scalars['String']['output']>;
  Total?: Maybe<Scalars['Float']['output']>;
  Transaction?: Maybe<Transaction>;
  Transactions?: Maybe<Array<Maybe<Transaction>>>;
  TransactionsByMonth?: Maybe<Array<Maybe<MonthSummary>>>;
  Years?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
};


export type QueryCategoriesArgs = {
  range?: InputMaybe<RangeInput>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
  range?: InputMaybe<RangeInput>;
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


export type QueryTransactionsByMonthArgs = {
  year: Scalars['Int']['input'];
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

export type GetDaysDataQueryVariables = Exact<{
  range?: InputMaybe<RangeInput>;
}>;


export type GetDaysDataQuery = { __typename?: 'Query', Total?: number | null, Transactions?: Array<{ __typename?: 'Transaction', id: string, item: string, amount: number, date: string, category: { __typename?: 'Category', id: string, name: string } } | null> | null };

export type GetLastDateQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLastDateQuery = { __typename?: 'Query', LastDate?: string | null };

export type GetTransactionsQueryVariables = Exact<{
  range?: InputMaybe<RangeInput>;
}>;


export type GetTransactionsQuery = { __typename?: 'Query', Transactions?: Array<{ __typename?: 'Transaction', id: string, item: string, date: string, amount: number, category: { __typename?: 'Category', id: string, name: string } } | null> | null };

export type GetTransactionsByMonthQueryVariables = Exact<{
  year: Scalars['Int']['input'];
}>;


export type GetTransactionsByMonthQuery = { __typename?: 'Query', TransactionsByMonth?: Array<{ __typename?: 'MonthSummary', total?: number | null, categories?: Array<{ __typename?: 'Category', id: string, name: string, total?: number | null, transactions?: Array<{ __typename?: 'Transaction', id: string, item: string, date: string, amount: number, category: { __typename?: 'Category', id: string, name: string } } | null> | null } | null> | null } | null> | null };

export type GetYearlyDataQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  range?: InputMaybe<RangeInput>;
}>;


export type GetYearlyDataQuery = { __typename?: 'Query', Years?: Array<number | null> | null, TransactionsByMonth?: Array<{ __typename?: 'MonthSummary', total?: number | null, categories?: Array<{ __typename?: 'Category', total?: number | null, name: string, transactions?: Array<{ __typename?: 'Transaction', id: string, item: string, amount: number, date: string, category: { __typename?: 'Category', id: string, name: string } } | null> | null } | null> | null } | null> | null, Categories?: Array<{ __typename?: 'Category', id: string, name: string, total?: number | null } | null> | null };

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
export const GetTransactionsDocument = new TypedDocumentString(`
    query GetTransactions($range: RangeInput) {
  Transactions(range: $range) {
    id
    item
    category {
      id
      name
    }
    date
    amount
  }
}
    `) as unknown as TypedDocumentString<GetTransactionsQuery, GetTransactionsQueryVariables>;
export const GetTransactionsByMonthDocument = new TypedDocumentString(`
    query GetTransactionsByMonth($year: Int!) {
  TransactionsByMonth(year: $year) {
    categories {
      id
      name
      transactions {
        id
        item
        date
        amount
        category {
          id
          name
        }
      }
      total
    }
    total
  }
}
    `) as unknown as TypedDocumentString<GetTransactionsByMonthQuery, GetTransactionsByMonthQueryVariables>;
export const GetYearlyDataDocument = new TypedDocumentString(`
    query GetYearlyData($year: Int!, $range: RangeInput) {
  TransactionsByMonth(year: $year) {
    total
    categories {
      total
      name
      transactions {
        id
        item
        amount
        date
        category {
          id
          name
        }
      }
    }
  }
  Categories(range: $range) {
    id
    name
    total(range: $range)
  }
  Years
}
    `) as unknown as TypedDocumentString<GetYearlyDataQuery, GetYearlyDataQueryVariables>;
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