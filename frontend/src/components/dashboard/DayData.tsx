import CalendarClient from "@/components/dashboard/CalendarClient";
import { Transaction, UrlProps } from "@/types/types";
import { capitalize } from "@/utils/capitalize";
import { formatCurrency } from "@/utils/formatCurrency";

interface DayDataProps {
	total: number;
	transactions: Transaction[];
}

const DayData = ({
	total,
	transactions,
	selectedYear,
	selectedMonth,
	selectedCategory,
	selectedTab,
	selectedDate,
}: DayDataProps & UrlProps) => {
	transactions.sort((a, b) => b.amount - a.amount);

	return (
		<div className="flex h-full flex-col gap-2">
			<CalendarClient
				selectedYear={selectedYear}
				selectedCategory={selectedCategory}
				selectedMonth={selectedMonth}
				selectedDate={selectedDate}
				selectedTab={selectedTab}
			/>
			<div className="flex-grow rounded-md border p-3">
				<div className="flex h-full flex-col justify-between">
					<div className="hidden text-center text-sm text-muted-foreground md:block">
						Summary
					</div>
					<div className="text-center text-5xl font-semibold">
						{formatCurrency(total)}
					</div>
					<div className="text-center text-muted-foreground">
						{transactions.length > 0
							? `Biggest Spend: ${capitalize(transactions[0].item)} ${formatCurrency(transactions[0].amount)}`
							: "No Transactions"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DayData;
