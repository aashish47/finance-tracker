/** @type {import('next').NextConfig} */
const nextConfig = {
	cacheComponents: true,
	reactCompiler: true,
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
