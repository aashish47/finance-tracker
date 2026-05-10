import { UrlFetchProps } from "@/app/page";
import Navbar from "@/components/dashboard/Navbar";
import { getYearsList } from "@/lib/data/queries";
import { UserMetadata } from "@supabase/supabase-js";
import { Suspense } from "react";

async function NavbarContent(
	props: UrlFetchProps & { user_metadata: UserMetadata },
) {
	const Years = await getYearsList({ ...props });
	return <Navbar userData={props.user_metadata} years={Years} {...props} />;
}

export default function NavbarWrapper(
	props: UrlFetchProps & { user_metadata: UserMetadata },
) {
	return (
		<Suspense
			fallback={
				<div className="bg-muted h-12 w-full animate-pulse rounded-lg" />
			}
		>
			<NavbarContent {...props} />
		</Suspense>
	);
}
