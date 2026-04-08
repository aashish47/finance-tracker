import { UrlProps } from "@/types/types";
import { format } from "date-fns";

export const buildUrl = ({
	selectedYear,
	selectedMonth,
	selectedCategory,
	selectedTab,
	selectedDate,
}: UrlProps) => {
	const params = new URLSearchParams();
	params.set("year", selectedYear.toString());

	if (selectedMonth !== undefined) {
		params.set("month", (selectedMonth + 1).toString());
	}

	if (selectedCategory) {
		params.set("category", selectedCategory);
	}

	if (selectedTab) {
		params.set("tab", selectedTab.toString());
	}

	if (selectedDate) {
		params.set("date", format(new Date(selectedDate), "yyyy-MM-dd"));
	}

	const url = `/home?${params.toString()}`;

	return url;
};
