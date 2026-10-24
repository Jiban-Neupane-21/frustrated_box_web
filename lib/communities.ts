 export const COMMUNITY_SLUGS = [
    "tech-life",
    "corporate-cage",
    "midnight-designers",
    "midnight-thoughts",
    "heartbreak-hotel",
    "academic-chaos",
    "happy-mask",
  ] as const;

  export type CommunitySlug = (typeof COMMUNITY_SLUGS)[number];
  