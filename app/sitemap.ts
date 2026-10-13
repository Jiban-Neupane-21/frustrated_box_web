import { MetadataRoute } from "next";

export const dynamic = "force-static";

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://frustratedbox.com"
).replace(/\/$/, "");

const fallbackCommunities = ["tech-life", "corporate-cage"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const communityUrls: MetadataRoute.Sitemap = fallbackCommunities.map(
    (slug) => ({
      url: `${baseUrl}/c/${slug}`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    }),
  );

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/rules`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...communityUrls,
  ];
}
