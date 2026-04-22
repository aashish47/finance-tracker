"use client";

import {
	ChartConfig,
	ChartContainer,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { buildUrl, UrlProps } from "@/utils/buildUrl";
import { useRouter } from "next/navigation";
import { Label, Legend, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

export interface CategoryTotalsForPie {
	category: string;
	amount: number;
	fill: string;
}

interface PieGraphProps {
	activeIndex: number;
	data: CategoryTotalsForPie[];
	total?: number;
}

const COLORS = {
	Grocery: "#e6194B",
	Education: "#f58231",
	Health: "#ffe119",
	Miscellaneous: "#bfef45",
	Food: "#3cb44b",
	Transportation: "#42d4f4",
	Personal: "#4363d8",
	Entertainment: "#911eb4",
	Tax: "#f032e6",
	Utility: "#fabed4",
	Rent: "#fffac8",
	Debt: "#ffd8b1",
	Gift: "#aaffc3",
	Insurance: "#469990",
	Electronics: "#775ced",
	Repair: "#ffffff",
};

const PieGraph = (props: PieGraphProps & UrlProps) => {
	// console.log(`PieGraph rendered at: ${new Date().toLocaleTimeString()}`);
	const { activeIndex, data, total, category, ...rest } = props;

	const chartConfig = data.reduce(
		(
			acc: Record<string, Record<string, string>>,
			data: CategoryTotalsForPie,
		) => {
			const category = data.category as keyof typeof COLORS;
			acc[category] = {
				label: category,
				color: COLORS[category],
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
						const selectedCategory = data[index]?.category;
						const url = buildUrl({
							category:
								category !== selectedCategory ? selectedCategory : undefined,
							...rest,
						});
						router.push(url);
					}}
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
									filter: `drop-shadow(0px 0px 5px ${props.fill})`,
								}}
							/>
						);
					}}
				>
					{total !== undefined && (
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
					)}
				</Pie>
			</PieChart>
		</ChartContainer>
	);
};

export default PieGraph;
