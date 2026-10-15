import { MOCK_CONFESSIONS } from "./mockData";
import {
  FeedQueryParams,
  PaginatedFeedResponse,
  ConfessionComment,
} from "./types";

// In-memory mutable store so user likes/burns persist across pagination in the current session
let confessionsStore = [...MOCK_CONFESSIONS];

/**
 * Fetch paginated confessions stream (simulates Hono GET /api/confessions)
 */
export async function fetchFeed(
  params: FeedQueryParams = {},
): Promise<PaginatedFeedResponse> {
  const { limit = 5, cursor = null, sort = "recent", tag = null } = params;

  // Simulate network latency (450ms) to test loading skeletons
  await new Promise((resolve) => setTimeout(resolve, 450));

  let filtered = [...confessionsStore];

  // 1. Dynamic Organic Tag Filter (e.g., #overtime, #exams)
  if (tag) {
    const normalizedTag = tag.replace(/^#/, "").toLowerCase().trim();
    filtered = filtered.filter((item) =>
      item.tags.some((t) => t.toLowerCase() === normalizedTag),
    );
  }

  // 2. Sorting & Following Filter Logic
  const followedAuthors = getFollowedAuthorIds();

  if (sort === "following") {
    // 🔒 केवल अनाम नभएका र फलो गरिएका लेखकहरूको पोस्ट मात्र फिल्टर गर्ने
    filtered = filtered.filter(
      (item) =>
        !item.author.isAnonymous &&
        followedAuthors.includes(item.author.id || item.author.alias),
    );
  } else {
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  // 3. Cursor-based Slicing
  const startIndex = cursor
    ? filtered.findIndex((item) => item.id === cursor) + 1
    : 0;

  const validStartIndex = startIndex >= 0 ? startIndex : 0;

  // लेखकलाई फलो गरिएको छ कि छैन (isFollowedByMe) सेट गर्ने
  const pageItems = filtered
    .slice(validStartIndex, validStartIndex + limit)
    .map((item) => ({
      ...item,
      author: {
        ...item.author,
        isFollowedByMe:
          !item.author.isAnonymous &&
          followedAuthors.includes(item.author.id || item.author.alias),
      },
    }));

  const nextItem = filtered[validStartIndex + limit];

  return {
    items: pageItems,
    nextCursor: nextItem ? (pageItems[pageItems.length - 1]?.id ?? null) : null,
    hasMore: Boolean(nextItem),
    total: filtered.length,
  };
}

/**
 * Optimistic Relate action (simulates POST /api/confessions/:id/relate)
 */
export async function toggleRelate(
  confessionId: string,
): Promise<{ relateCount: number; isRelatableByMe: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const index = confessionsStore.findIndex((c) => c.id === confessionId);
  if (index === -1) throw new Error("Confession not found");

  const item = confessionsStore[index];
  const nextState = !item.isRelatableByMe;
  const nextCount = item.relateCount + (nextState ? 1 : -1);

  confessionsStore[index] = {
    ...item,
    isRelatableByMe: nextState,
    relateCount: nextCount,
  };

  return {
    relateCount: nextCount,
    isRelatableByMe: nextState,
  };
}

/**
 * Optimistic Burn/Vent action (simulates POST /api/confessions/:id/burn)
 */
export async function toggleBurn(
  confessionId: string,
): Promise<{ burnCount: number; isBurnedByMe: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const index = confessionsStore.findIndex((c) => c.id === confessionId);
  if (index === -1) throw new Error("Confession not found");

  const item = confessionsStore[index];
  const nextState = !item.isBurnedByMe;
  const nextCount = item.burnCount + (nextState ? 1 : -1);

  confessionsStore[index] = {
    ...item,
    isBurnedByMe: nextState,
    burnCount: nextCount,
  };

  return {
    burnCount: nextCount,
    isBurnedByMe: nextState,
  };
}

/**
 * Local Append for New Vent (when user posts via composer)
 */
export async function createConfession(
  content: string,
  autoTags: string[],
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newPost = {
    id: `confession-${Date.now()}`,
    author: {
      alias: `Anonymous #${Math.floor(100 + Math.random() * 900)}`,
      isAnonymous: true,
    },
    content,
    tags: autoTags,
    relateCount: 0,
    burnCount: 0,
    echoCount: 0,
    isRelatableByMe: false,
    isBurnedByMe: false,
    createdAt: new Date().toISOString(),
  };

  confessionsStore = [newPost, ...confessionsStore];
}

/**
 * Append a new comment / echo to a confession
 */
export async function addComment(
  confessionId: string,
  content: string,
  authorAlias?: string,
): Promise<ConfessionComment> {
  // Simulate network latency (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  const index = confessionsStore.findIndex((c) => c.id === confessionId);
  if (index === -1) throw new Error("Confession not found");

  const confession = confessionsStore[index];

  const newComment: ConfessionComment = {
    id: `comment-${Date.now()}`,
    author: {
      alias:
        authorAlias || `Anonymous #${Math.floor(100 + Math.random() * 900)}`,
      isAnonymous: !authorAlias,
    },
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  const updatedComments = [newComment, ...(confession.comments || [])];

  confessionsStore[index] = {
    ...confession,
    comments: updatedComments,
    echoCount: (confession.echoCount || 0) + 1,
  };

  return newComment;
}

/**
 * Helper to get followed authors from localStorage
 */
export function getFollowedAuthorIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("fb_followed_authors");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Toggle follow/unfollow for a public author
 */
export async function toggleFollowAuthor(
  authorId: string,
): Promise<{ isFollowing: boolean }> {
  // Simulate network latency (200ms)
  await new Promise((resolve) => setTimeout(resolve, 200));

  const current = getFollowedAuthorIds();
  const isAlreadyFollowing = current.includes(authorId);
  const updated = isAlreadyFollowing
    ? current.filter((id) => id !== authorId)
    : [...current, authorId];

  if (typeof window !== "undefined") {
    localStorage.setItem("fb_followed_authors", JSON.stringify(updated));
  }

  return {
    isFollowing: !isAlreadyFollowing,
  };
}
