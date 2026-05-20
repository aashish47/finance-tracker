import Navbar from "@/components/dashboard/Navbar";
import { getSession, getUser } from "@/lib/auth";
import { parseSearchParamsWithDefaults } from "@/lib/data/parseSearchParamsHelper";
import { getCategoriesList, getYearsList } from "@/lib/data/queries";
import { SearchParamsType, UrlFetchProps } from "@/types/types";
import React, { Suspense } from "react";

interface NavbarProps {
	dataTable: React.ReactNode;
}

const NavbarContent: React.FC<SearchParamsType & NavbarProps> = async ({
	dataTable,
	searchParams,
}) => {
	const [user, session] = await Promise.all([getUser(), getSession()]);
	const fetchOptions = { userId: user.id, accessToken: session.access_token };

	const urlProps = await parseSearchParamsWithDefaults(
		searchParams,
		fetchOptions,
	);

	const urlFetchProps: UrlFetchProps = { ...urlProps, ...fetchOptions };
	const years = await getYearsList({ ...urlFetchProps });
	const categories = await getCategoriesList(urlFetchProps);
	return (
		<Navbar
			years={years}
			categories={categories}
			user_metadata={user.user_metadata}
			dataTable={dataTable}
			{...urlFetchProps}
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
