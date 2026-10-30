"use client";

import React from "react";
import { EyeOff, User, Eye, Users } from "lucide-react";
import { CreateVentInput } from "@/types/create";
import { useAuth } from "@/components/AuthContext";
import { getDefaultCommunities } from "@/lib/communities";

const TAG_REGEX = /#[a-zA-Z0-9_]+/g;
const MAX_TAGS = 10;
const MAX_CHARS = 5000;

interface VentComposerProps {
  ventData: CreateVentInput;
  onChange: (updates: Partial<CreateVentInput>) => void;
  /** Preview step मा जान बोलाइन्छ (publish होइन) */
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

// Content भित्रका #tags स्वतः निकाल्ने
function extractTags(text: string): string[] {
  return Array.from(
    new Set((text.match(TAG_REGEX) || []).map((t) => t.toLowerCase()))
  ).slice(0, MAX_TAGS);
}

export function VentComposer({
  ventData,
  onChange,
  onSubmit,
  isSubmitting,
}: VentComposerProps) {
  const { user, isAuthenticated } = useAuth();
  const communities = getDefaultCommunities();

  const currentChars = ventData.content.length;
  const charsRemaining = MAX_CHARS - currentChars;
  const canPreview = ventData.content.trim().length > 0 && !isSubmitting;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length > MAX_CHARS) return;
    onChange({ content: text, tags: extractTags(text) });
  };

  const counterClass =
    charsRemaining < 50
      ? "text-red-400 font-bold"
      : charsRemaining < 500
      ? "text-amber-400"
      : "text-zinc-500";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canPreview) onSubmit();
      }}
      className="flex flex-col gap-6"
    >
      {/* 1. Identity */}
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-zinc-200">Post as</legend>
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
          <button
            type="button"
            aria-pressed={ventData.isAnonymous}
            onClick={() => onChange({ isAnonymous: true })}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition cursor-pointer ${
              ventData.isAnonymous
                ? "border-red-600/80 bg-red-950/40 text-red-200 shadow-sm"
                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            <EyeOff className="h-4 w-4 shrink-0 text-red-400" />
            <span>Anonymous</span>
          </button>

          <button
            type="button"
            aria-pressed={!ventData.isAnonymous}
            disabled={!isAuthenticated}
            onClick={() => {
              if (isAuthenticated) onChange({ isAnonymous: false });
            }}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
              !ventData.isAnonymous
                ? "border-red-600/80 bg-red-950/40 text-red-200 shadow-sm"
                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            } ${!isAuthenticated ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          >
            <User className="h-4 w-4 shrink-0 text-zinc-400" />
            <span className="truncate">
              {isAuthenticated ? `@${user?.username}` : "My profile"}
            </span>
          </button>
        </div>
        {!isAuthenticated && (
          <p className="mt-2 text-xs text-zinc-500">
            Log in to post with your public profile.
          </p>
        )}
      </fieldset>

      {/* 2. Select Community (Optional) */}
      <div>
        <label htmlFor="vent-community" className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-200">
          <Users className="h-4 w-4 text-red-500" />
          <span>Post to a Community (Optional)</span>
        </label>
        <select
          id="vent-community"
          value={ventData.communitySlug || ""}
          onChange={(e) => onChange({ communitySlug: e.target.value || null })}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-200 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600"
        >
          <option value="">Global Public Feed (No Community)</option>
          {communities.map((c) => (
            <option key={c.slug} value={c.slug}>
              c/{c.slug} — {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Content */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor="vent-content" className="text-sm font-semibold text-zinc-200">
            What is frustrating you?
          </label>
          <span className={`font-mono text-xs ${counterClass}`} aria-live="polite">
            {currentChars} / {MAX_CHARS}
          </span>
        </div>
        <textarea
          id="vent-content"
          rows={7}
          value={ventData.content}
          onChange={handleContentChange}
          placeholder="Let it out. Please don't include phone numbers, real names or addresses."
          className="min-h-40 w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-base leading-relaxed text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600 sm:text-sm"
        />
        <p className="mt-1.5 text-xs text-zinc-500">
          Tip: type #work or #exams inside your vent and it becomes a tag.
        </p>
      </div>

      {/* 4. Preview button */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="submit"
          disabled={!canPreview}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/50 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:ml-auto sm:w-auto sm:min-w-48"
        >
          <Eye className="h-4 w-4" />
          <span>Preview vent</span>
        </button>
        {!ventData.content.trim() && (
          <p className="text-center text-xs text-zinc-500 sm:text-right">
            Write something to enable the preview.
          </p>
        )}
      </div>
    </form>
  );
}