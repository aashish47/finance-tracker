import FormButton from "@/components/dashboard/form/FormButton";
import FormContent from "@/components/dashboard/form/FormContent";
import { TransactionFormValues } from "@/components/dashboard/TransactionForm";
import EditForm from "@/components/dashboard/transactions/EditForm";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Query, Transaction } from "@/graphql/generated/graphql";
import {
	deleteTransaction,
	updateTransactions,
} from "@/lib/actions/transaction-actions";
import { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CellProps<TData> {
	row: Row<TData>;
	categories: Query["Categories"];
}

const Cell = <TData,>({ row, categories }: CellProps<TData>) => {
	const transaction = row.original as Transaction;

	enum Dialogs {
		edit = "edit",
		delete = "delete",
	}

	const [dialog, setDialog] = useState<Dialogs>();

	const handleEditSubmit = async (data: TransactionFormValues) => {
		await updateTransactions(
			{
				id: transaction.id,
				input: {
					item: data.item,
					categoryID: data.categoryID,
					amount: Number(data.amount),
					date: format(data.date, "yyyy-MM-dd"),
				},
			},
			transaction.date,
		);
	};

	const handleDeleteSubmit = async () => {
		await deleteTransaction({
			id: transaction.id,
		});
		toast.success("Transaction deleted successfully", {
			description: format(new Date(), "PPPPpp"),
		});
	};
	return (
		<Dialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-6 w-6 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-3 w-3" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() =>
							navigator.clipboard.writeText(transaction.id.toString())
						}
					>
						Copy transaction ID
					</DropdownMenuItem>
					<DropdownMenuSeparator />

					<DialogTrigger asChild onClick={() => setDialog(Dialogs.edit)}>
						<DropdownMenuItem>Edit</DropdownMenuItem>
					</DialogTrigger>

					<DialogTrigger asChild onClick={() => setDialog(Dialogs.delete)}>
						<DropdownMenuItem>Delete</DropdownMenuItem>
					</DialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			{dialog === Dialogs.edit ? (
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit transaction</DialogTitle>
						<DialogDescription>
							Make changes to your transaction here. Click update when
							you&apos;re done.
						</DialogDescription>
					</DialogHeader>
					<EditForm
						transaction={transaction}
						handleSubmit={handleEditSubmit}
						categories={categories}
					>
						<DialogFooter>
							<FormButton formType="update" type="submit" />
						</DialogFooter>
					</EditForm>
				</DialogContent>
			) : (
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. Are you sure you want to permanently
							delete this file from our servers?
						</DialogDescription>
					</DialogHeader>
					<form
						action={async () => {
							await handleDeleteSubmit();
						}}
					>
						<FormContent>
							<DialogFooter>
								<FormButton formType="delete" label="Delete" type="submit" />
							</DialogFooter>
						</FormContent>
					</form>
				</DialogContent>
			)}
		</Dialog>
	);
};

export default Cell;
