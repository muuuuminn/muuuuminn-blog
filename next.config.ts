import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 0,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "user-images.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/posts",
        permanent: true,
      },
      {
        source: "/:lang(en|ja)/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_APP_ROOT_URL: process.env.NEXT_PUBLIC_APP_ROOT_URL,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

