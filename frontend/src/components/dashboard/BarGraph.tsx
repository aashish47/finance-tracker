"use client";

import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { buildUrl, UrlProps } from "@/utils/buildUrl";
import { useRouter } from "nextjs-toploader/app";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

interface BarGraphProps {
	monthlySummary: {
		month: string;
		amount: number;
	}[];
}

const BarGraph = (props: BarGraphProps & UrlProps) => {
	// console.log(`BarGraph rendered at: ${new Date().toLocaleTimeString()}`);
	const { monthlySummary, month, ...rest } = props;
	const router = useRouter();
	const chartConfig = { amount: { label: "Amount" } } satisfies ChartConfig;
	const chartColor = "var(--primary)";

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
						const url = buildUrl({
							month: month === index ? undefined : index,
							...rest,
						});
						router.push(url);
					}}
					activeIndex={month}
					activeBar={({ ...props }) => {
						return (
							<Rectangle
								{...props}
								className={cn(
									month !== undefined &&
										props.index === month &&
										"drop-shadow-[0_0_5px_var(--chart-4)]",
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
