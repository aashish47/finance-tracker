import DayData from "@/components/dashboard/DayData";
import { parseSearchParamsWithDefaults } from "@/lib/data/parseSearchParamsHelper";
import { getDaysData } from "@/lib/data/queries";
import { SearchParamsType } from "@/types/types";
import { format } from "date-fns";
import { Suspense } from "react";

const DayDataContent: React.FC<SearchParamsType> = async ({ searchParams }) => {
	const urlProps = await parseSearchParamsWithDefaults(searchParams);
	const { date } = urlProps;

	const { Total, Transactions } = await getDaysData(
		date
			? format(new Date(date), "yyyy-MM-dd")
			: format(new Date(), "yyyy-MM-dd"),
	);

	return (
		<DayData
			dailyTotal={Total}
			dailyTransactions={Transactions}
			{...urlProps}
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
