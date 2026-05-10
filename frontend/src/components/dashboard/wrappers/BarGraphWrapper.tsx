import { UrlFetchProps } from "@/app/page";
import BarGraph from "@/components/dashboard/BarGraph";
import { getCategoriesList, getMonthlyTotals } from "@/lib/data/queries";
import { format } from "date-fns";
import { Suspense } from "react";

async function BarGraphContent(props: UrlFetchProps) {
	const { category, ...rest } = props;

	const Categories = await getCategoriesList({ ...props });
	const categoryID = Categories?.find((c) => c?.name === category)?.id;
	const monthlyTotals = await getMonthlyTotals({
		categoryID,
		...rest,
	});

	const monthly = (monthlyTotals || []).map((m, index: number) => ({
		month: format(new Date(1990, index, 1), "MMMM"),
		amount: m.total ?? 0,
	}));

	return <BarGraph monthlySummary={monthly} {...props} />;
}

export default function BarGraphWrapper(props: UrlFetchProps) {
	return (
		<Suspense
			fallback={
				<div className="bg-muted h-full w-full animate-pulse rounded-lg" />
			}
		>
			<BarGraphContent {...props} />
		</Suspense>
	);
}
