"use client";

import { UrlProps } from "@/types/types";
import { buildUrl } from "@/utils/buildUrl";
import { useRouter } from "next/navigation";

const Tabs = ({
	selectedTab,
	selectedYear,
	selectedMonth,
	selectedCategory,
	selectedDate,
}: UrlProps) => {
	const router = useRouter();
	const handleClick = (selectedTab: number) => {
		const url = buildUrl({
			selectedYear,
			selectedMonth,
			selectedCategory,
			selectedTab,
			selectedDate,
		});
		router.push(url);
	};
	return (
		<div className="bubble flex h-6 items-center justify-around !p-0 lg:hidden">
			<div
				onClick={() => handleClick(1)}
				className={`tabs rounded-l-lg lg:hidden ${selectedTab === 1 ? "tab-active" : "tab-inactive"}`}
			>
				Home
			</div>
			<div
				onClick={() => handleClick(2)}
				className={`tabs md:hidden ${selectedTab === 2 ? "tab-active" : "tab-inactive"}`}
			>
				Transactions
			</div>
			<div
				onClick={() => handleClick(3)}
				className={`tabs rounded-r-lg lg:hidden ${selectedTab === 3 ? "tab-active" : "tab-inactive"}`}
			>
				Day Data
			</div>
		</div>
	);
};

export default Tabs;
