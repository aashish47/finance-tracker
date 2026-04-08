"use client";

import { createClient } from "@/utils/supabase/client";
import { ApolloLink, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
	ApolloClient,
	ApolloNextAppProvider,
	InMemoryCache,
	SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";
import { useEffect, useState } from "react";

function makeClient() {
	const httpLink = new HttpLink({
		uri: process.env.NEXT_PUBLIC_SERVER,
		credentials: "include",
	});

	const authLink = setContext(async (_, { headers }) => {
		const supabase = createClient();

		const accessToken = (await supabase.auth.getSession()).data.session
			?.access_token;

		return {
			headers: {
				...headers,
				authorization: `Bearer ${accessToken}`,
			},
		};
	});

	return new ApolloClient({
		cache: new InMemoryCache(),
		link:
			typeof window === "undefined"
				? ApolloLink.from([
						new SSRMultipartLink({
							stripDefer: true,
						}),
						authLink.concat(httpLink),
					])
				: authLink.concat(httpLink),
	});
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
	const supabase = createClient();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange(() => {
			setLoading(false);
		});

		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, [supabase.auth]);

	if (loading) {
		return <div>Loading...</div>;
	}
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	);
}
