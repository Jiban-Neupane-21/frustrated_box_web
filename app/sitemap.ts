import { MetadataRoute } from "next";
import { existsSync, readdirSync } from "fs";
import path from "path";

export const revalidate = 3600;

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://frustratedbox.com"
).replace(/\/$/, "");

type Route = {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

const candidateRoutes: Route[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/confessions", changeFrequency: "daily", priority: 0.9 },
  { path: "/login", changeFrequency: "daily", priority: 0.9 },
  { path: "/register", changeFrequency: "daily", priority: 0.9 },
  { path: "/thoughts", changeFrequency: "daily", priority: 0.9 },
  { path: "/late-night-thoughts", changeFrequency: "daily", priority: 0.9 },
  { path: "/rants", changeFrequency: "daily", priority: 0.9 },
  { path: "/quotes", changeFrequency: "daily", priority: 0.8 },
  { path: "/communities", changeFrequency: "daily", priority: 0.8 },
  { path: "/unsent-thoughts", changeFrequency: "daily", priority: 0.8 },
  { path: "/anonymous-diary", changeFrequency: "daily", priority: 0.8 },
  { path: "/home", changeFrequency: "daily", priority: 0.7 },
  { path: "/create", changeFrequency: "monthly", priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/safety", changeFrequency: "monthly", priority: 0.5 },
  { path: "/guidelines", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
  { path: "/rules", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
];

const fallbackCommunities = ["tech-life", "corporate-cage"];

function collectRoutes(dir: string, base = ""): string[] {
  if (!existsSync(dir)) return [];
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith("_") || entry.name.startsWith("@")) continue;
      const isGroup = entry.name.startsWith("(") && entry.name.endsWith(")");
      found.push(
        ...collectRoutes(
          path.join(dir, entry.name),
          isGroup ? base : `${base}/${entry.name}`,
        ),
      );
    } else if (/^page\.(tsx|ts|jsx|js|mdx)$/.test(entry.name)) {
      found.push(base);
    }
  }
  return found;
}

function getExistingRoutes(): Set<string> {
  const root = process.cwd();
  return new Set([
    ...collectRoutes(path.join(root, "app")),
    ...collectRoutes(path.join(root, "src", "app")),
  ]);
}

async function getCommunities(): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fallbackCommunities;

  try {
    const res = await fetch(`${url}/rest/v1/communities?select=slug`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return fallbackCommunities;
    const rows = (await res.json()) as { slug: string }[];
    const slugs = rows.map((r) => r.slug).filter(Boolean);
    return slugs.length ? slugs : fallbackCommunities;
  } catch {
    return fallbackCommunities;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const existing = getExistingRoutes();

  const pageUrls: MetadataRoute.Sitemap = candidateRoutes
    .filter((route) => route.path === "" || existing.has(route.path))
    .map((route) => ({
      url: `${baseUrl}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));

  const communities = await getCommunities();

  const communityUrls: MetadataRoute.Sitemap = communities.map((slug) => ({
    url: `${baseUrl}/c/${slug}`,
    lastModified,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...pageUrls, ...communityUrls];
}
