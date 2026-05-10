import {
	GetCategoriesDocument,
	GetCategoriesQuery,
	GetCategoryTotalsDocument,
	GetCategoryTotalsQuery,
	GetCategoryTotalsQueryVariables,
	GetDaysDataDocument,
	GetDaysDataQuery,
	GetDaysDataQueryVariables,
	GetLastDateDocument,
	GetLastDateQuery,
	GetMonthlyTotalsDocument,
	GetMonthlyTotalsQuery,
	GetMonthlyTotalsQueryVariables,
	GetTransactionsPaginatedDocument,
	GetTransactionsPaginatedQuery,
	GetTransactionsPaginatedQueryVariables,
	GetYearsDocument,
	GetYearsQuery,
} from "@/graphql/generated/graphql";
import { fetcher } from "@/lib/data/fetcher";
import { dateTag, lastDateTag, yearsTag, yearTag } from "@/lib/data/tags";

export interface FetchOptions {
	userId: string;
	accessToken: string;
	cacheKey?: string;
}

export const getCategoriesList = async (params: FetchOptions) => {
	const { accessToken, cacheKey } = params;
	const { Categories } = await fetcher<GetCategoriesQuery>(
		GetCategoriesDocument.toString(),
		undefined,
		cacheKey,
		accessToken,
	);
	return Categories ? Categories.filter((c) => c !== null) : [];
};

export const getCategoryTotals = async (
	params: GetCategoryTotalsQueryVariables & FetchOptions,
) => {
	const { userId, accessToken, cacheKey, ...variables } = params;
	const { year } = variables;
	const key = cacheKey ?? yearTag(userId, year);
	const { GetCategoryTotals } = await fetcher<GetCategoryTotalsQuery>(
		GetCategoryTotalsDocument.toString(),
		variables,
		key,
		accessToken,
	);
	return GetCategoryTotals;
};
export const getDaysData = async (params: { date: string } & FetchOptions) => {
	const { date, userId, accessToken, cacheKey } = params;
	const variables: GetDaysDataQueryVariables = {
		range: { startDate: date, endDate: date },
	};
	const key = cacheKey ?? dateTag(userId, date);
	const { Transactions, Total }: GetDaysDataQuery = await fetcher(
		GetDaysDataDocument.toString(),
		variables,
		key,
		accessToken,
	);
	return { Transactions, Total };
};

export const getLastDate = async (params: FetchOptions) => {
	const { accessToken, cacheKey, userId } = params;
	const key = cacheKey ?? lastDateTag(userId);
	const { LastDate }: GetLastDateQuery = await fetcher(
		GetLastDateDocument.toString(),
		undefined,
		key,
		accessToken,
	);

	return LastDate;
};

export const getMonthlyTotals = async (
	params: GetMonthlyTotalsQueryVariables & FetchOptions,
) => {
	const { userId, accessToken, cacheKey, ...variables } = params;
	const { year } = variables;
	const key = cacheKey ?? yearTag(userId, year);
	const { GetMonthlyTotals } = await fetcher<GetMonthlyTotalsQuery>(
		GetMonthlyTotalsDocument.toString(),
		variables,
		key,
		accessToken,
	);
	return GetMonthlyTotals;
};

export const getTransactionsPaginated = async (
	params: GetTransactionsPaginatedQueryVariables & FetchOptions,
) => {
	const { cacheKey, userId, accessToken, ...variables } = params;
	const { year } = variables;
	const key = cacheKey ?? yearTag(userId, year);
	const { GetTransactionsPaginated } =
		await fetcher<GetTransactionsPaginatedQuery>(
			GetTransactionsPaginatedDocument.toString(),
			variables,
			key,
			accessToken,
		);
	return GetTransactionsPaginated;
};

export const getYearsList = async (params: FetchOptions) => {
	const { accessToken, cacheKey, userId } = params;
	const key = cacheKey ?? yearsTag(userId);
	const { Years } = await fetcher<GetYearsQuery>(
		GetYearsDocument.toString(),
		undefined,
		key,
		accessToken,
	);
	return Years;
};
