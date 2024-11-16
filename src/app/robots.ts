import type { MetadataRoute } from "next";

const APP_ROOT_URL = process.env.NEXT_PUBLIC_APP_ROOT_URL || "";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${APP_ROOT_URL}/sitemap.xml`,
  };
}
