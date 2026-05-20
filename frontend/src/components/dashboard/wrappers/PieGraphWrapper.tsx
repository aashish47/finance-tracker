import PieGraph, {
	CategoryTotalsForPie,
} from "@/components/dashboard/PieGraph";
import { CategoryTotal } from "@/graphql/generated/graphql";
import { getSession, getUser } from "@/lib/auth";
import { parseSearchParamsWithDefaults } from "@/lib/data/parseSearchParamsHelper";
import { getCategoriesList, getCategoryTotals } from "@/lib/data/queries";
import { SearchParamsType, UrlFetchProps } from "@/types/types";
import { Suspense } from "react";

const PieGraphContent: React.FC<SearchParamsType> = async ({
	searchParams,
}) => {
	const [user, session] = await Promise.all([getUser(), getSession()]);
	const fetchOptions = { userId: user.id, accessToken: session.access_token };

	const urlProps = await parseSearchParamsWithDefaults(
		searchParams,
		fetchOptions,
	);

	const urlFetchProps: UrlFetchProps = { ...urlProps, ...fetchOptions };
	const { month, ...rest } = urlFetchProps;
	const { category } = urlFetchProps;
	const monthParam = month !== undefined ? month + 1 : undefined;

	const [Categories, categoryTotals] = await Promise.all([
		getCategoriesList({ ...urlFetchProps }),
		getCategoryTotals({
			month: monthParam,
			...rest,
		}),
	]);

	const categoryID = Categories?.find((c) => c?.name === category)?.id;

	const categoryTotalsMap = (categoryTotals || []).reduce(
		(acc, cur) => {
			acc[cur.category] = cur;
			return acc;
		},
		{} as Record<string, CategoryTotal>,
	);

	const categoryTotalsForPie: CategoryTotalsForPie[] = Categories.map((c) => ({
		category: c.name,
		amount: categoryTotalsMap[c.name]?.total,
		fill: `var(--color-${c?.name})`,
	}));

	let total = 0;
	if (category) {
		total = categoryTotalsMap[category]?.total ?? 0;
	} else if (categoryTotals) {
		total = categoryTotals.reduce((acc, category) => category.total + acc, 0);
	}

	const activeIndex = categoryID ? Number(categoryID) - 1 : -1;

	return (
		<PieGraph
			data={categoryTotalsForPie}
			total={total}
			activeIndex={activeIndex}
			{...urlFetchProps}
		/>
	);
};
const PieGraphWrapper: React.FC<SearchParamsType> = ({ searchParams }) => {
	return (
		<Suspense
			fallback={
				<div className="bg-muted h-full w-full animate-pulse rounded-lg" />
			}
		>
			<PieGraphContent searchParams={searchParams} />
		</Suspense>
	);
};

export default PieGraphWrapper;
