// lib/communityService.ts
import { COMMUNITY_SLUGS, getDefaultCommunities, type CommunityMeta } from "@/lib/communities";
import { CreateCommunityInput } from "@/types/create";
import { ManagedCommunity } from "@/types/auth";

export interface CommunityRecord extends CreateCommunityInput {
  id: string;
  createdAt: string;
  ownerId: string;
  membersCount: number;
}

const STORAGE_KEY = "fb_custom_communities";
const JOINED_KEY = "fb_joined_communities";
export const JOINED_EVENT = "fb_joined_changed";

export const communityService = {
  // १. नामबाट सफा URL Slug बनाउने (e.g. "Dev Life!" -> "dev-life")
  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // विशेष क्यारेक्टर हटाउने
      .replace(/[\s_-]+/g, "-") // स्पेसलाई हाइफन बनाउने
      .replace(/^-+|-+$/g, ""); // सुरु र अन्त्यको हाइफन हटाउने
  },

  // २. LocalStorage बाट सेभ गरिएका कम्युनिटीहरू ल्याउने
  getCustomCommunities: (): CommunityRecord[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // ३. Slug पहिले नै लिइसकिएको छ कि छैन जाँच्ने
  isSlugTaken: (slug: string): boolean => {
    const cleanSlug = slug.toLowerCase().trim();
    // क. डिफल्ट कम्युनिटीहरूसँग जाँच्ने
    const isDefault = (COMMUNITY_SLUGS as readonly string[]).includes(cleanSlug);
    if (isDefault) return true;

    // ख. प्रयोगकर्ताले बनाएका नयाँ कम्युनिटीहरूसँग जाँच्ने
    const custom = communityService.getCustomCommunities();
    return custom.some((c) => c.slug.toLowerCase() === cleanSlug);
  },

  // ४. नयाँ Community सेभ गर्ने
  createCommunity: async (
    input: CreateCommunityInput,
    ownerId: string
  ): Promise<{ community: CommunityRecord; managedRecord: ManagedCommunity }> => {
    // सिमुलेटेड नेटवर्क ढिलाइ (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanSlug = communityService.slugify(input.slug || input.name);

    if (communityService.isSlugTaken(cleanSlug)) {
      throw new Error(`The slug "c/${cleanSlug}" is already taken. Please choose another.`);
    }

    const newCommunity: CommunityRecord = {
      ...input,
      id: `comm_${Date.now()}`,
      slug: cleanSlug,
      ownerId,
      membersCount: 1,
      createdAt: new Date().toISOString(),
    };

    // LocalStorage मा थप्ने
    const existing = communityService.getCustomCommunities();
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newCommunity]));
    }

    // Sidebar र AuthContext का लागि ManagedCommunity ढाँचा
    const managedRecord: ManagedCommunity = {
      id: newCommunity.id,
      name: newCommunity.name,
      slug: newCommunity.slug,
      role: "owner",
      pendingReportsCount: 0,
    };

    return { community: newCommunity, managedRecord };
  },


    // ६. Custom record -> CommunityMeta (default sanga same shape)
  toMeta: (c: CommunityRecord): CommunityMeta => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    category: c.category,
    membersCount: c.membersCount,
    initials: c.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join(""),
    accentColor: c.accentColor ?? "#6B7280",
    rules: c.rules ?? [],
    isRestricted: c.isRestricted ?? false,
    isAnonymousOnly: c.isAnonymousOnly ?? false,
    isCustom: true,
  }),

  // ७. Default + Custom merge
  getAllCommunities: (): CommunityMeta[] => {
    const custom = communityService
      .getCustomCommunities()
      .map(communityService.toMeta);
    return [...getDefaultCommunities(), ...custom];
  },

  // ८. Slug bata euta community (default pahile, tespachi custom)
  getCommunityBySlug: (slug: string): CommunityMeta | undefined => {
    const clean = slug.toLowerCase().trim();
    return communityService.getAllCommunities().find((c) => c.slug === clean);
  },


    // 9. Joined slugs
  getJoinedSlugs: (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(JOINED_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isJoined: (slug: string): boolean =>
    communityService.getJoinedSlugs().includes(slug),

  // Join/Leave toggle, naya state return garcha
  toggleJoin: (slug: string): boolean => {
    const current = communityService.getJoinedSlugs();
    const nowJoined = !current.includes(slug);
    const next = nowJoined
      ? [...current, slug]
      : current.filter((s) => s !== slug);

    if (typeof window !== "undefined") {
      localStorage.setItem(JOINED_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(JOINED_EVENT)); // sidebar lai sync garna
    }
    return nowJoined;
  },

  
  // ५ (replace). Dropdown options, aba real name bata
  getAllCommunityOptions: (): { name: string; slug: string }[] =>
    communityService
      .getAllCommunities()
      .map((c) => ({ name: c.name, slug: c.slug })),
};
