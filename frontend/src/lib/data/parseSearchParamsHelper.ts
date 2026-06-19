import { getLastDate } from "@/lib/data/queries";
import { getMonthAndYear } from "@/utils/getMonthAndYear";
import parseSearchParams from "@/utils/parseSearchParams";

export async function parseSearchParamsWithDefaults(
	searchParamsPromise: Promise<Record<string, string | string[] | undefined>>,
) {
	const rawParams = await searchParamsPromise;
	const searchParams = parseSearchParams(rawParams);

	if (!searchParams.year) {
		const lastDate = await getLastDate();
		const { month, year } = getMonthAndYear(lastDate);
		searchParams.month = month;
		searchParams.year = year;
	}

	return searchParams;
}
