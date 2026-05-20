import BarGraph from "@/components/dashboard/BarGraph";
import { getSession, getUser } from "@/lib/auth";
import { parseSearchParamsWithDefaults } from "@/lib/data/parseSearchParamsHelper";
import { getCategoriesList, getMonthlyTotals } from "@/lib/data/queries";
import { SearchParamsType, UrlFetchProps } from "@/types/types";
import { format } from "date-fns";
import { Suspense } from "react";

const BarGraphContent: React.FC<SearchParamsType> = async ({
	searchParams,
}) => {
	const [user, session] = await Promise.all([getUser(), getSession()]);
	const fetchOptions = { userId: user.id, accessToken: session.access_token };

	const urlProps = await parseSearchParamsWithDefaults(
		searchParams,
		fetchOptions,
	);

	const urlFetchProps: UrlFetchProps = { ...urlProps, ...fetchOptions };
	const { category, ...rest } = urlFetchProps;

	const Categories = await getCategoriesList({ ...urlFetchProps });
	const categoryID = Categories?.find((c) => c?.name === category)?.id;
	const monthlyTotals = await getMonthlyTotals({
		categoryID,
		...rest,
	});

	const monthly = (monthlyTotals || []).map((m, index: number) => ({
		month: format(new Date(1990, index, 1), "MMMM"),
		amount: m.total ?? 0,
	}));

	return <BarGraph monthlySummary={monthly} {...urlFetchProps} />;
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
