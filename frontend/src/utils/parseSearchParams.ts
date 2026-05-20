type SearchParam = string | string[] | undefined;

const parseYear = (year: SearchParam) => {
	return year && typeof year === "string" ? parseInt(year) : 0;
};

const parseMonth = (month: SearchParam) => {
	return month &&
		typeof month === "string" &&
		parseInt(month) >= 1 &&
		parseInt(month) <= 12
		? parseInt(month) - 1
		: undefined;
};

const parseCategory = (category: SearchParam) => {
	return category && typeof category === "string" ? category : undefined;
};

// Tab parameter removed — navigation now uses client-side anchors

const parseDate = (date: SearchParam) => {
	return date && typeof date === "string" ? date : new Date().toString();
};

const parsePage = (page: SearchParam) => {
	const parsed = page && typeof page === "string" ? parseInt(page) : 1;
	return parsed >= 1 ? parsed : 1;
};

const parseLimit = (limit: SearchParam) => {
	const parsed = limit && typeof limit === "string" ? parseInt(limit) : 20;
	const maxLimit = 50;
	return parsed >= 1 && parsed <= maxLimit ? Math.ceil(parsed / 10) * 10 : 20;
};

const parseSearch = (search: SearchParam) => {
	return search && typeof search === "string" ? search : undefined;
};

const parseSort = (sort: SearchParam) => {
	const validSortValues = ["date_asc", "date_desc", "amnt_asc", "amnt_desc"];
	return sort && typeof sort === "string" && validSortValues.includes(sort)
		? sort
		: undefined;
};

const parseSearchParams = (searchParams: Record<string, SearchParam>) => {
	const { year, month, category, date, page, limit, search, sort } =
		searchParams;
	return {
		year: parseYear(year),
		month: parseMonth(month),
		category: parseCategory(category),
		date: parseDate(date),
		page: parsePage(page),
		limit: parseLimit(limit),
		search: parseSearch(search),
		sort: parseSort(sort),
	};
};

export default parseSearchParams;
