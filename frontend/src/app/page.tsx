import Sidebar from "@/components/dashboard/Sidebar";
import {
	BarGraphWrapper,
	DataTableWrapper,
	DayDataWrapper,
	NavbarWrapper,
	PieGraphWrapper,
	TabsWrapper,
	TransactionFormWrapper,
} from "@/components/dashboard/wrappers";
import { getSession, getUser } from "@/lib/auth";
import { parseSearchParamsWithDefaults } from "@/lib/data/parseSearchParamsHelper";
import { FetchOptions } from "@/lib/data/queries";
import { UrlProps } from "@/utils/buildUrl";

export type UrlFetchProps = UrlProps & FetchOptions;

export default async function Page({ searchParams }: PageProps<"/">) {
	const [user, session] = await Promise.all([getUser(), getSession()]);
	const userId = user.id;
	const accessToken = session.access_token;
	const fetchOptions = { userId, accessToken };

	const urlProps = await parseSearchParamsWithDefaults(
		searchParams,
		fetchOptions,
	);

	const props: UrlFetchProps = { ...urlProps, ...fetchOptions };
	const { tab } = urlProps;

	return (
		<div className="flex h-screen min-h-150 flex-col-reverse md:flex-row">
			<Sidebar />
			<div className="flex w-full grow flex-col gap-2 p-2">
				<NavbarWrapper {...props} user_metadata={user.user_metadata} />
				<TabsWrapper {...props} />
				<div className="grid h-px grow grid-cols-12 grid-rows-6 gap-2 overflow-hidden">
					<div
						className={` ${tab === 1 ? "max-lg:col-span-full max-lg:md:col-span-7" : "max-lg:hidden"} bubble row-span-3 lg:col-span-5`}
					>
						<PieGraphWrapper {...props} />
					</div>
					<div
						className={` ${tab === 1 ? "max-lg:col-span-full max-lg:md:col-span-5" : "max-lg:hidden"} bubble row-span-3 lg:col-span-4`}
					>
						<BarGraphWrapper {...props} />
					</div>
					<div
						className={` ${tab === 3 ? "max-lg:col-span-full" : "max-lg:hidden"} bubble row-span-6 lg:col-span-3`}
					>
						<DayDataWrapper {...props} />
					</div>
					<div
						className={` ${tab === 1 ? "max-lg:md:col-span-3" : "max-lg:md:hidden"} ${tab === 2 ? "max-md:col-span-full" : "max-md:hidden"} bubble row-span-3 overflow-auto lg:col-span-2`}
					>
						<TransactionFormWrapper {...props} />
					</div>
					<div
						className={` ${tab === 1 ? "max-lg:md:col-span-9" : "max-lg:md:hidden"} ${tab === 2 ? "max-md:col-span-full" : "max-md:hidden"} bubble row-span-3 lg:col-span-7`}
					>
						<DataTableWrapper {...props} />
					</div>
				</div>
			</div>
		</div>
	);
}
