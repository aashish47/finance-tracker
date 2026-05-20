"use client";

import TransactionForm from "@/components/dashboard/TransactionForm";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Query } from "@/graphql/generated/graphql";
import { UrlProps } from "@/types/types";
import { buildUrl } from "@/utils/buildUrl";
import { UserMetadata } from "@supabase/supabase-js";
import { ListIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

interface NavbarProps {
	user_metadata: UserMetadata;
	years: Query["Years"];
	categories: Query["Categories"];
	dataTable: React.ReactNode;
}

const Navbar = (props: NavbarProps & UrlProps) => {
	const { user_metadata, years, year, categories, dataTable, ...rest } = props;
	const router = useRouter();
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const [tableDialogOpen, setTableDialogOpen] = useState(false);

	return (
		user_metadata && (
			<>
				<nav className="bubble flex h-12 items-center justify-between">
					<Select
						onValueChange={(value) => {
							const url = buildUrl({
								year: Number(value),
								...rest,
							});
							router.push(url);
						}}
						value={year.toString()}
					>
						<SelectTrigger className="">
							<SelectValue placeholder="Select Year" />
						</SelectTrigger>
						<SelectContent position="popper" align="start">
							{years &&
								years.map(
									(year) =>
										year && (
											<SelectItem key={year} value={year.toString()}>
												{year}
											</SelectItem>
										),
								)}
						</SelectContent>
					</Select>
					<p className="text-center md:text-xl md:font-semibold">Dashboard</p>
					<div className="flex items-center justify-end gap-2 md:gap-4 md:text-lg">
						{/* Transaction Icon Button */}
						<Button
							onClick={() => setFormDialogOpen(true)}
							variant="ghost"
							size="icon"
							className="md:hidden"
							aria-label="Add transaction"
						>
							<PlusIcon className="h-5 w-5" />
						</Button>

						{/* Transactions Table Button - Mobile Only */}
						<Button
							onClick={() => setTableDialogOpen(true)}
							variant="ghost"
							size="icon"
							className="md:hidden"
							aria-label="View transactions"
						>
							<ListIcon className="h-5 w-5" />
						</Button>
						<p className="hidden capitalize md:block">{user_metadata.name}</p>
						{user_metadata.picture && (
							<Image
								className="rounded-full"
								src={user_metadata.picture}
								alt="profile picture"
								width={32}
								height={32}
							/>
						)}
					</div>
				</nav>
				{/* Transaction Dialog */}
				<Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
					<DialogContent className="overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Add Transaction</DialogTitle>
						</DialogHeader>
						<div className="py-4">
							<TransactionForm categories={categories} showWrapper={false} />
						</div>
					</DialogContent>
				</Dialog>
				{/* Transactions Table Dialog */}
				<Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
					<DialogContent className="max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Transactions</DialogTitle>
						</DialogHeader>
						<div className="py-4">{dataTable}</div>
					</DialogContent>
				</Dialog>
			</>
		)
	);
};

export default Navbar;
