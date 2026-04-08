import BarGraph from "@/components/dashboard/BarGraph";
import DayData from "@/components/dashboard/DayData";
import Navbar from "@/components/dashboard/Navbar";
import PieGraph from "@/components/dashboard/PieGraph";
import Sidebar from "@/components/dashboard/Sidebar";
import Tabs from "@/components/dashboard/Tabs";
import TransactionForm from "@/components/dashboard/TransactionForm";
import { DataTable } from "@/components/dashboard/transactions/DataTable";
import { getDaysData, getLastDate, getYearlyData } from "@/lib/actions";
import { UserMetadata } from "@/types/types";
import { getMonthAndYear } from "@/utils/getMonthAndYear";
import { getUser } from "@/utils/getUser";
import { format } from "date-fns";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
	const { user_metadata } = await getUser();

	const {
		year,
		month,
		category,
		tab = 1,
		date = new Date(),
	} = await searchParams;
	let selectedYear, selectedMonth;

	if (!year) {
		const lastDate = await getLastDate();

		const { month, year } = getMonthAndYear(lastDate);
		selectedYear = year ? year : 1;
		selectedMonth = month ?? undefined;
	} else {
		selectedYear = Number(year);
		selectedMonth =
			month && Number(month) >= 1 && Number(month) <= 12
				? Number(month) - 1
				: undefined;
	}

	const selectedCategory = category;
	const selectedTab = Number(tab);
	const selectedDate = date.toString();

	const { TransactionsByMonth, Categories, Years } =
		await getYearlyData(selectedYear);

	const selectedCategoryId = Categories.find(
		(category) => category.name === selectedCategory,
	)?.id;

	const categoryTotals = Categories.map((category) => {
		return {
			category: category.name,
			amount:
				selectedMonth !== undefined
					? (TransactionsByMonth[selectedMonth].categories.find(
							(cat) => cat.name === category.name,
						)?.total ?? 0)
					: (category.total ?? 0),
			fill: `var(--color-${category.name})`,
		};
	});

	const total =
		selectedMonth !== undefined && selectedCategory
			? TransactionsByMonth[selectedMonth].categories.find(
					(category) => category.name === selectedCategory,
				)?.total
			: selectedMonth !== undefined
				? TransactionsByMonth[selectedMonth].total
				: selectedCategory
					? Categories.find((category) => category.name === selectedCategory)
							?.total
					: TransactionsByMonth.reduce((acc, month) => acc + month.total, 0);

	const transactions =
		selectedMonth !== undefined && selectedCategory
			? (TransactionsByMonth[selectedMonth].categories.find(
					(category) => category.name === selectedCategory,
				)?.transactions ?? [])
			: selectedMonth !== undefined
				? TransactionsByMonth[selectedMonth].categories.flatMap(
						(category) => category.transactions,
					)
				: selectedCategory
					? TransactionsByMonth.flatMap(
							(month) =>
								month.categories.find(
									(category) => category.name === selectedCategory,
								)?.transactions ?? [],
						)
					: TransactionsByMonth.flatMap((month) =>
							month.categories.flatMap((category) => category.transactions),
						);
	const monthly = TransactionsByMonth.map((month, index) => {
		return {
			month: format(new Date(1990, index, 1), "MMMM"),
			amount: selectedCategory
				? (month.categories.find(
						(category) => category.name === selectedCategory,
					)?.total ?? 0)
				: month.total,
		};
	});

	const { Total: dailyTotal, Transactions: dailyTransactions } =
		await getDaysData(format(selectedDate, "yyyy-MM-dd"));

	const urlParams = {
		selectedYear,
		selectedMonth,
		selectedCategory,
		selectedTab,
		selectedDate,
	};

	return (
		<div className="flex h-screen min-h-[600px] flex-col-reverse md:flex-row">
			<Sidebar />
			<div className="flex w-full flex-grow flex-col gap-2 p-2">
				<Navbar
					{...urlParams}
					userData={user_metadata as UserMetadata}
					data={Years}
				/>
				<Tabs {...urlParams} />
				<div className="grid h-[1px] flex-grow grid-cols-12 grid-rows-6 gap-2 overflow-hidden">
					<div
						className={` ${selectedTab === 1 ? "max-lg:col-span-full max-lg:md:col-span-7" : "max-lg:hidden"} bubble row-span-3 lg:col-span-5`}
					>
						<PieGraph
							{...urlParams}
							data={categoryTotals}
							total={total}
							activeIndex={
								selectedCategoryId ? Number(selectedCategoryId) - 1 : -1
							}
						/>
					</div>
					<div
						className={` ${selectedTab === 1 ? "max-lg:col-span-full max-lg:md:col-span-5" : "max-lg:hidden"} bubble row-span-3 lg:col-span-4`}
					>
						<BarGraph {...urlParams} monthlySummary={monthly} />
					</div>
					<div
						className={` ${selectedTab === 3 ? "max-lg:col-span-full" : "max-lg:hidden"} bubble row-span-6 lg:col-span-3`}
					>
						<DayData
							{...urlParams}
							total={dailyTotal}
							transactions={dailyTransactions}
						/>
					</div>
					<div
						className={` ${selectedTab === 1 ? "max-lg:md:col-span-3" : "max-lg:md:hidden"} ${selectedTab === 2 ? "max-md:col-span-full" : "max-md:hidden"} bubble row-span-3 overflow-auto lg:col-span-2`}
					>
						<TransactionForm data={Categories} />
					</div>
					<div
						className={` ${selectedTab === 1 ? "max-lg:md:col-span-9" : "max-lg:md:hidden"} ${selectedTab === 2 ? "max-md:col-span-full" : "max-md:hidden"} bubble row-span-3 lg:col-span-7`}
					>
						<DataTable categories={Categories} data={transactions} />
					</div>
				</div>
			</div>
		</div>
	);
}
