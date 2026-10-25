// app/post/components/CommunityCreator.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Check,
  X,
  AlertCircle,
  Loader2,
  Lock,
  Globe,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { CreateCommunityInput } from "@/types/create";
import { communityService } from "@/lib/communityService";
import { useAuth } from "@/components/AuthContext";

export const CATEGORIES = [
  { id: "tech", label: "Tech & Coding" },
  { id: "corporate", label: "Corporate & Work" },
  { id: "dating", label: "Heartbreak & Dating" },
  { id: "college", label: "Campus & Exams" },
  { id: "creative", label: "Design & Arts" },
  { id: "general", label: "General Vents" },
];

interface CommunityCreatorProps {
  communityData: CreateCommunityInput;
  onChange: (updates: Partial<CreateCommunityInput>) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export function CommunityCreator({
  communityData,
  onChange,
  onSubmit,
  isSubmitting,
}: CommunityCreatorProps) {
  const { isAuthenticated, user } = useAuth();
  const [slugStatus, setSlugStatus] = useState<"idle" | "available" | "taken">("idle");
  const [isManualSlug, setIsManualSlug] = useState(false);

  // नाम परिवर्तन हुँदा Slug स्वतः अपडेट गर्ने
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const newSlug = isManualSlug
      ? communityData.slug
      : communityService.slugify(name);

    onChange({ name, slug: newSlug });
  };

  // Slug परिवर्तन हुँदा भ्यालिडेट गर्ने
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsManualSlug(true);
    const clean = communityService.slugify(e.target.value);
    onChange({ slug: clean });
  };

  // Slug उपलब्ध छ कि छैन Real-time जाँच्ने
  useEffect(() => {
    if (!communityData.slug.trim()) {
      setSlugStatus("idle");
      return;
    }
    const taken = communityService.isSlugTaken(communityData.slug);
    setSlugStatus(taken ? "taken" : "available");
  }, [communityData.slug]);

  const isFormValid =
    communityData.name.trim().length >= 3 &&
    communityData.slug.trim().length >= 3 &&
    slugStatus === "available" &&
    communityData.description.trim().length >= 10 &&
    isAuthenticated;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isFormValid) onSubmit();
      }}
      className="flex flex-col gap-5"
    >
      {/* 0. Guest Login Warning if not authenticated */}
      {!isAuthenticated && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-800/60 bg-amber-950/40 p-3.5 text-xs text-amber-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Authentication Required</p>
            <p className="mt-0.5 text-amber-300/80">
              You must be logged in to create a community and become its Owner/Moderator.
            </p>
            <Link
              href="/login"
              className="mt-2 inline-flex items-center gap-1 font-bold text-white underline hover:text-amber-300"
            >
              Sign in now →
            </Link>
          </div>
        </div>
      )}

      {/* 1. Community Name */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
          Community Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={communityData.name}
          onChange={handleNameChange}
          placeholder="e.g. Midnight Overthinkers, Freelance Hell"
          maxLength={40}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {/* 2. Community Slug & URL Preview */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300">
            Community URL Identifier (Slug) <span className="text-red-500">*</span>
          </label>
          {slugStatus === "available" && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              <span>Available</span>
            </span>
          )}
          {slugStatus === "taken" && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-red-400">
              <X className="h-3.5 w-3.5" />
              <span>Slug already taken</span>
            </span>
          )}
        </div>

        <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2">
          <span className="text-xs font-medium text-zinc-500 shrink-0">
            frustratedbox.com/c/
          </span>
          <input
            type="text"
            value={communityData.slug}
            onChange={handleSlugChange}
            placeholder="slug-name"
            maxLength={30}
            className="w-full bg-transparent text-xs font-semibold text-amber-400 outline-none"
          />
        </div>
        <p className="mt-1 text-[10px] text-zinc-500">
          Letters, numbers, and hyphens only. Permanent URL after creation.
        </p>
      </div>

      {/* 3. Category */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
          Primary Topic / Category
        </label>
        <select
          value={communityData.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs font-medium text-zinc-200 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Description */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
          Community Mission / Description <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          value={communityData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          maxLength={180}
          placeholder="What is this space for? Who belongs here? (e.g., A safe haven for software engineers suffering from 80-hour work weeks...)"
          className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs leading-relaxed text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
        <div className="text-right text-[10px] text-zinc-600">
          {communityData.description.length} / 180
        </div>
      </div>

      {/* 5. Moderation & Privacy Settings */}
      <div className="flex flex-col gap-2.5 border-t border-zinc-800/80 pt-4">
        <label className="text-xs font-semibold text-zinc-300">
          Community Privacy & Rules
        </label>

        {/* Restricted toggle */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
          <div className="flex items-center gap-2.5">
            <Lock className="h-4 w-4 text-zinc-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-zinc-200">
                Restricted Posting
              </p>
              <p className="text-[10px] text-zinc-500">
                Only joined members can post vents. Non-members can only read.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={communityData.isRestricted || false}
            onChange={(e) => onChange({ isRestricted: e.target.checked })}
            className="h-4 w-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {/* Anonymous Only toggle */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
          <div className="flex items-center gap-2.5">
            <EyeOff className="h-4 w-4 text-zinc-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-zinc-200">
                Strict Anonymous-Only Space
              </p>
              <p className="text-[10px] text-zinc-500">
                Hide member identities entirely. Nobody can reveal their real name here.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={communityData.isAnonymousOnly || false}
            onChange={(e) => onChange({ isAnonymousOnly: e.target.checked })}
            className="h-4 w-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* 6. Action Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-950/50 transition hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Founding Space...</span>
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              <span>Claim & Launch Community 🛡️</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}