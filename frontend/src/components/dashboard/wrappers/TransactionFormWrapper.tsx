import { UrlFetchProps } from "@/app/page";
import TransactionForm from "@/components/dashboard/TransactionForm";
import { getCategoriesList } from "@/lib/data/queries";
import { Suspense } from "react";

async function TransactionFormContent(props: UrlFetchProps) {
	const Categories = await getCategoriesList({ ...props });
	return <TransactionForm categories={Categories} />;
}

export default function TransactionFormWrapper(props: UrlFetchProps) {
	return (
		<Suspense
			fallback={
				<div className="bg-muted h-full w-full animate-pulse rounded-lg" />
			}
		>
			<TransactionFormContent {...props} />
		</Suspense>
	);
}
