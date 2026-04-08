import { getMonth, getYear } from "date-fns";

interface MonthAndYear {
	month: number | null;
	year: number | null;
}

export const getMonthAndYear = (dateString?: string): MonthAndYear => {
	if (!dateString) {
		return { month: null, year: null };
	}

	const date = new Date(dateString);
	return {
		month: getMonth(date),
		year: getYear(date),
	};
};
