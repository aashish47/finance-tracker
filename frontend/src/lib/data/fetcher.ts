import { jwtVerify } from "jose";
import { cacheTag } from "next/cache";

export const fetcher = async <T>(
	query: string,
	variables?: unknown,
	cacheKey?: string,
	accessToken?: string,
): Promise<T> => {
	if (!accessToken) {
		throw new Error("missing access token");
	}

	let userId: string;
	try {
		const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
		const { payload } = await jwtVerify(accessToken, secret);
		userId = payload.sub as string;
	} catch {
		throw new Error("Unauthorized token");
	}

	const getCachedData = async (
		q: string,
		v: unknown,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_uid: string,
	): Promise<T> => {
		"use cache: remote";

		if (cacheKey) {
			cacheTag(cacheKey);
		}

		const res = await fetch(process.env.NEXT_PUBLIC_SERVER as string, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ query: q, variables: v }),
		});

		const json: { data?: T; errors?: { message: string }[] } = await res.json();

		if (json.errors?.length) {
			throw new Error(json.errors[0].message);
		}
		if (!json.data) {
			throw new Error("No data returned");
		}

		return json.data;
	};

	return getCachedData(query, variables, userId);
};
