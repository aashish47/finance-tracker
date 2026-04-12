// "use cache";

import { createClient } from "@/utils/supabase/server";

export async function fetcher<T>(
	query: string,
	variables?: any,
	cacheKey?: string,
): Promise<T> {
	// cacheLife("max");
	// if (cacheKey) {
	// 	cacheTag(cacheKey);
	// }

	const supabase = await createClient();

	const accessToken = (await supabase.auth.getSession()).data.session
		?.access_token;
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
}
