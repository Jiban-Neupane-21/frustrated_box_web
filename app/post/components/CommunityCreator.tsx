// app/post/components/CommunityCreator.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Check, X, AlertCircle, Lock, EyeOff } from "lucide-react";
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

const MIN_NAME = 3;
const MIN_SLUG = 3;
const MIN_DESC = 10;
const MAX_DESC = 180;

interface CommunityCreatorProps {
  communityData: CreateCommunityInput;
  onChange: (updates: Partial<CreateCommunityInput>) => void;
  /** Preview step मा जान बोलाइन्छ (create होइन) */
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

type SlugStatus = "idle" | "short" | "available" | "taken";

export function CommunityCreator({
  communityData,
  onChange,
  onSubmit,
  isSubmitting,
}: CommunityCreatorProps) {
  const { isAuthenticated } = useAuth();
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [isManualSlug, setIsManualSlug] = useState(false);

  // नाम परिवर्तन हुँदा Slug स्वतः अपडेट गर्ने
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const newSlug = isManualSlug ? communityData.slug : communityService.slugify(name);
    onChange({ name, slug: newSlug });
  };

  // Slug परिवर्तन हुँदा भ्यालिडेट गर्ने
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = communityService.slugify(e.target.value);
    // Slug पूरै मेटियो भने फेरि नामबाट स्वतः बन्ने बनाउने
    setIsManualSlug(clean.length > 0);
    onChange({ slug: clean });
  };

  // Slug उपलब्ध छ कि छैन जाँच्ने
  useEffect(() => {
    const slug = communityData.slug.trim();
    if (!slug) {
      setSlugStatus("idle");
      return;
    }
    if (slug.length < MIN_SLUG) {
      setSlugStatus("short");
      return;
    }
    setSlugStatus(communityService.isSlugTaken(slug) ? "taken" : "available");
  }, [communityData.slug]);

  const nameOk = communityData.name.trim().length >= MIN_NAME;
  const slugOk = slugStatus === "available";
  const descOk = communityData.description.trim().length >= MIN_DESC;
  const isFormValid = nameOk && slugOk && descOk && isAuthenticated;
  const canPreview = isFormValid && !isSubmitting;

  // बटन disable हुँदा किन भनेर बताउने
  const missing: string[] = [];
  if (!nameOk) missing.push(`a name (${MIN_NAME}+ characters)`);
  if (!slugOk) missing.push("an available URL");
  if (!descOk) missing.push(`a description (${MIN_DESC}+ characters)`);

  const inputBase =
    "w-full rounded-xl border border-zinc-800 bg-zinc-950 text-base text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500 sm:text-sm";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canPreview) onSubmit();
      }}
      className="flex flex-col gap-6"
    >
      {/* 0. Login warning */}
      {!isAuthenticated && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-800/60 bg-amber-950/40 p-3.5 text-sm text-amber-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div className="flex-1">
            <p className="font-bold">Log in to create a community</p>
            <p className="mt-0.5 text-xs text-amber-300/80">
              You become the owner and moderator of any community you create.
            </p>
            <Link
              href="/login"
              className="mt-2 inline-flex min-h-11 items-center font-bold text-white underline hover:text-amber-300"
            >
              Log in
            </Link>
          </div>
        </div>
      )}

      {/* 1. Name */}
      <div>
        <label htmlFor="community-name" className="mb-2 block text-sm font-semibold text-zinc-200">
          Community name <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="community-name"
          type="text"
          value={communityData.name}
          onChange={handleNameChange}
          placeholder="e.g. Midnight Overthinkers"
          maxLength={40}
          autoComplete="off"
          className={`${inputBase} min-h-12 px-3.5 py-2.5`}
        />
      </div>

      {/* 2. Slug */}
      <div>
        <label htmlFor="community-slug" className="mb-2 block text-sm font-semibold text-zinc-200">
          Community URL <span className="text-red-500" aria-hidden="true">*</span>
        </label>

        <div className="flex min-h-12 flex-wrap items-center gap-x-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
          <span className="shrink-0 text-sm text-zinc-500">frustratedbox.com/c/</span>
          <input
            id="community-slug"
            type="text"
            value={communityData.slug}
            onChange={handleSlugChange}
            placeholder="your-community"
            maxLength={30}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby="slug-help"
            className="min-w-[8rem] flex-1 bg-transparent py-1 text-base font-semibold text-amber-400 outline-none placeholder-zinc-700 sm:text-sm"
          />
        </div>

        <div id="slug-help" className="mt-1.5 min-h-5 text-xs" aria-live="polite">
          {slugStatus === "available" && (
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <Check className="h-3.5 w-3.5" /> This URL is available
            </span>
          )}
          {slugStatus === "taken" && (
            <span className="flex items-center gap-1 font-semibold text-red-400">
              <X className="h-3.5 w-3.5" /> This URL is taken. Try a different one.
            </span>
          )}
          {slugStatus === "short" && (
            <span className="text-zinc-400">Use at least {MIN_SLUG} characters.</span>
          )}
          {slugStatus === "idle" && (
            <span className="text-zinc-500">
              Letters, numbers and hyphens only. You can&apos;t change it later.
            </span>
          )}
        </div>
      </div>

      {/* 3. Category */}
      <div>
        <label htmlFor="community-category" className="mb-2 block text-sm font-semibold text-zinc-200">
          Main topic
        </label>
        <div className="relative">
          <select
            id="community-category"
            value={communityData.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className={`${inputBase} min-h-12 appearance-none py-2.5 pl-3.5 pr-10 font-medium`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500"
          >
            ▼
          </div>
        </div>
      </div>

      {/* 4. Description */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="community-description" className="text-sm font-semibold text-zinc-200">
            What is this community for? <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <span
            className={`font-mono text-xs ${
              communityData.description.length >= MAX_DESC ? "font-bold text-amber-400" : "text-zinc-500"
            }`}
          >
            {communityData.description.length} / {MAX_DESC}
          </span>
        </div>
        <textarea
          id="community-description"
          rows={4}
          value={communityData.description}
          onChange={(e) => onChange({ description: e.target.value })}
          maxLength={MAX_DESC}
          placeholder="Who belongs here? e.g. A safe place for engineers dealing with 80-hour work weeks."
          className={`${inputBase} min-h-28 resize-y p-3.5 leading-relaxed`}
        />
      </div>

      {/* 5. Privacy */}
      <fieldset className="flex flex-col gap-3 border-t border-zinc-800/80 pt-5">
        <legend className="mb-1 pr-2 text-sm font-semibold text-zinc-200">
          Privacy and rules
        </legend>

        <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
            <div>
              <p className="text-sm font-semibold text-zinc-200">Members-only posting</p>
              <p className="text-xs text-zinc-500">
                Only people who join can post. Everyone else can read.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={communityData.isRestricted || false}
            onChange={(e) => onChange({ isRestricted: e.target.checked })}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-amber-500"
          />
        </label>

        <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5">
          <div className="flex items-start gap-3">
            <EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
            <div>
              <p className="text-sm font-semibold text-zinc-200">Anonymous only</p>
              <p className="text-xs text-zinc-500">
                Member identities stay hidden. Nobody can post with their real name here.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={communityData.isAnonymousOnly || false}
            onChange={(e) => onChange({ isAnonymousOnly: e.target.checked })}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-amber-500"
          />
        </label>
      </fieldset>

      {/* 6. Preview button */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="submit"
          disabled={!canPreview}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-950/50 transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:ml-auto sm:w-auto sm:min-w-52"
        >
          <Eye className="h-4 w-4" />
          <span>Preview community</span>
        </button>
        {isAuthenticated && missing.length > 0 && (
          <p className="text-center text-xs text-zinc-500 sm:text-right">
            Still needed: {missing.join(", ")}.
          </p>
        )}
      </div>
    </form>
  );
}