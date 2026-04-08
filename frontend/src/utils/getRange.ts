import { lastDayOfMonth } from "date-fns";

export const getRange = (month: number | undefined, year: number) => {
	const startDate =
		month !== undefined ? `${year}-${month + 1}-01` : `${year}-01-01`;
	const endDate =
		month !== undefined
			? `${year}-${month + 1}-${lastDayOfMonth(new Date(`${year}-${month + 1}-01`)).getDate()}`
			: `${year}-12-31`;
	return { startDate, endDate };
};
