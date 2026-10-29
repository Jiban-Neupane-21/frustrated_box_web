import { MOCK_CONFESSIONS } from "./mockData";
import {
  FeedQueryParams,
  PaginatedFeedResponse,
  ConfessionComment,
} from "./types";

// In-memory mutable store so user likes/burns persist across pagination in the current session
// Reload गर्दा नयाँ random order — pure client-side store
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Session शुरु हुँदा एकपटक shuffle — IDs consistent रहन्छन्
// Base data — नछुने
const baseConfessions = [...MOCK_CONFESSIONS];

// नयाँ थपिएका posts (session भित्र)
const newPosts: (typeof MOCK_CONFESSIONS)[number][] = [];

// हरेक fresh fetch को लागि current order
let currentSessionOrder: (typeof MOCK_CONFESSIONS)[number][] = [];
let confessionsStore = baseConfessions; // legacy reference (likes/burns को लागि)

// Store sync helper
function updateConfessionInStores(
  id: string,
  updater: (
    item: (typeof MOCK_CONFESSIONS)[number],
  ) => (typeof MOCK_CONFESSIONS)[number],
) {
  const apply = (arr: (typeof MOCK_CONFESSIONS)[number][]) => {
    const idx = arr.findIndex((c) => c.id === id);
    if (idx !== -1) arr[idx] = updater(arr[idx]);
  };
  apply(confessionsStore);
  apply(currentSessionOrder);
  apply(newPosts);
}

/**
 * Fetch paginated confessions stream (simulates Hono GET /api/confessions)
 */
export async function fetchFeed(
  params: FeedQueryParams = {},
): Promise<PaginatedFeedResponse> {
  const {
    limit = 5,
    cursor = null,
    sort = "for_you",
    tag = null,
    community = null,
  } = params; // Simulate network latency (450ms) to test loading skeletons
  await new Promise((resolve) => setTimeout(resolve, 450));

  // cursor नभएमा (fresh load / refresh) → नयाँ random shuffle गर्ने
  if (!cursor) {
    currentSessionOrder = [...newPosts, ...shuffleArray(baseConfessions)];
  }

  let filtered = [...currentSessionOrder];

  // 1. Dynamic Organic Tag Filter (e.g., #overtime, #exams)
  if (tag) {
    const normalizedTag = tag.replace(/^#/, "").toLowerCase().trim();
    filtered = filtered.filter((item) =>
      item.tags.some((t) => t.toLowerCase() === normalizedTag),
    );
  }

  // 1b. Community Filter (e.g., /c/tech-life)
  if (community) {
    filtered = filtered.filter((item) => item.communitySlug === community);
  }

  // 2. Sorting & Following Filter Logic
  const followedAuthors = getFollowedAuthorIds();

  if (sort === "following") {
    // 🔒 केवल अनाम नभएका र फलो गरिएका लेखकहरूको पोस्ट मात्र फिल्टर गर्ने र नयाँ पहिला देखाउने
    filtered = filtered
      .filter(
        (item) =>
          !item.author.isAnonymous &&
          followedAuthors.includes(item.author.id || item.author.alias),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
  // 👈 Note: "for_you" को लागि shuffle गरिएको random order नै कायम रहन्छ!
  // मिति (createdAt) ले override गर्दैन, जसले गर्दा हरेक refresh मा नयाँ र्यान्डम पोस्टहरू देखिन्छन्।

  // 3. Cursor-based Slicing on `filtered`
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

  updateConfessionInStores(confessionId, (c) => ({
    ...c,
    isRelatableByMe: nextState,
    relateCount: nextCount,
  }));

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

  updateConfessionInStores(confessionId, (c) => ({
    ...c,
    isBurnedByMe: nextState,
    burnCount: nextCount,
  }));

  return {
    burnCount: nextCount,
    isBurnedByMe: nextState,
  };
}

/**
 * Local Append for New Vent (when user posts via composer)
 */
/**
 * Local Append for New Vent (when user posts via composer)
 */
export async function createConfession(
  content: string,
  autoTags: string[],
  options?: {
    alias?: string;
    isAnonymous?: boolean;
    authorId?: string;
    communitySlug?: string | null;
  },
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const isAnon = options?.isAnonymous ?? true;
  const authorAlias = isAnon
    ? `Anonymous #${Math.floor(100 + Math.random() * 900)}`
    : options?.alias || "Anonymous";

  const newPost = {
    id: `confession-${Date.now()}`,
    author: {
      id: isAnon ? undefined : options?.authorId,
      alias: authorAlias,
      isAnonymous: isAnon,
    },
    content,
    tags: autoTags,
    communitySlug: options?.communitySlug ?? null, // 👈 yo matra naya line

    relateCount: 0,
    burnCount: 0,
    echoCount: 0,
    isRelatableByMe: false,
    isBurnedByMe: false,
    createdAt: new Date().toISOString(),
  };

  newPosts.unshift(newPost as (typeof MOCK_CONFESSIONS)[number]);
  confessionsStore = [newPost, ...confessionsStore];
  currentSessionOrder = [
    newPost as (typeof MOCK_CONFESSIONS)[number],
    ...currentSessionOrder,
  ];
}

/**
 * Append a new comment or reply to an existing comment
 */
export async function addComment(
  confessionId: string,
  content: string,
  authorAlias?: string,
  parentId?: string,
  replyToAlias?: string,
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
    ...(parentId ? { parentId, replyToAlias } : {}),
  };

  let updatedComments: ConfessionComment[];

  if (parentId) {
    // 💬 यदि रिप्लाई हो भने प्यारेन्ट कमेन्ट भित्रको `replies` एरेमा थप्ने:
    updatedComments = (confession.comments || []).map((c) => {
      if (c.id === parentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newComment],
        };
      }
      return c;
    });
  } else {
    // 💬 साधारण नयाँ कमेन्ट हो भने मुख्य लिस्टको सुरुमा थप्ने:
    updatedComments = [newComment, ...(confession.comments || [])];
  }

  updateConfessionInStores(confessionId, (c) => ({
    ...c,
    comments: updatedComments,
    echoCount: (c.echoCount || 0) + 1,
  }));

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
