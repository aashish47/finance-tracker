import BarGraph from "@/components/dashboard/BarGraph";
import DayData from "@/components/dashboard/DayData";
import Navbar from "@/components/dashboard/Navbar";
import PieGraph from "@/components/dashboard/PieGraph";
import Sidebar from "@/components/dashboard/Sidebar";
import Tabs from "@/components/dashboard/Tabs";
import TransactionForm from "@/components/dashboard/TransactionForm";
import { DataTable } from "@/components/dashboard/transactions/DataTable";
import { getSession, getUser } from "@/lib/auth";
import { gatherDashboardData } from "@/lib/data/dashboard";
import { getLastDate } from "@/lib/data/queries";
import { getMonthAndYear } from "@/utils/getMonthAndYear";
import parseSearchParams from "@/utils/parseSearchParams";

export default async function Page(props: PageProps<"/home">) {
	const { user_metadata, id: userId } = await getUser();
	const accessToken = (await getSession()).access_token;
	const fetchOptions = { userId, accessToken };
	const searchParams = parseSearchParams(await props.searchParams);
	if (!searchParams.year) {
		const lastDate = await getLastDate({ ...fetchOptions });
		const { month, year } = getMonthAndYear(lastDate);
		searchParams.month = month;
		searchParams.year = year;
	}
	const tab = searchParams.tab;

	const {
		Categories,
		Years,
		categoryTotalsForPie,
		monthly,
		transactionConnection,
		total,
		categoryID,
		dailyTotal,
		dailyTransactions,
	} = await gatherDashboardData({ ...searchParams, ...fetchOptions });

	// console.log(`Page rendered at: ${new Date().toLocaleTimeString()}`);

	return (
		<div className="flex h-screen min-h-150 flex-col-reverse md:flex-row">
			<Sidebar />
			<div className="flex w-full grow flex-col gap-2 p-2">
				<Navbar {...searchParams} userData={user_metadata} years={Years} />
				<Tabs {...searchParams} />
				<div className="grid h-px grow grid-cols-12 grid-rows-6 gap-2 overflow-hidden">
					<div
						className={` ${tab === 1 ? "max-lg:col-span-full max-lg:md:col-span-7" : "max-lg:hidden"} bubble row-span-3 lg:col-span-5`}
					>
						<PieGraph
							{...searchParams}
							data={categoryTotalsForPie}
							total={total}
							activeIndex={categoryID ? Number(categoryID) - 1 : -1}
						/>
					</div>
					<div
						className={` ${tab === 1 ? "max-lg:col-span-full max-lg:md:col-span-5" : "max-lg:hidden"} bubble row-span-3 lg:col-span-4`}
					>
						<BarGraph {...searchParams} monthlySummary={monthly} />
					</div>
					<div
						className={` ${tab === 3 ? "max-lg:col-span-full" : "max-lg:hidden"} bubble row-span-6 lg:col-span-3`}
					>
						<DayData
							{...searchParams}
							dailyTotal={dailyTotal}
							dailyTransactions={dailyTransactions}
						/>
					</div>
					<div
						className={` ${tab === 1 ? "max-lg:md:col-span-3" : "max-lg:md:hidden"} ${tab === 2 ? "max-md:col-span-full" : "max-md:hidden"} bubble row-span-3 overflow-auto lg:col-span-2`}
					>
						<TransactionForm categories={Categories} />
					</div>
					<div
						className={` ${tab === 1 ? "max-lg:md:col-span-9" : "max-lg:md:hidden"} ${tab === 2 ? "max-md:col-span-full" : "max-md:hidden"} bubble row-span-3 lg:col-span-7`}
					>
						<DataTable
							{...searchParams}
							categories={Categories}
							transactionConnection={transactionConnection}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
