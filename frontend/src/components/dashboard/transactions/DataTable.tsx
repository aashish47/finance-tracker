"use client";

import { getcolumns } from "@/components/dashboard/transactions/Columns";
import { DataTablePagination } from "@/components/dashboard/transactions/DataTablePagination";
import { DataTableViewOptions } from "@/components/dashboard/transactions/DataTableViewOptions";
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
import {
	GetTransactionsPaginatedQuery,
	Query,
} from "@/graphql/generated/graphql";
import { UrlProps } from "@/types/types";
import { buildUrl } from "@/utils/buildUrl";
import {
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import { X } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useEffect, useMemo, useState } from "react";

interface DataTableProps {
	categories: Query["Categories"];
	transactionConnection: GetTransactionsPaginatedQuery["GetTransactionsPaginated"];
}

export function DataTable(props: DataTableProps & UrlProps) {
	// console.log(`Table rendered at: ${new Date().toLocaleTimeString()}`);
	const router = useRouter();
	const {
		categories,
		transactionConnection,
		page,
		limit,
		search,
		sort,
		...rest
	} = props;
	const { edges, ...info } = transactionConnection;
	const data = edges.map((edge) => edge.node);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [localSearch, setLocalSearch] = useState<string>(search ?? "");

	const handleSortChange = useCallback(
		(columnId: string, desc: boolean) => {
			const sortMap: Record<string, Record<string, string>> = {
				date: { false: "date_asc", true: "date_desc" },
				amount: { false: "amnt_asc", true: "amnt_desc" },
			};
			const desc_string = desc ? "true" : "false";
			const newSort = sortMap[columnId]?.[desc_string];
			if (newSort) {
				const newUrl = buildUrl({
					page: 1,
					limit,
					search: localSearch || undefined,
					sort: newSort,
					...rest,
				});
				router.push(newUrl);
			}
		},
		[localSearch, limit, rest, router],
	);

	const columns = useMemo(
		() => getcolumns(categories, sort, handleSortChange),
		[categories, sort, handleSortChange],
	);

	// Debounced search effect
	useEffect(() => {
		if (localSearch === (search ?? "")) return;
		const timer = setTimeout(() => {
			const newUrl = buildUrl({
				page: 1,
				limit,
				search: localSearch || undefined,
				sort,
				...rest,
			});
			router.push(newUrl);
		}, 400);

		return () => clearTimeout(timer);
	}, [localSearch, limit, rest, router, search, sort]);

	useEffect(() => {
		setLocalSearch(search ?? "");
	}, [search]);

	const table = useReactTable({
		data,
		columns,
		manualPagination: true,
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	const handlePaginationChange = (pagination: {
		page?: number;
		limit?: number;
	}) => {
		const newUrl = buildUrl({
			page: pagination.page ?? page,
			limit: pagination.limit ?? limit,
			search: localSearch || undefined,
			sort,
			...rest,
		});
		router.push(newUrl);
	};

	return (
		<div className="flex h-full flex-col justify-between">
			<div className="flex items-center">
				<div className="relative w-full max-w-sm">
					<Input
						placeholder="Filter items..."
						value={localSearch}
						onChange={(event) => setLocalSearch(event.target.value)}
						className="pr-8"
					/>
					{localSearch && (
						<button
							type="button"
							onClick={() => setLocalSearch("")}
							className="text-muted-foreground hover:bg-secondary hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-0.5 transition-colors"
							aria-label="Clear search"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>
				<DataTableViewOptions table={table} />
			</div>
			<ScrollArea className="my-2 max-h-[calc(100%-84px)] rounded-md border">
				<Table>
					<TableHeader className="bg-accent sticky top-0 z-10">
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
			<div className="grow"></div>
			<DataTablePagination
				{...info}
				table={table}
				currentPage={page}
				pageSize={limit}
				onPaginationChange={handlePaginationChange}
			/>
		</div>
	);
}
