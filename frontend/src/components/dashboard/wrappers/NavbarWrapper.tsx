import Navbar from "@/components/dashboard/Navbar";
import { getUser } from "@/lib/auth";
import { parseSearchParamsWithDefaults } from "@/lib/data/parseSearchParamsHelper";
import { getCategoriesList, getYearsList } from "@/lib/data/queries";
import { SearchParamsType } from "@/types/types";
import React, { Suspense } from "react";

interface NavbarProps {
	dataTable: React.ReactNode;
}

const NavbarContent: React.FC<SearchParamsType & NavbarProps> = async ({
	dataTable,
	searchParams,
}) => {
	const [user_metadata, urlProps, years, categories] = await Promise.all([
		getUser(),
		parseSearchParamsWithDefaults(searchParams),
		getYearsList(),
		getCategoriesList(),
	]);

	return (
		<Navbar
			years={years}
			categories={categories}
			user_metadata={user_metadata}
			dataTable={dataTable}
			{...urlProps}
		/>
	);
};

const NavbarWrapper: React.FC<SearchParamsType & NavbarProps> = ({
	searchParams,
	dataTable,
}) => {
	return (
		<Suspense
			fallback={
				<div className="bubble bg-muted h-12 animate-pulse rounded-lg" />
			}
		>
			<NavbarContent searchParams={searchParams} dataTable={dataTable} />
		</Suspense>
	);
};

export default NavbarWrapper;
