import TransactionForm from "@/components/dashboard/TransactionForm";
import { getSession, getUser } from "@/lib/auth";
import { parseSearchParamsWithDefaults } from "@/lib/data/parseSearchParamsHelper";
import { getCategoriesList } from "@/lib/data/queries";
import { SearchParamsType, UrlFetchProps } from "@/types/types";
import { Suspense } from "react";

const TransactionFormContent: React.FC<SearchParamsType> = async ({
	searchParams,
}) => {
	const [user, session] = await Promise.all([getUser(), getSession()]);
	const fetchOptions = { userId: user.id, accessToken: session.access_token };

	const urlProps = await parseSearchParamsWithDefaults(
		searchParams,
		fetchOptions,
	);

	const urlFetchProps: UrlFetchProps = { ...urlProps, ...fetchOptions };

	const Categories = await getCategoriesList({ ...urlFetchProps });
	return <TransactionForm categories={Categories} />;
};

const TransactionFormWrapper: React.FC<SearchParamsType> = ({
	searchParams,
}) => {
	return (
		<Suspense
			fallback={
				<div className="bg-muted h-full w-full animate-pulse rounded-lg" />
			}
		>
			<TransactionFormContent searchParams={searchParams} />
		</Suspense>
	);
};

export default TransactionFormWrapper;
