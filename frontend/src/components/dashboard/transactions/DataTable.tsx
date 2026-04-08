"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";

import Cell from "@/components/dashboard/transactions/Cell";
import { DataTableColumnHeader } from "@/components/dashboard/transactions/DataTableColumnHeader";
import { DataTablePagination } from "@/components/dashboard/transactions/DataTablePagination";
import { DataTableViewOptions } from "@/components/dashboard/transactions/DataTableViewOptions";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Category, Transaction } from "@/types/types";
import { capitalize } from "@/utils/capitalize";
import { formatCurrency } from "@/utils/formatCurrency";
import { format } from "date-fns";
import { useState } from "react";

interface DataTableProps<TData> {
	categories: Category[];
	// columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData>({
	// columns,
	categories,
	data,
}: DataTableProps<TData>) {
	// console.log(`Table rendered at: ${new Date().toLocaleTimeString()}`);
	const columns: ColumnDef<TData>[] = [
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
				<DataTableColumnHeader column={column} title="Date" />
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
				const { name }: Transaction["category"] = row.getValue("category");
				return <div>{name}</div>;
			},
		},
		{
			accessorKey: "amount",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Amount" />
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
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className="flex h-full flex-col justify-between">
			<div className="flex items-center">
				<Input
					placeholder="Filter items..."
					value={(table.getColumn("item")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("item")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<DataTableViewOptions table={table} />
			</div>
			<div className="my-2 max-h-[calc(100%-84px)] rounded-md border">
				<ScrollArea className="h-full w-full">
					<Table>
						<TableHeader className="sticky top-0 z-10 bg-secondary">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</ScrollArea>
			</div>
			<div className="flex-grow"></div>
			<DataTablePagination table={table} />
		</div>
	);
}
