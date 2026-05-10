import { UrlFetchProps } from "@/app/page";
import DayData from "@/components/dashboard/DayData";
import { getDaysData } from "@/lib/data/queries";
import { format } from "date-fns";
import { Suspense } from "react";

async function DayDataContent(props: UrlFetchProps) {
	const { date, ...rest } = props;

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
			{...props}
		/>
	);
}

export default function DayDataWrapper(props: UrlFetchProps) {
	return (
		<Suspense
			fallback={
				<div className="bg-muted h-full w-full animate-pulse rounded-lg" />
			}
		>
			<DayDataContent {...props} />
		</Suspense>
	);
}
