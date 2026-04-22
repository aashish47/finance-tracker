import CalendarClient from "@/components/dashboard/CalendarClient";
import { GetDaysDataQuery } from "@/graphql/generated/graphql";
import { UrlProps } from "@/utils/buildUrl";
import { capitalize } from "@/utils/capitalize";
import { formatCurrency } from "@/utils/formatCurrency";

interface DayDataProps {
	dailyTotal: GetDaysDataQuery["Total"];
	dailyTransactions: GetDaysDataQuery["Transactions"];
}

const DayData = (props: DayDataProps & UrlProps) => {
	const { dailyTotal, dailyTransactions, ...rest } = props;
	dailyTransactions
		?.filter((t) => t !== null)
		.sort((a, b) => b.amount - a.amount);

	return (
		<div className="flex h-full flex-col gap-2">
			<div className="rounded-md border">
				<CalendarClient {...rest} />
			</div>
			<div className="grow rounded-md border p-2">
				<div className="flex h-full flex-col justify-between">
					<div className="text-muted-foreground text-center text-sm">
						Summary
					</div>
					{!!dailyTotal && (
						<div className="text-center text-5xl font-semibold">
							{formatCurrency(dailyTotal)}
						</div>
					)}
					<div className="text-muted-foreground text-center">
						{dailyTransactions &&
						dailyTransactions?.length > 0 &&
						dailyTransactions[0]
							? `Biggest Spend: ${capitalize(dailyTransactions[0].item)} ${formatCurrency(dailyTransactions[0].amount)}`
							: "No Transactions"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DayData;
