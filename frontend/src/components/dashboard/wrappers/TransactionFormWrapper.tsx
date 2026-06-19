import TransactionForm from "@/components/dashboard/TransactionForm";
import { getCategoriesList } from "@/lib/data/queries";
import { SearchParamsType } from "@/types/types";
import { Suspense } from "react";

const TransactionFormContent = async () => {
	const Categories = await getCategoriesList();
	return <TransactionForm categories={Categories} />;
};

const TransactionFormWrapper: React.FC<SearchParamsType> = () => {
	return (
		<Suspense
			fallback={
				<div className="bg-muted h-full w-full animate-pulse rounded-lg" />
			}
		>
			<TransactionFormContent />
		</Suspense>
	);
};

export default TransactionFormWrapper;
