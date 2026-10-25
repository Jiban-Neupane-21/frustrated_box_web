// types/create.ts

// १. पेजरको सक्रिय ट्याब (Vent कि Community)
export type CreateTabMode = "vent" | "community";

// २. मुड / इमोसन प्रकारहरू
export type VentMood =
  | "burnout"
  | "heartbreak"
  | "corporate"
  | "mask"
  | "chaos"
  | "general";

export interface MoodOption {
  id: VentMood;
  label: string;
  icon: string; 
  colorClass: string;
}

// ३. Post / Vent सिर्जना गर्दा चाहिने डेटा
export interface CreateVentInput {
  content: string;
  mood: VentMood;
  tags: string[];
  communitySlug?: string | null; // खाली भए Global Feed मा जान्छ
  isAnonymous: boolean; // true भए Anonymous #XXX, false भए आफ्नो प्रोफाइल
  isSensitive?: boolean; // trigger warning / blur
}

// ४. नयाँ Community सिर्जना गर्दा चाहिने डेटा
export interface CreateCommunityInput {
  name: string;
  slug: string; // url-friendly, unique
  description: string;
  category: string;
  rules?: string[];
  isRestricted?: boolean; // केवल सदस्यले मात्र पोस्ट गर्न पाउने
  isAnonymousOnly?: boolean; // सबै पोस्ट अनिवार्य अनाम हुनुपर्ने
  accentColor?: string;
}