import Cell from "@/components/dashboard/transactions/Cell";
import { DataTableColumnHeader } from "@/components/dashboard/transactions/DataTableColumnHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Category, Query, Transaction } from "@/graphql/generated/graphql";
import { capitalize } from "@/utils/capitalize";
import { formatCurrency } from "@/utils/formatCurrency";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const getcolumns = (
	categories: Query["Categories"],
	sort?: string,
	onSortChange?: (columnId: string, desc: boolean) => void,
): ColumnDef<Transaction>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "date",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Date"
				sort={sort}
				onSortChange={onSortChange}
			/>
		),
		cell: ({ row }) => {
			const date: string = row.getValue("date");
			const formatted = format(new Date(date), "dd-MMM-yy");
			return <div>{formatted}</div>;
		},
	},
	{
		accessorKey: "item",
		header: "Item",
		cell: ({ row }) => {
			const item = row.getValue("item") as string;
			return <div>{capitalize(item)}</div>;
		},
	},
	{
		accessorKey: "category",
		header: "Category",
		cell: ({ row }) => {
			const { name }: Category = row.getValue("category");
			return <div>{name}</div>;
		},
	},
	{
		accessorKey: "amount",
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Amount"
				sort={sort}
				onSortChange={onSortChange}
			/>
		),
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("amount"));
			return <div>{formatCurrency(amount)}</div>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => <Cell row={row} categories={categories} />,
	},
];
