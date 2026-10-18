export interface ExplorePost {
  id: string;
  author: string;
  authorTag: string;
  avatarSeed: string;
  content: string;
  moodId: string;
  moodLabel: string;
  createdAt: string;
  relateCount: number;
  burnCount: number;
  commentCount: number;
  isSensitive?: boolean;
  tags?: string[];
}

export interface ExploreShelf {
  id: string;
  title: string;
  icon: string;
  moodId?: string;
  sort?: DiscoveryTabType;
  posts: ExplorePost[];
}

export interface ExploreShelvesResponse {
  spotlight?: SpotlightItem;
  shelves: ExploreShelf[];
}

export interface SpotlightItem {
  id: string;
  author: string;
  content: string;
  moodTag: string;
  relateCount: number;
  burnCount: number;
  commentCount: number;
}

export interface MoodOption {
  id: string;
  label: string;
  icon?: string;
}

export type DiscoveryTabType =
  | "top-burned"
  | "top-relatable"
  | "top-echoed"
  | "latest"
  | "random-viral";

// १. खोज्न मिल्ने कम्युनिटीको संरचना
export interface SearchCommunity {
  id: string;
  name: string;
  slug: string;
  description: string;
  membersCount: number;
  initials: string;
  isJoined?: boolean;
}

// २. खोज्न मिल्ने लेखक/व्यक्तिको संरचना
export interface SearchUser {
  id: string;
  alias: string;
  username: string;
  bio?: string;
  totalBurnsReceived: number;
  postCount: number;
  isFollowing?: boolean;
}

// Search modes decided by the first character of the query:
//   "#word"  -> hashtag (posts only)
//   "@name"  -> username (people only)
//   "text"   -> keyword (communities + confession posts)
export type SearchMode = "text" | "hashtag" | "username";

// ३. सर्च ट्याब्स (Facebook/Twitter जस्तै)
export type SearchCategoryTab = "all" | "posts" | "people" | "communities";

// ४. प्याजिनेसन रेस्पोन्स इन्टरफेस
export interface PaginatedExploreResponse {
  posts: ExplorePost[];
  totalCount: number;
  hasMore: boolean;
  nextPage: number;
}

// ५. मल्टि-एन्टिटी सर्च रिजल्ट
export interface OmniSearchResult {
  posts: ExplorePost[];
  people: SearchUser[];
  communities: SearchCommunity[];
  totalPosts: number;
}


// ६. कम्युनिटी लिस्ट (random preview / all communities)
export interface PaginatedCommunitiesResponse {
  communities: SearchCommunity[];
  totalCount: number;
  hasMore: boolean;
  nextPage: number;
}