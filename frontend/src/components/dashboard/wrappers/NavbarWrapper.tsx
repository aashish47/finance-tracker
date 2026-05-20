import { UrlFetchProps } from "@/app/page";
import Navbar from "@/components/dashboard/Navbar";
import { getCategoriesList, getYearsList } from "@/lib/data/queries";
import { UserMetadata } from "@supabase/supabase-js";
import { Suspense } from "react";

async function NavbarContent(
	props: UrlFetchProps & {
		user_metadata: UserMetadata;
		dataTable: React.ReactNode;
	},
) {
	const years = await getYearsList({ ...props });
	const categories = await getCategoriesList(props);
	return (
		<Navbar
			years={years}
			{...props}
			dataTable={props.dataTable}
			categories={categories}
		/>
	);
}

export default function NavbarWrapper(
	props: UrlFetchProps & {
		user_metadata: UserMetadata;
		dataTable: React.ReactNode;
	},
) {
	return (
		<Suspense
			fallback={
				<div className="bubble bg-muted h-12 animate-pulse rounded-lg" />
			}
		>
			<NavbarContent {...props} />
		</Suspense>
	);
}
