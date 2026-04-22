import type { NextConfig } from "next";
const nextConfig: NextConfig = {
	cacheComponents: true,
	reactCompiler: false, //table and form were having state issues
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
				pathname: "/a/**",
			},
		],
	},
};

module.exports = nextConfig;
