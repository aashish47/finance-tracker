import { DataTable } from "@/components/dashboard/transactions/DataTable";
import { getSession, getUser } from "@/lib/auth";
import { parseSearchParamsWithDefaults } from "@/lib/data/parseSearchParamsHelper";
import {
	getCategoriesList,
	getTransactionsPaginated,
} from "@/lib/data/queries";
import { SearchParamsType, UrlFetchProps } from "@/types/types";
import { Suspense } from "react";

const DataTableContent: React.FC<SearchParamsType> = async ({
	searchParams,
}) => {
	const [user, session] = await Promise.all([getUser(), getSession()]);
	const fetchOptions = { userId: user.id, accessToken: session.access_token };

	const urlProps = await parseSearchParamsWithDefaults(
		searchParams,
		fetchOptions,
	);

	const urlFetchProps: UrlFetchProps = { ...urlProps, ...fetchOptions };

	const { month, category, ...rest } = urlFetchProps;
	const monthParam = month !== undefined ? month + 1 : undefined;

	const Categories = await getCategoriesList({ ...urlFetchProps });
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
			{...urlFetchProps}
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
