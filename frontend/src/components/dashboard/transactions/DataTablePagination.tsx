import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GetTransactionsPaginatedQuery } from "@/graphql/generated/graphql";
import { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	currentPage: number;
	pageSize: number;
	totalCount: GetTransactionsPaginatedQuery["GetTransactionsPaginated"]["totalCount"];
	pageInfo: GetTransactionsPaginatedQuery["GetTransactionsPaginated"]["pageInfo"];
	onPaginationChange: (pagination: { page?: number; limit?: number }) => void;
}

export function DataTablePagination<TData>({
	table,
	currentPage,
	pageSize,
	totalCount,
	pageInfo,
	onPaginationChange,
}: DataTablePaginationProps<TData>) {
	const totalPages = Math.ceil(totalCount / pageSize);
	const { hasNextPage, hasPreviousPage } = pageInfo;

	const handlePageSizeChange = (newSize: string) => {
		onPaginationChange({ page: 1, limit: Number(newSize) });
	};

	const handleFirstPage = () => {
		onPaginationChange({ page: 1 });
	};

	const handlePreviousPage = () => {
		if (hasPreviousPage) {
			onPaginationChange({ page: currentPage - 1 });
		}
	};

	const handleNextPage = () => {
		if (hasNextPage) {
			onPaginationChange({ page: currentPage + 1 });
		}
	};

	const handleLastPage = () => {
		onPaginationChange({ page: totalPages });
	};

	return (
		<div className="flex items-center justify-between px-2">
			<div className="text-muted-foreground flex-1 text-sm">
				{/* Showing {(currentPage - 1) * pageSize + 1} to{" "}
				{Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
				transaction(s). */}
				{table.getFilteredSelectedRowModel().rows.length} of{" "}
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
						<SelectTrigger className="h-8 w-17.5">
							<SelectValue placeholder={pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((size) => (
								<SelectItem key={size} value={`${size}`}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-25 items-center justify-center text-sm font-medium">
					Page {currentPage} of {totalPages}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={handleFirstPage}
						disabled={!hasPreviousPage}
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={handlePreviousPage}
						disabled={!hasPreviousPage}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={handleNextPage}
						disabled={!hasNextPage}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={handleLastPage}
						disabled={!hasNextPage}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
