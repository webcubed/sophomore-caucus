import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
	outputFileTracingRoot: path.resolve(process.cwd()),
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "X-Robots-Tag", value: "noai, noimageai, noindex" },
				],
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
				pathname: "/images/**",
			},
		],
	},
};

export default nextConfig;
