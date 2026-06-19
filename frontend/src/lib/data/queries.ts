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
import { getUser } from "@/lib/auth";
import { fetcher } from "@/lib/data/fetcher";
import { dateTag, lastDateTag, yearsTag, yearTag } from "@/lib/data/tags";

export const getCategoriesList = async () => {
	const { Categories } = await fetcher<GetCategoriesQuery>(
		GetCategoriesDocument.toString(),
		undefined,
		undefined,
	);
	return Categories ? Categories.filter((c) => c !== null) : [];
};

export const getCategoryTotals = async (
	variables: GetCategoryTotalsQueryVariables,
) => {
	const { id } = await getUser();
	const { year } = variables;
	const key = yearTag(id, year);
	const { GetCategoryTotals } = await fetcher<GetCategoryTotalsQuery>(
		GetCategoryTotalsDocument.toString(),
		variables,
		key,
	);
	return GetCategoryTotals;
};
export const getDaysData = async (date: string) => {
	const { id } = await getUser();
	const variables: GetDaysDataQueryVariables = {
		range: { startDate: date, endDate: date },
	};
	const key = dateTag(id, date);
	const { Transactions, Total }: GetDaysDataQuery = await fetcher(
		GetDaysDataDocument.toString(),
		variables,
		key,
	);
	return { Transactions, Total };
};

export const getLastDate = async () => {
	const { id } = await getUser();
	const key = lastDateTag(id);
	const { LastDate }: GetLastDateQuery = await fetcher(
		GetLastDateDocument.toString(),
		undefined,
		key,
	);

	return LastDate;
};

export const getMonthlyTotals = async (
	variables: GetMonthlyTotalsQueryVariables,
) => {
	const { id } = await getUser();
	const { year } = variables;
	const key = yearTag(id, year);
	const { GetMonthlyTotals } = await fetcher<GetMonthlyTotalsQuery>(
		GetMonthlyTotalsDocument.toString(),
		variables,
		key,
	);
	return GetMonthlyTotals;
};

export const getTransactionsPaginated = async (
	variables: GetTransactionsPaginatedQueryVariables,
) => {
	const { id } = await getUser();
	const { year } = variables;
	const key = yearTag(id, year);
	const { GetTransactionsPaginated } =
		await fetcher<GetTransactionsPaginatedQuery>(
			GetTransactionsPaginatedDocument.toString(),
			variables,
			key,
		);
	return GetTransactionsPaginated;
};

export const getYearsList = async () => {
	const { id } = await getUser();
	const key = yearsTag(id);
	const { Years } = await fetcher<GetYearsQuery>(
		GetYearsDocument.toString(),
		undefined,
		key,
	);
	return Years;
};
