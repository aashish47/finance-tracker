import { format } from "date-fns";

export interface UrlProps {
	year: number;
	month?: number;
	category?: string;
	tab?: number;
	date: string;
	page: number;
	limit: number;
	search?: string;
	sort?: string;
}

export const buildUrl = ({
	year,
	month,
	category,
	tab,
	date,
	page,
	limit,
	search,
	sort,
}: UrlProps) => {
	const params = new URLSearchParams();
	params.set("year", year.toString());

	if (month !== undefined) {
		params.set("month", (month + 1).toString());
	}

	if (category) {
		params.set("category", category);
	}

	if (tab) {
		params.set("tab", tab.toString());
	}

	if (date) {
		params.set("date", format(new Date(date), "yyyy-MM-dd"));
	}

	if (page) {
		params.set("page", page.toString());
	}

	if (limit) {
		params.set("limit", limit.toString());
	}

	if (search) {
		params.set("search", search);
	}

	if (sort) {
		params.set("sort", sort);
	}

	const url = `/home?${params.toString()}`;

	return url;
};
