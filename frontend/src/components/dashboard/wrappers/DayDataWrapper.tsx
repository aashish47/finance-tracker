import DayData from "@/components/dashboard/DayData";
import { getSession, getUser } from "@/lib/auth";
import { parseSearchParamsWithDefaults } from "@/lib/data/parseSearchParamsHelper";
import { getDaysData } from "@/lib/data/queries";
import { SearchParamsType, UrlFetchProps } from "@/types/types";
import { format } from "date-fns";
import { Suspense } from "react";

const DayDataContent: React.FC<SearchParamsType> = async ({ searchParams }) => {
	const [user, session] = await Promise.all([getUser(), getSession()]);
	const fetchOptions = { userId: user.id, accessToken: session.access_token };

	const urlProps = await parseSearchParamsWithDefaults(
		searchParams,
		fetchOptions,
	);

	const urlFetchProps: UrlFetchProps = { ...urlProps, ...fetchOptions };

	const { date, ...rest } = urlFetchProps;

	const daysData = await getDaysData({
		date: date
			? format(new Date(date), "yyyy-MM-dd")
			: format(new Date(), "yyyy-MM-dd"),
		...rest,
	});

	const { Total: dailyTotal, Transactions: dailyTransactions } = daysData;

	return (
		<DayData
			dailyTotal={dailyTotal}
			dailyTransactions={dailyTransactions}
			{...urlFetchProps}
		/>
	);
};

const DayDataWrapper: React.FC<SearchParamsType> = ({ searchParams }) => {
	return (
		<Suspense
			fallback={
				<div className="bg-muted h-full w-full animate-pulse rounded-lg" />
			}
		>
			<DayDataContent searchParams={searchParams} />
		</Suspense>
	);
};

export default DayDataWrapper;
