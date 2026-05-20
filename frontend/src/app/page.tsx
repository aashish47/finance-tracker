import AppSideBar from "@/components/dashboard/AppSidebar";
import {
	BarGraphWrapper,
	DataTableWrapper,
	DayDataWrapper,
	NavbarWrapper,
	PieGraphWrapper,
	TransactionFormWrapper,
} from "@/components/dashboard/wrappers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getSession, getUser } from "@/lib/auth";
import { parseSearchParamsWithDefaults } from "@/lib/data/parseSearchParamsHelper";
import { FetchOptions } from "@/lib/data/queries";
import { UrlProps } from "@/utils/buildUrl";

export type UrlFetchProps = UrlProps & FetchOptions;

export default async function Page({ searchParams }: PageProps<"/">) {
	const [user, session] = await Promise.all([getUser(), getSession()]);
	const fetchOptions = { userId: user.id, accessToken: session.access_token };

	const urlProps = await parseSearchParamsWithDefaults(
		searchParams,
		fetchOptions,
	);

	const props: UrlFetchProps = { ...urlProps, ...fetchOptions };

	return (
		<SidebarProvider>
			<SidebarTrigger />
			<AppSideBar />
			<div className="flex h-screen min-h-150 w-full">
				<div className="flex w-full grow flex-col gap-2 p-2">
					<NavbarWrapper
						{...props}
						user_metadata={user.user_metadata}
						dataTable={<DataTableWrapper {...props} />}
					/>
					<div className="grid h-px grow grid-cols-12 grid-rows-6 gap-2 overflow-hidden">
						{/* Charts: Visible on all screens */}
						<div className="bubble col-span-full row-span-3 md:col-span-7 lg:col-span-5">
							<PieGraphWrapper {...props} />
						</div>
						<div className="bubble col-span-full row-span-3 md:col-span-5 lg:col-span-4">
							<BarGraphWrapper {...props} />
						</div>

						{/* Day Data: Hidden on mobile and tablet, visible on desktop (lg) */}
						<div className="bubble row-span-6 hidden lg:col-span-3 lg:block">
							<DayDataWrapper {...props} />
						</div>

						{/* Form: Visible on tablet & desktop, hidden on mobile */}
						<div className="bubble row-span-3 hidden overflow-auto md:col-span-3 md:block lg:col-span-2">
							<TransactionFormWrapper {...props} />
						</div>

						{/* Table: Visible on tablet & desktop, hidden on mobile */}
						<div className="bubble row-span-3 hidden md:col-span-9 md:block lg:col-span-7">
							<DataTableWrapper {...props} />
						</div>
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
