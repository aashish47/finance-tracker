"use client";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { UrlProps } from "@/types/types";
import { buildUrl } from "@/utils/buildUrl";
import { cn } from "@/utils/conditional";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

interface BarGraphProps {
	monthlySummary: {
		month: string;
		amount: number;
	}[];
}

const BarGraph = ({
	selectedMonth,
	selectedYear,
	selectedCategory,
	selectedDate,
	monthlySummary,
}: BarGraphProps & UrlProps) => {
	// console.log(`BarGraph rendered at: ${new Date().toLocaleTimeString()}`);
	const router = useRouter();

	const chartConfig = { amount: { label: "Amount" } } satisfies ChartConfig;
	const chartColor = "hsl(var(--primary))";

	return (
		<ChartContainer config={chartConfig} className="h-full w-full">
			<BarChart accessibilityLayer data={monthlySummary}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="month"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator="line" />}
				/>
				<Bar
					onClick={(_, index) => {
						selectedMonth = selectedMonth !== index ? index : undefined;
						const url = buildUrl({
							selectedYear,
							selectedMonth,
							selectedCategory,
							selectedDate,
						});
						router.push(url);
					}}
					activeIndex={selectedMonth}
					className="hover:cursor-pointer"
					activeBar={({ ...props }) => {
						return (
							<Rectangle
								{...props}
								className={cn(
									props.index === selectedMonth &&
										"fill-chart-4 drop-shadow-[0_0_5px_hsl(var(--chart-4))]",
								)}
							/>
						);
					}}
					dataKey="amount"
					radius={[8, 8, 0, 0]}
					fill={chartColor}
				/>
			</BarChart>
		</ChartContainer>
	);
};

export default BarGraph;
