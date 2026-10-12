import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://frustratedbox.com"
  ).replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/rules", "/privacy", "/terms", "/c/"],
      disallow: ["/admin", "/admin/", "/c/*/mod", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
