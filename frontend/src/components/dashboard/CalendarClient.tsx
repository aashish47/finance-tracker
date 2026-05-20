"use client";

import { Calendar } from "@/components/ui/calendar";
import { UrlProps } from "@/types/types";
import { buildUrl } from "@/utils/buildUrl";
import { format } from "date-fns";
import { useRouter } from "nextjs-toploader/app";

const CalendarClient = (props: UrlProps) => {
	const { date, ...rest } = props;
	const router = useRouter();
	return (
		<Calendar
			id="calendar"
			mode="single"
			selected={new Date(date)}
			onSelect={(date) => {
				if (date) {
					const url = buildUrl({
						date: format(date, "yyyy-MM-dd"),
						...rest,
					});
					router.push(url);
				}
			}}
			disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
			className="w-full bg-transparent"
		/>
	);
};

export default CalendarClient;
