// app/post/components/VentComposer.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Globe,
  Users,
  EyeOff,
  User,
  AlertTriangle,
  Loader2,
  Send,
  Hash,
} from "lucide-react";
import { CreateVentInput, VentMood, MoodOption } from "@/types/create";
import { communityService } from "@/lib/communityService";
import { useAuth } from "@/components/AuthContext";

export const MOOD_OPTIONS: MoodOption[] = [
  { id: "burnout", label: "Burnout", icon: "🔥", colorClass: "border-red-900/60 bg-red-950/40 text-red-400" },
  { id: "corporate", label: "Corporate", icon: "🥱", colorClass: "border-amber-900/60 bg-amber-950/40 text-amber-400" },
  { id: "heartbreak", label: "Heartbreak", icon: "💔", colorClass: "border-pink-900/60 bg-pink-950/40 text-pink-400" },
  { id: "chaos", label: "Late Chaos", icon: "🌧️", colorClass: "border-blue-900/60 bg-blue-950/40 text-blue-400" },
  { id: "mask", label: "Happy Mask", icon: "🎭", colorClass: "border-purple-900/60 bg-purple-950/40 text-purple-400" },
  { id: "general", label: "Raw Vent", icon: "💭", colorClass: "border-zinc-800 bg-zinc-900 text-zinc-300" },
];

interface VentComposerProps {
  ventData: CreateVentInput;
  onChange: (updates: Partial<CreateVentInput>) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export function VentComposer({
  ventData,
  onChange,
  onSubmit,
  isSubmitting,
}: VentComposerProps) {
  const { user, isAuthenticated } = useAuth();
  const [communities, setCommunities] = useState<{ name: string; slug: string }[]>([]);
  const [tagInput, setTagInput] = useState("");

  const maxChars = 5000;
  const currentChars = ventData.content.length;
  const charsRemaining = maxChars - currentChars;

  // कम्युनिटीहरूको सूची लोड गर्ने
  useEffect(() => {
    setCommunities(communityService.getAllCommunityOptions());
  }, []);

  // Textarea मा टाइप गर्दा स्वचालित रूपमा #tags पत्ता लगाउने
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length > maxChars) return;

    // टेक्स्ट भित्र #word खोज्ने
    const extractedTags = Array.from(
      new Set(
        (text.match(/#[a-zA-Z0-9_]+/g) || []).map((t) => t.toLowerCase())
      )
    );

    onChange({ content: text, tags: extractedTags });
  };

  // छुट्टै ट्याग थप्ने इन्टर बटनमा
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().startsWith("#")
        ? tagInput.trim().toLowerCase()
        : `#${tagInput.trim().toLowerCase()}`;

      if (!ventData.tags.includes(clean)) {
        onChange({ tags: [...ventData.tags, clean] });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange({ tags: ventData.tags.filter((t) => t !== tagToRemove) });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-5"
    >
      {/* 1. Destination (Global vs Community) */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
          Post Destination
        </label>
        <div className="relative">
          <select
            value={ventData.communitySlug || ""}
            onChange={(e) =>
              onChange({ communitySlug: e.target.value || null })
            }
            className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs font-medium text-zinc-200 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600"
          >
            <option value="">🌐 Global Public Feed (Visible to Everyone)</option>
            {communities.map((comm) => (
              <option key={comm.slug} value={comm.slug}>
                👥 c/{comm.slug} — {comm.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* 2. Identity Mode (Anonymous vs Public Profile) */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
          Venting Identity
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ isAnonymous: true })}
            className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition cursor-pointer ${
              ventData.isAnonymous
                ? "border-red-600/80 bg-red-950/40 text-red-200 shadow-sm"
                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            <EyeOff className="h-4 w-4 text-red-400" />
            <span>Anonymous Vent</span>
          </button>

          <button
            type="button"
            disabled={!isAuthenticated}
            onClick={() => {
              if (isAuthenticated) onChange({ isAnonymous: false });
            }}
            title={!isAuthenticated ? "Log in to post with your public profile" : ""}
            className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition cursor-pointer ${
              !ventData.isAnonymous
                ? "border-red-600/80 bg-red-950/40 text-red-200 shadow-sm"
                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <User className="h-4 w-4 text-zinc-400" />
            <span>
              {isAuthenticated ? `@${user?.username}` : "Public Profile (Login req.)"}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Mood Selection */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
          Select Mood / Frustration Type
        </label>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = ventData.mood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => onChange({ mood: mood.id })}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? `${mood.colorClass} border-current ring-1 ring-current font-bold`
                    : "border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <span>{mood.icon}</span>
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Vent Content Textarea */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300">
            What is frustrating you?
          </label>
          <span
            className={`text-[11px] font-mono ${
              charsRemaining < 50
                ? "text-red-400 font-bold"
                : charsRemaining < 100
                ? "text-amber-400"
                : "text-zinc-500"
            }`}
          >
            {currentChars} / {maxChars}
          </span>
        </div>
        <textarea
          rows={5}
          value={ventData.content}
          onChange={handleContentChange}
          placeholder="Unload your stress, toxic workplace drama, or midnight thoughts. Don't mention real phone numbers or personal dox..."
          className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-sm leading-relaxed text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-red-600 focus:ring-1 focus:ring-red-600"
        />
      </div>

      {/* 5. Dynamic Tags (#tags) */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-300">
          Organic Tags
        </label>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 p-2">
          {ventData.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1 text-[11px] font-medium text-red-400"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-zinc-500 hover:text-red-300 cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
          <div className="flex items-center gap-1 text-zinc-500 px-1">
            <Hash className="h-3 w-3" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag and press Enter"
              className="bg-transparent text-xs text-zinc-200 placeholder-zinc-600 outline-none w-36"
            />
          </div>
        </div>
      </div>

      {/* 6. Sensitivity Toggle */}
      <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-zinc-200">
              Content Warning (Blur on Feed)
            </p>
            <p className="text-[10px] text-zinc-500">
              For heavy emotional rants or triggering topics.
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={ventData.isSensitive || false}
          onChange={(e) => onChange({ isSensitive: e.target.checked })}
          className="h-4 w-4 accent-red-600 rounded cursor-pointer"
        />
      </div>

      {/* 7. Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={!ventData.content.trim() || isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 transition hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Release Vent 🔥</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}