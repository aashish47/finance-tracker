import TransactionForm, {
	TransactionFormValues,
} from "@/components/dashboard/TransactionForm";
import { Query, Transaction } from "@/graphql/generated/graphql";
import { PropsWithChildren } from "react";

interface EditFormProps extends PropsWithChildren {
	transaction: Transaction;
	handleSubmit: (data: TransactionFormValues) => Promise<void>;
	categories: Query["Categories"];
}

const EditForm = ({
	transaction,
	handleSubmit,
	categories,
	children,
}: EditFormProps) => {
	return (
		<TransactionForm
			mode="edit"
			transaction={transaction}
			categories={categories}
			onSubmit={handleSubmit}
			showWrapper={false}
		>
			{children}
		</TransactionForm>
	);
};

export default EditForm;
