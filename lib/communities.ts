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

export type CommunityCategory =
  | "Work"
  | "Tech"
  | "Creative"
  | "Mental Health"
  | "Relationships"
  | "Education"
  | "Lifestyle";

export interface CommunityMeta {
  slug: string;              // CommunitySlug thiyo -> string
  name: string;
  description: string;
  category: CommunityCategory | string; // custom ko lagi string pani
  membersCount: number;
  initials: string;
  accentColor: string;
  rules: string[];
  isRestricted: boolean;
  isAnonymousOnly?: boolean; // naya
  isCustom?: boolean;        // naya: default vs custom chinna
}

// Record<CommunitySlug, ...> le 7 wota sabai force garcha
export const COMMUNITIES: Record<CommunitySlug, CommunityMeta> = {
  "tech-life": {
    slug: "tech-life",
    name: "Tech Life",
    description: "Burnout, bugs, and the quiet side of working in tech.",
    category: "Tech",
    membersCount: 12420,
    initials: "TL",
    accentColor: "#3B82F6",
    rules: ["Be kind", "No doxxing", "No recruiter spam"],
    isRestricted: false,
  },
  "corporate-cage": {
    slug: "corporate-cage",
    name: "Corporate Cage",
    description: "Vent about toxic bosses, long hours, and office politics.",
    category: "Work",
    membersCount: 8300,
    initials: "CC",
    accentColor: "#EF4444",
    rules: ["Don't name your company", "Be kind", "No harassment"],
    isRestricted: false,
  },
  "midnight-designers": {
    slug: "midnight-designers",
    name: "Midnight Designers",
    description: "Creative block, client stress, and late-night design thoughts.",
    category: "Creative",
    membersCount: 3150,
    initials: "MD",
    accentColor: "#A855F7",
    rules: ["Be kind", "No self-promo", "Constructive feedback only"],
    isRestricted: false,
  },
  "midnight-thoughts": {
    slug: "midnight-thoughts",
    name: "Midnight Thoughts",
    description: "Things you can't say out loud at 3 AM.",
    category: "Mental Health",
    membersCount: 9800,
    initials: "MT",
    accentColor: "#6366F1",
    rules: ["Be gentle", "No medical advice", "Reach out if you're in crisis"],
    isRestricted: false,
  },
  "heartbreak-hotel": {
    slug: "heartbreak-hotel",
    name: "Heartbreak Hotel",
    description: "Breakups, situationships, and healing together.",
    category: "Relationships",
    membersCount: 6700,
    initials: "HH",
    accentColor: "#EC4899",
    rules: ["No naming exes", "Be supportive", "No harassment"],
    isRestricted: false,
  },
  "academic-chaos": {
    slug: "academic-chaos",
    name: "Academic Chaos",
    description: "Deadlines, exams, thesis stress, and survival tips.",
    category: "Education",
    membersCount: 5400,
    initials: "AC",
    accentColor: "#F59E0B",
    rules: ["No cheating requests", "Be kind", "Share what helps"],
    isRestricted: false,
  },
  "happy-mask": {
    slug: "happy-mask",
    name: "Happy Mask",
    description: "For when you're smiling outside and struggling inside.",
    category: "Lifestyle",
    membersCount: 4200,
    initials: "HM",
    accentColor: "#10B981",
    rules: ["Be real", "Be kind", "No toxic positivity"],
    isRestricted: false,
  },
};

export function getDefaultCommunities(): CommunityMeta[] {
  return COMMUNITY_SLUGS.map((slug) => COMMUNITIES[slug]);
}

export function getCommunityBySlug(slug: string): CommunityMeta | undefined {
  return (COMMUNITIES as Record<string, CommunityMeta>)[slug];
}

export function isDefaultSlug(slug: string): slug is CommunitySlug {
  return (COMMUNITY_SLUGS as readonly string[]).includes(slug);
}