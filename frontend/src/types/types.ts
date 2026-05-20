export interface UrlProps {
	year: number;
	month?: number;
	category?: string;
	date: string;
	page: number;
	limit: number;
	search?: string;
	sort?: string;
}

export interface FetchOptions {
	userId: string;
	accessToken: string;
	cacheKey?: string;
}

export type UrlFetchProps = UrlProps & FetchOptions;
export interface SearchParamsType {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}
