import { CategoryTotalsForPie } from "@/components/dashboard/PieGraph";
import {
	CategoryTotal,
	GetDaysDataQuery,
	GetTransactionsPaginatedQuery,
	Query,
} from "@/graphql/generated/graphql";
import {
	getCategoriesList,
	getCategoryTotals,
	getDaysData,
	getMonthlyTotals,
	getTransactionsPaginated,
	getYearsList,
} from "@/lib/data/queries";
import { UrlProps } from "@/utils/buildUrl";
import { format } from "date-fns";

export type DashboardPayload = {
	Categories: Query["Categories"];
	Years: Query["Years"];
	categoryTotalsForPie: CategoryTotalsForPie[];
	monthly: { month: string; amount: number }[];
	transactionConnection: GetTransactionsPaginatedQuery["GetTransactionsPaginated"];
	total: number;
	categoryID?: string | number | undefined;
	dailyTotal: GetDaysDataQuery["Total"];
	dailyTransactions: GetDaysDataQuery["Transactions"];
};

export async function gatherDashboardData(
	props: UrlProps & {
		userId: string;
		accessToken: string;
	},
): Promise<DashboardPayload> {
	const {
		year,
		month,
		category,
		date,
		page,
		limit,
		search,
		sort,
		...fetchOptions
	} = props;
	const monthParam = month !== undefined ? month + 1 : undefined; // convert to one-based index for API

	const [Categories, Years] = await Promise.all([
		getCategoriesList({ ...fetchOptions }),
		getYearsList({ ...fetchOptions }),
	]);

	const categoryID = Categories?.find((c) => c?.name === category)?.id;

	const [categoryTotals, monthlyTotals, transactionsConn] = await Promise.all([
		getCategoryTotals({ year, month: monthParam, search, ...fetchOptions }),
		getMonthlyTotals({ year, categoryID, search, ...fetchOptions }),
		getTransactionsPaginated({
			year,
			month: monthParam,
			categoryID,
			page,
			limit,
			search,
			sort,
			...fetchOptions,
		}),
	]);

	const categoryTotalsMap = (categoryTotals || []).reduce(
		(acc, cur) => {
			acc[cur.category] = cur;
			return acc;
		},
		{} as Record<string, CategoryTotal>,
	);

	const categoryTotalsForPie = Categories.map((category) => ({
		category: category.name,
		amount: categoryTotalsMap[category.name]?.total,
		fill: `var(--color-${category?.name})`,
	}));

	let total = 0;
	if (monthParam && category) {
		total = categoryTotalsMap[category]?.total ?? 0;
	} else if (monthParam) {
		total = (monthlyTotals && monthlyTotals[monthParam - 1]?.total) ?? 0;
	} else if (category) {
		total = categoryTotalsMap[category]?.total ?? 0;
	} else {
		total = (monthlyTotals || []).reduce(
			(acc: number, m) => acc + (m.total ?? 0),
			0,
		);
	}

	const monthly = (monthlyTotals || []).map((m, index: number) => ({
		month: format(new Date(1990, index, 1), "MMMM"),
		amount: m.total ?? 0,
	}));

	const daysData =
		date !== undefined
			? await getDaysData({
					date: format(new Date(date), "yyyy-MM-dd"),
					...fetchOptions,
				})
			: await getDaysData({
					date: format(new Date(), "yyyy-MM-dd"),
					...fetchOptions,
				});
	const { Total: dailyTotal, Transactions: dailyTransactions } = daysData;

	return {
		Categories,
		Years,
		categoryTotalsForPie,
		monthly,
		transactionConnection: transactionsConn,
		total,
		categoryID,
		dailyTotal,
		dailyTransactions,
	};
}
