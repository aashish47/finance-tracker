import { Query } from "@/graphql/generated/graphql";
import { getMonth, getYear } from "date-fns";

interface MonthAndYear {
	month: number;
	year: number;
}

export const getMonthAndYear = (
	dateString?: Query["LastDate"],
): MonthAndYear => {
	if (!dateString) {
		return { month: 0, year: 0 };
	}

	const date = new Date(dateString);
	return {
		month: getMonth(date),
		year: getYear(date),
	};
};
