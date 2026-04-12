import { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config: CodegenConfig = {
	schema: {
		[process.env.NEXT_PUBLIC_SERVER as string]: {
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
			},
		},
	},

	documents: ["src/graphql/**/*.graphql"],
	generates: {
		"src/graphql/generated/": {
			preset: "client",
			plugins: [],
			config: {
				documentMode: "string",
			},
		},
	},
};

export default config;
