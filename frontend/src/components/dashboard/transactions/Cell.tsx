"use client";

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
import { deleteTransaction, updateTransactions } from "@/lib/actions";
import { Category, Transaction } from "@/types/types";
import { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface CellProps<TData> {
	row: Row<TData>;
	categories: Category[];
}

const Cell = <TData,>({ row, categories }: CellProps<TData>) => {
	const transaction = row.original as Transaction;

	const handleSubmit = async (data: {
		item: string;
		category: string;
		amount: number;
		date: Date;
	}) => {
		setUpdateLoading(true);
		const { error } = await updateTransactions(
			{
				id: transaction.id,
				input: {
					item: data.item,
					categoryID: data.category,
					amount: Number(data.amount),
					date: format(data.date, "yyyy-MM-dd"),
				},
			},
			transaction.date,
		);
		setUpdateLoading(false);
		setUpdateError(error);
	};

	enum Dialogs {
		edit = "edit",
		delete = "delete",
	}

	const [dialog, setDialog] = useState<Dialogs>();
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [deleteError, setDeleteError] = useState<null | string>(null);
	const [updateLoading, setUpdateLoading] = useState(false);
	const [updateError, setUpdateError] = useState<null | string>(null);

	if (deleteLoading) return "Deleting...";
	if (deleteError) return deleteError;
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
						{...transaction}
						handleSubmit={handleSubmit}
						categories={categories}
					>
						<DialogFooter>
							<Button type="submit" disabled={updateLoading}>
								{updateError ? "Updating..." : "Update"}
							</Button>
							{updateError && (
								<p className="text-red-500">{`Updation error: ${updateError}`}</p>
							)}
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
					<DialogFooter>
						<Button
							onClick={async () => {
								setDeleteLoading(true);
								const { error } = await deleteTransaction({
									id: transaction.id,
								});
								setDeleteLoading(false);
								setDeleteError(error);
							}}
							type="submit"
						>
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			)}
		</Dialog>
	);
};

export default Cell;
