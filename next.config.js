/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  images: {
    domains: ["user-images.githubusercontent.com", "s3.us-west-2.amazonaws.com"],
  },
  i18n: {
    locales: ["ja", "en"],
    defaultLocale: "ja",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/posts",
        permanent: true,
      },
    ];
  },
  pageExtensions: ["page.tsx", "page.ts"],
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
