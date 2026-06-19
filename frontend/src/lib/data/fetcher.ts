import { getSession } from "@/lib/auth";
import { jwtVerify } from "jose";
import { cacheTag } from "next/cache";
import { cache } from "react";

const getUserIdFromToken = cache(
	async (accessToken: string): Promise<string> => {
		try {
			const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
			const { payload } = await jwtVerify(accessToken, secret);
			return payload.sub as string;
		} catch {
			throw new Error("Unauthorized token");
		}
	},
);

export const fetcher = async <T>(
	query: string,
	variables?: unknown,
	cacheKey?: string,
): Promise<T> => {
	const { access_token } = await getSession();
	if (!access_token) {
		throw new Error("missing access token");
	}

	const userID = await getUserIdFromToken(access_token);

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
				Authorization: `Bearer ${access_token}`,
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

	return getCachedData(query, variables, userID);
};
