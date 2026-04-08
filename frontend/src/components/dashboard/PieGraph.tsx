"use client";

import {
	ChartConfig,
	ChartContainer,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { UrlProps } from "@/types/types";
import { buildUrl } from "@/utils/buildUrl";
import { useRouter } from "next/navigation";
import { Label, Legend, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

interface DataType {
	category: string;
	amount: number;
	fill: string;
}

interface PieGraphProps {
	data: DataType[];
	total?: number;
	activeIndex: number;
}

const PieGraph = ({
	data,
	total,
	activeIndex,
	selectedCategory,
	selectedMonth,
	selectedYear,
	selectedDate,
}: PieGraphProps & UrlProps) => {
	// console.log(`PieGraph rendered at: ${new Date().toLocaleTimeString()}`);
	const COLORS = [
		"#e6194B",
		"#f58231",
		"#ffe119",
		"#bfef45",
		"#3cb44b",
		"#42d4f4",
		"#4363d8",
		"#911eb4",
		"#f032e6",
		"#fabed4",
		"#ffd8b1",
		"#fffac8",
		"#aaffc3",
		"#469990",
		"#775ced",
		"#ffffff",
	];

	const chartConfig = data.reduce(
		(
			acc: Record<string, Record<string, string>>,
			data: DataType,
			index: number,
		) => {
			const category = data.category;
			acc[category] = {
				label: category,
				color: COLORS[index % COLORS.length],
			};
			return acc;
		},
		{},
	) satisfies ChartConfig;

	chartConfig["amount"] = { label: "Amount" };

	const router = useRouter();

	return (
		<ChartContainer config={chartConfig} className="h-full w-full">
			<PieChart>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent nameKey="amount" labelKey="category" />}
				/>

				<Legend
					className="flex-wrap justify-start gap-2 sm:gap-4"
					layout="horizontal"
					align="left"
					verticalAlign="middle"
					content={<ChartLegendContent nameKey="category" />}
				/>
				<Pie
					onClick={(_, index) => {
						const categoryID = data[index]?.category;
						selectedCategory =
							selectedCategory !== categoryID ? categoryID : undefined;
						const url = buildUrl({
							selectedYear,
							selectedMonth,
							selectedCategory,
							selectedDate,
						});
						router.push(url);
					}}
					className="hover:cursor-pointer"
					activeIndex={activeIndex}
					data={data}
					dataKey="amount"
					minAngle={10}
					innerRadius={60}
					activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => {
						return (
							<Sector
								{...props}
								outerRadius={outerRadius + 10}
								style={{
									filter: `drop-shadow(0px 0px 5px ${props.fill}`,
								}}
							/>
						);
					}}
				>
					<Label
						content={({ viewBox }) => {
							if (viewBox && "cx" in viewBox && "cy" in viewBox) {
								return (
									<text
										x={viewBox.cx}
										y={viewBox.cy}
										textAnchor="middle"
										dominantBaseline="middle"
									>
										<tspan
											x={viewBox.cx}
											y={viewBox.cy}
											className="fill-foreground text-2xl font-bold"
										>
											{total}
										</tspan>
										<tspan
											x={viewBox.cx}
											y={(viewBox.cy || 0) + 24}
											className="fill-muted-foreground"
										>
											Total
										</tspan>
									</text>
								);
							}
						}}
					/>
				</Pie>
			</PieChart>
		</ChartContainer>
	);
};

export default PieGraph;
