import { createClient } from "@/utils/supabase/server";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

const httpLink = new HttpLink({
	uri: process.env.NEXT_PUBLIC_SERVER,
	// fetchOptions: { cache: "cache-first" },
});

const authLink = setContext(async (_, { headers }) => {
	const supabase = await createClient();
	const accessToken = (await supabase.auth.getSession()).data.session
		?.access_token;
	return {
		headers: {
			...headers,
			authorization: `Bearer ${accessToken}`,
		},
	};
});

export const { getClient } = registerApolloClient(() => {
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: authLink.concat(httpLink),
	});
});
