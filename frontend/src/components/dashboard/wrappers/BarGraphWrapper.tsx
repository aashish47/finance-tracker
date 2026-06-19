import BarGraph from "@/components/dashboard/BarGraph";
import { parseSearchParamsWithDefaults } from "@/lib/data/parseSearchParamsHelper";
import { getCategoriesList, getMonthlyTotals } from "@/lib/data/queries";
import { SearchParamsType } from "@/types/types";
import { format } from "date-fns";
import { Suspense } from "react";

const BarGraphContent: React.FC<SearchParamsType> = async ({
	searchParams,
}) => {
	const [urlProps, Categories] = await Promise.all([
		parseSearchParamsWithDefaults(searchParams),
		getCategoriesList(),
	]);

	const { category, ...rest } = urlProps;
	const categoryID = Categories?.find((c) => c?.name === category)?.id;

	const monthlyTotals = await getMonthlyTotals({
		categoryID,
		...rest,
	});

	const monthly = (monthlyTotals || []).map((m, index: number) => ({
		month: format(new Date(1990, index, 1), "MMMM"),
		amount: m.total ?? 0,
	}));

	return <BarGraph monthlySummary={monthly} {...urlProps} />;
};

const BarGraphWrapper: React.FC<SearchParamsType> = ({ searchParams }) => {
	return (
		<Suspense
			fallback={
				<div className="bg-muted h-full w-full animate-pulse rounded-lg" />
			}
		>
			<BarGraphContent searchParams={searchParams} />
		</Suspense>
	);
};

export default BarGraphWrapper;
