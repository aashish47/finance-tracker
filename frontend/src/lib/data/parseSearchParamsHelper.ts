import { FetchOptions, getLastDate } from "@/lib/data/queries";
import parseSearchParams from "@/utils/parseSearchParams";

export async function parseSearchParamsWithDefaults(
	searchParamsPromise: Promise<Record<string, string | string[] | undefined>>,
	fetchOptions: FetchOptions,
) {
	const rawParams = await searchParamsPromise;
	const searchParams = parseSearchParams(rawParams);

	if (!searchParams.year) {
		const lastDate = await getLastDate(fetchOptions);
		const { getMonthAndYear } = await import("@/utils/getMonthAndYear");
		const { month, year } = getMonthAndYear(lastDate);
		searchParams.month = month;
		searchParams.year = year;
	}

	return searchParams;
}
