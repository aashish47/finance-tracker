import { UrlFetchProps } from "@/app/page";
import { DataTable } from "@/components/dashboard/transactions/DataTable";
import {
	getCategoriesList,
	getTransactionsPaginated,
} from "@/lib/data/queries";
import { Suspense } from "react";

async function DataTableContent(props: UrlFetchProps) {
	const { month, category, ...rest } = props;
	const monthParam = month !== undefined ? month + 1 : undefined;

	const Categories = await getCategoriesList({ ...props });
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
			{...props}
		/>
	);
}

export default function DataTableWrapper(props: UrlFetchProps) {
	return (
		<Suspense
			fallback={
				<div className="bg-muted h-full w-full animate-pulse rounded-lg" />
			}
		>
			<DataTableContent {...props} />
		</Suspense>
	);
}
