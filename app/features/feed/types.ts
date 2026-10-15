export interface ConfessionAuthor {
  id?: string;
  alias: string; // e.g. "Anonymous #402"
  isAnonymous: boolean;
  avatarSeed?: string; // seed for deterministic avatar/initials
  isFollowedByMe?: boolean;
}

// नयाँ कमेन्ट इन्टरफेस
export interface ConfessionComment {
  id: string;
  author: ConfessionAuthor;
  content: string;
  createdAt: string;
}

export interface Confession {
  id: string;
  author: ConfessionAuthor;
  content: string;
  tags: string[]; // dynamic organic tags (#overtime, #exams, #breakup)
  semanticCluster?: string; // auto-detected cluster (e.g. workplace-burnout)
  relateCount: number; // how many resonated with this
  burnCount: number; // interactive vent/burn count
  echoCount: number; // comments/replies count
  isRelatableByMe: boolean; // current user reaction state
  isBurnedByMe: boolean;
  createdAt: string; // ISO timestamp
  comments?: ConfessionComment[]; // कमेन्टहरू हेर्नका लागि (optional)
}

export type FeedSortOption = "for_you" | "following";

export interface FeedQueryParams {
  limit?: number;
  cursor?: string | null;
  sort?: FeedSortOption;
  tag?: string | null; // optional filter by organic tag
}

export interface PaginatedFeedResponse {
  items: Confession[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}
