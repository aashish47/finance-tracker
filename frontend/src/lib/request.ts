import { createClient } from "@/utils/supabase/server";
import { DocumentNode } from "graphql";

export const request = async (
	query: DocumentNode,
	variables?: object,
	cache?: RequestCache,
	tags?: string[],
) => {
	const supabase = await createClient();
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${session?.access_token}`,
		},
		body: JSON.stringify({ query: query.loc?.source.body, variables }),
		cache,
		next: {
			tags,
		},
	});

	const responseData = await response.json();

	if (response.ok) {
		return responseData.data;
	} else {
		throw new Error(
			`GraphQL query failed: ${responseData.errors?.[0]?.message}`,
		);
	}
};
