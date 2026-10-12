import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // तपाईंको प्रोडक्शन डोमेन (domain) यहाँ राख्नुहोस्
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://frustratedbox.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/rules", "/privacy", "/terms", "/c/"],
        disallow: [
          "/admin",       // Admin Console गुगलमा नदेखियोस्
          "/admin/*",
          "/c/*/mod",     // Mod Workspaces गुगलमा नदेखियोस्
          "/api/*",       // Backend API रुटहरू
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}