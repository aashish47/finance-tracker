import { DataTable } from "@/components/dashboard/transactions/DataTable";
import { parseSearchParamsWithDefaults } from "@/lib/data/parseSearchParamsHelper";
import {
	getCategoriesList,
	getTransactionsPaginated,
} from "@/lib/data/queries";
import { SearchParamsType } from "@/types/types";
import { Suspense } from "react";

const DataTableContent: React.FC<SearchParamsType> = async ({
	searchParams,
}) => {
	const [urlProps, Categories] = await Promise.all([
		parseSearchParamsWithDefaults(searchParams),
		getCategoriesList(),
	]);

	const { month, category, ...rest } = urlProps;
	const monthParam = month !== undefined ? month + 1 : undefined;
	const categoryID = Categories?.find((c) => c?.name === category)?.id;

	const transactionsConn = await getTransactionsPaginated({
		month: monthParam,
		categoryID,
		...rest,
	});

	return (
		<DataTable
			categories={Categories}
			transactionConnection={transactionsConn}
			{...urlProps}
		/>
	);
};

const DataTableWrapper: React.FC<SearchParamsType> = ({ searchParams }) => {
	return (
		<Suspense
			fallback={
				<div className="bg-muted h-full w-full animate-pulse rounded-lg" />
			}
		>
			<DataTableContent searchParams={searchParams} />
		</Suspense>
	);
};

export default DataTableWrapper;
