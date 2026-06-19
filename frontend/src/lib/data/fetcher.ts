"use cache: private";

import { cacheTag } from "next/cache";
import { cache } from "react";

export const fetcher = cache(
	async <T>(
		query: string,
		variables?: unknown,
		cacheKey?: string,
		accessToken?: string,
	): Promise<T> => {
		if (cacheKey) {
			cacheTag(cacheKey);
		}

		if (!accessToken) {
			throw new Error("missing access token");
		}

		const res = await fetch(process.env.NEXT_PUBLIC_SERVER as string, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ query, variables }),
		});

		const json: { data?: T; errors?: { message: string }[] } = await res.json();

		if (json.errors?.length) {
			throw new Error(json.errors[0].message);
		}
		if (!json.data) {
			console.error(query, variables, json, accessToken);
			throw new Error("No data returned");
		}

		return json.data;
	},
);
