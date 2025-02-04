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
	const selectedDate = format(new Date(date), "yyyy-MM-dd");

	const { d, Categories, Years } = await getYearlyData(selectedYear);

	const selectedCategoryId = Categories.find(
		(cat) => cat.name === selectedCategory,
	)?.id;

	const categoryTotals = Categories.map((category) => {
		return {
			category: category.name,
			amount:
				selectedMonth !== undefined
					? (d[selectedMonth].categories.find(
							(cat) => cat.name === category.name,
						)?.total ?? 0)
					: (category.total ?? 0),
			fill: `var(--color-${category.name})`,
		};
	});

	const total =
		selectedMonth !== undefined && selectedCategory
			? d[selectedMonth].categories.find((cat) => cat.name === selectedCategory)
					?.total
			: selectedMonth !== undefined
				? d[selectedMonth].total
				: selectedCategory
					? Categories.find((cat) => cat.name === selectedCategory)?.total
					: d.reduce((acc, month) => acc + month.total, 0);

	const transactions =
		selectedMonth !== undefined && selectedCategory
			? (d[selectedMonth].categories.find(
					(cat) => cat.name === selectedCategory,
				)?.transactions ?? [])
			: selectedMonth !== undefined
				? d[selectedMonth].categories.flatMap((cat) => cat.transactions)
				: selectedCategory
					? d.flatMap(
							(month) =>
								month.categories.find((cat) => cat.name === selectedCategory)
									?.transactions ?? [],
						)
					: d.flatMap((month) =>
							month.categories.flatMap((cat) => cat.transactions),
						);
	const monthly = d.map((month, index) => {
		return {
			month: format(new Date(1990, index, 1), "MMMM"),
			amount: selectedCategory
				? (month.categories.find((cat) => cat.name === selectedCategory)
						?.total ?? 0)
				: month.total,
		};
	});

	const { Total, Transactions: dailyTransactions } = await getDaysData(
		format(selectedDate, "yyyy-MM-dd"),
	);

	return (
		<div className="flex h-screen min-h-[600px] flex-col-reverse md:flex-row">
			<Sidebar />
			<div className="flex w-full flex-grow flex-col gap-2 p-2">
				<Navbar
					userData={user_metadata as UserMetadata}
					data={Years}
					selectedYear={selectedYear}
					selectedCategory={selectedCategory}
					selectedMonth={selectedMonth}
					selectedDate={selectedDate}
				/>
				<Tabs
					tab={selectedTab}
					selectedYear={selectedYear}
					selectedMonth={selectedMonth}
					selectedCategory={selectedCategory}
					selectedDate={selectedDate}
				/>
				<div className="grid h-[1px] flex-grow grid-cols-12 grid-rows-6 gap-2 overflow-hidden">
					<div
						className={` ${selectedTab === 1 ? "max-lg:col-span-full max-lg:md:col-span-7" : "max-lg:hidden"} bubble row-span-3 lg:col-span-5`}
					>
						<PieGraph
							data={categoryTotals}
							total={total}
							activeIndex={
								selectedCategoryId ? Number(selectedCategoryId) - 1 : -1
							}
							selectedCategory={selectedCategory}
							selectedMonth={selectedMonth}
							selectedYear={selectedYear}
							selectedDate={selectedDate}
						/>
					</div>
					<div
						className={` ${selectedTab === 1 ? "max-lg:col-span-full max-lg:md:col-span-5" : "max-lg:hidden"} bubble row-span-3 lg:col-span-4`}
					>
						<BarGraph
							selectedMonth={selectedMonth}
							selectedYear={selectedYear}
							selectedCategory={selectedCategory}
							monthlySummary={monthly}
							selectedDate={selectedDate}
						/>
					</div>
					<div
						className={` ${selectedTab === 3 ? "max-lg:col-span-full" : "max-lg:hidden"} bubble row-span-6 lg:col-span-3`}
					>
						<DayData
							total={Total}
							transactions={dailyTransactions}
							selectedYear={selectedYear}
							selectedMonth={selectedMonth}
							selectedCategory={selectedCategory}
							selectedTab={selectedTab}
							selectedDate={selectedDate}
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
