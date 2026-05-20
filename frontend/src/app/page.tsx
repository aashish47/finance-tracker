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

export default async function Page({ searchParams }: PageProps<"/">) {
	return (
		<SidebarProvider defaultOpen={false}>
			<SidebarTrigger />
			<AppSideBar />
			<div className="flex h-screen min-h-150 w-full">
				<div className="flex w-full grow flex-col gap-2 p-2">
					<NavbarWrapper
						searchParams={searchParams}
						dataTable={<DataTableWrapper searchParams={searchParams} />}
					/>
					<div className="grid h-px grow grid-cols-12 grid-rows-6 gap-2 overflow-hidden">
						{/* Charts: Visible on all screens */}
						<div className="bubble col-span-full row-span-3 md:col-span-7 lg:col-span-5">
							<PieGraphWrapper searchParams={searchParams} />
						</div>
						<div className="bubble col-span-full row-span-3 md:col-span-5 lg:col-span-4">
							<BarGraphWrapper searchParams={searchParams} />
						</div>

						{/* Day Data: Hidden on mobile and tablet, visible on desktop (lg) */}
						<div className="bubble row-span-6 hidden lg:col-span-3 lg:block">
							<DayDataWrapper searchParams={searchParams} />
						</div>

						{/* Form: Visible on tablet & desktop, hidden on mobile */}
						<div className="bubble row-span-3 hidden overflow-auto md:col-span-3 md:block lg:col-span-2">
							<TransactionFormWrapper searchParams={searchParams} />
						</div>

						{/* Table: Visible on tablet & desktop, hidden on mobile */}
						<div className="bubble row-span-3 hidden md:col-span-9 md:block lg:col-span-7">
							<DataTableWrapper searchParams={searchParams} />
						</div>
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
