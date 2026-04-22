import { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config: CodegenConfig = {
	// Use local schema file to allow codegen without a running server
	schema: "../backend/graphql/schema.graphqls",

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
