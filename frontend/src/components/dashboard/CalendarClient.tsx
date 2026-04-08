"use client";

import { Calendar } from "@/components/ui/calendar";
import { UrlProps } from "@/types/types";
import { buildUrl } from "@/utils/buildUrl";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const CalendarClient = ({
	selectedYear,
	selectedMonth,
	selectedCategory,
	selectedTab,
	selectedDate,
}: UrlProps) => {
	const router = useRouter();
	console.log(selectedDate);
	return (
		<Calendar
			id="calendar"
			mode="single"
			selected={new Date(selectedDate)}
			onSelect={(date) => {
				if (date) {
					selectedDate = format(date, "yyyy-MM-dd");
					const url = buildUrl({
						selectedYear,
						selectedMonth,
						selectedCategory,
						selectedTab,
						selectedDate,
					});
					router.push(url);
				}
			}}
			disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
			className="rounded-md border"
		/>
	);
};

export default CalendarClient;
