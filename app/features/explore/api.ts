// app/features/explore/api.ts
import { MOCK_CONFESSIONS } from "@/app/features/feed/mockData";
import {
  MOCK_COMMUNITIES,
  NAMED_USERS,
} from "@/app/features/feed/mockConfessionsBulk";
import { Confession } from "@/app/features/feed/types";
import {
  ExplorePost,
  DiscoveryTabType,
  SearchCategoryTab,
  OmniSearchResult,
  PaginatedExploreResponse,
  SearchUser,
} from "./types";

// Helper: Convert raw Confession into ExplorePost format
function toExplorePost(c: Confession): ExplorePost {
  const moodMap: Record<string, { id: string; label: string }> = {
    "workplace-burnout": { id: "work", label: "Work & Burnout" },
    "heartbreak-solitude": { id: "heartbreak", label: "Heartbreak" },
    "future-anxiety": { id: "existential", label: "Existential Crisis" },
    "academic-stress": { id: "academics", label: "Study & Exams" },
    "academic-pressure": { id: "academics", label: "Study & Exams" },
  };

  const cluster = c.semanticCluster || "";
  const mood = moodMap[cluster] || {
    id: "general",
    label: c.tags[0] ? `#${c.tags[0]}` : "General",
  };

  return {
    id: c.id,
    author: c.author.alias,
    authorTag: c.author.isAnonymous
      ? "@anonymous"
      : `@${c.author.alias.toLowerCase().replace(/[\s.-]+/g, "_")}`,
    avatarSeed: c.author.alias.slice(0, 2).toUpperCase(),
    content: c.content,
    moodId: mood.id,
    moodLabel: mood.label,
    createdAt: new Date(c.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
    relateCount: c.relateCount,
    burnCount: c.burnCount,
    commentCount: c.echoCount,
  };
}

/**
 * 📡 1. Fetch Top Discovered Posts with Pagination (12 items per batch)
 */
export async function fetchTopDiscoveredPosts(params: {
  tab: DiscoveryTabType;
  mood?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedExploreResponse> {
  // Simulate network latency (150ms)
  await new Promise((resolve) => setTimeout(resolve, 150));

  const page = params.page || 1;
  const limit = params.limit || 12;

  let posts = MOCK_CONFESSIONS.map(toExplorePost);

  // Filter by mood category
  if (params.mood && params.mood !== "all") {
    posts = posts.filter((p) => p.moodId === params.mood);
  }

  // Sort by discovery tab
  switch (params.tab) {
    case "top-burned":
      posts.sort((a, b) => b.burnCount - a.burnCount);
      break;

    case "top-relatable":
      posts.sort((a, b) => b.relateCount - a.relateCount);
      break;

    case "top-echoed":
      posts.sort((a, b) => b.commentCount - a.commentCount);
      break;

    case "latest":
      // Sort chronologically by newest date
      posts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;

    default:
      break;
  }

  const totalCount = posts.length;
  const startIndex = (page - 1) * limit;
  const paginatedPosts = posts.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < totalCount;

  return {
    posts: paginatedPosts,
    totalCount,
    hasMore,
    nextPage: page + 1,
  };
}

/**
 * 📡 2. Unified Omnisearch (Search across Posts, People, and Communities)
 */
export async function searchExploreOmni(params: {
  query: string;
  tab?: SearchCategoryTab;
  mood?: string;
  page?: number;
  limit?: number;
}): Promise<OmniSearchResult> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const q = params.query.trim().toLowerCase();
  const page = params.page || 1;
  const limit = params.limit || 12;

  // 1. Search matching communities
  const matchedCommunities = MOCK_COMMUNITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q),
  );

  // 2. Search matching people/authors from NAMED_USERS
  const matchedPeople: SearchUser[] = NAMED_USERS.filter(
    (u) =>
      u.alias.toLowerCase().includes(q) || u.seed.toLowerCase().includes(q),
  ).map((u, index) => ({
    id: `user-${u.seed}`,
    alias: u.alias,
    username: u.seed.replace(/-/g, "_"),
    bio: `Active author sharing raw rants • @${u.seed.replace(/-/g, "_")}`,
    totalBurnsReceived: (index + 1) * 350 + 120,
    postCount: (index + 1) * 3 + 2,
    isFollowing: false,
  }));

  // 3. Search matching posts
  let matchedPosts = MOCK_CONFESSIONS.map(toExplorePost).filter(
    (p) =>
      p.content.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.moodLabel.toLowerCase().includes(q),
  );

  if (params.mood && params.mood !== "all") {
    matchedPosts = matchedPosts.filter((p) => p.moodId === params.mood);
  }

  const totalPosts = matchedPosts.length;
  const startIndex = (page - 1) * limit;
  const paginatedPosts = matchedPosts.slice(startIndex, startIndex + limit);

  return {
    posts: paginatedPosts,
    people: matchedPeople,
    communities:
      matchedCommunities as unknown as OmniSearchResult["communities"],
    totalPosts,
  };
}
