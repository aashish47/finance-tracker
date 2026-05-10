import { UrlFetchProps } from "@/app/page";
import PieGraph, {
	CategoryTotalsForPie,
} from "@/components/dashboard/PieGraph";
import { CategoryTotal } from "@/graphql/generated/graphql";
import { getCategoriesList, getCategoryTotals } from "@/lib/data/queries";
import { Suspense } from "react";

async function PieGraphContent(props: UrlFetchProps) {
	const { month, ...rest } = props;
	const { category } = props;
	const monthParam = month !== undefined ? month + 1 : undefined;

	const [Categories, categoryTotals] = await Promise.all([
		getCategoriesList({ ...props }),
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
			{...props}
		/>
	);
}

export default function PieGraphWrapper(props: UrlFetchProps) {
	return (
		<Suspense
			fallback={
				<div className="bg-muted h-full w-full animate-pulse rounded-lg" />
			}
		>
			<PieGraphContent {...props} />
		</Suspense>
	);
}
