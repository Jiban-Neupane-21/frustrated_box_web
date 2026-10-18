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
  PaginatedCommunitiesResponse,
  SearchCommunity,
  SearchMode,
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
    tags: c.tags,
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
 * 📡 2. Unified Omnisearch
 *
 * mode "hashtag"  -> posts whose tags match (people/communities empty)
 * mode "username" -> people whose alias/username match (posts/communities empty)
 * mode "text"     -> confession posts + communities (people empty)
 *
 * A leading # or @ in `query` is stripped here too, so the caller can pass either form.
 */
export async function searchExploreOmni(params: {
  query: string;
  mode?: SearchMode;
  tab?: SearchCategoryTab;
  mood?: string;
  page?: number;
  limit?: number;
}): Promise<OmniSearchResult> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const mode: SearchMode = params.mode ?? "text";
  const q = params.query
    .trim()
    .replace(/^[#@]+/, "")
    .toLowerCase();
  const page = params.page || 1;
  const limit = params.limit || 12;

  // 👤 @username search -> people only
  if (mode === "username") {
    const uq = q.replace(/-/g, "_");
    const people: SearchUser[] = NAMED_USERS.filter(
      (u) =>
        u.alias.toLowerCase().includes(q) ||
        u.seed.replace(/-/g, "_").toLowerCase().includes(uq),
    ).map((u, index) => ({
      id: `user-${u.seed}`,
      alias: u.alias,
      username: u.seed.replace(/-/g, "_"),
      bio: `Active author sharing raw rants • @${u.seed.replace(/-/g, "_")}`,
      totalBurnsReceived: (index + 1) * 350 + 120,
      postCount: (index + 1) * 3 + 2,
      isFollowing: false,
    }));

    return { posts: [], people, communities: [], totalPosts: 0 };
  }

  // 🏷️ #hashtag search -> posts only
  if (mode === "hashtag") {
    let tagged = MOCK_CONFESSIONS.filter((c) =>
      c.tags.some((t) => t.toLowerCase().replace(/^#/, "").includes(q)),
    ).map(toExplorePost);

    if (params.mood && params.mood !== "all") {
      tagged = tagged.filter((p) => p.moodId === params.mood);
    }

    const start = (page - 1) * limit;
    return {
      posts: tagged.slice(start, start + limit),
      people: [],
      communities: [],
      totalPosts: tagged.length,
    };
  }

  // 🔎 Plain text search -> confession posts + communities
  const matchedCommunities = (
    MOCK_COMMUNITIES as unknown as SearchCommunity[]
  ).filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q),
  );

  let matchedPosts = MOCK_CONFESSIONS.map(toExplorePost).filter(
    (p) =>
      p.content.toLowerCase().includes(q) ||
      p.moodLabel.toLowerCase().includes(q) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(q)),
  );

  if (params.mood && params.mood !== "all") {
    matchedPosts = matchedPosts.filter((p) => p.moodId === params.mood);
  }

  const startIndex = (page - 1) * limit;

  return {
    posts: matchedPosts.slice(startIndex, startIndex + limit),
    people: [],
    communities: matchedCommunities,
    totalPosts: matchedPosts.length,
  };
}

/**
 * 📡 3. Communities list
 *  - random: true  -> random picks (used for the 5-6 suggestions under the search bar)
 *  - random: false -> all communities, biggest first, paginated ("Explore more")
 */
export async function fetchExploreCommunities(params: {
  page?: number;
  limit?: number;
  random?: boolean;
}): Promise<PaginatedCommunitiesResponse> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  const page = params.page || 1;
  const limit = params.limit || 12;
  const all = [...(MOCK_COMMUNITIES as unknown as SearchCommunity[])];

  if (params.random) {
    // Fisher-Yates shuffle
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return {
      communities: all.slice(0, limit),
      totalCount: all.length,
      hasMore: all.length > limit,
      nextPage: 2,
    };
  }

  all.sort((a, b) => (b.membersCount ?? 0) - (a.membersCount ?? 0));
  const start = (page - 1) * limit;

  return {
    communities: all.slice(start, start + limit),
    totalCount: all.length,
    hasMore: start + limit < all.length,
    nextPage: page + 1,
  };
}