"use client";

import React, { useState } from "react";
import {
  Sparkles,
  X,
  HeartHandshake,
  Flame,
  MessageSquare,
} from "lucide-react";

export interface SpotlightItem {
  id: string;
  author: string;
  content: string;
  moodTag: string;
  relateCount: number;
  burnCount: number;
  commentCount: number;
}

interface SpotlightCardProps {
  spotlight?: SpotlightItem;
}

// Temporary fallback mock if not passed via props
const DEFAULT_SPOTLIGHT: SpotlightItem = {
  id: "spotlight-1",
  author: "Anonymous_404",
  content:
    "I survived another meeting that could have literally just been a 2-sentence Slack message. Why are we like this?",
  moodTag: "Work & Burnout",
  relateCount: 342,
  burnCount: 189,
  commentCount: 45,
};

export function SpotlightCard({
  spotlight = DEFAULT_SPOTLIGHT,
}: SpotlightCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-950/80 bg-linear-to-b from-red-950/30 via-[#0a0a0a] to-[#070707] p-4 sm:p-5 shadow-[0_0_24px_rgba(153,27,27,0.15)] transition-all">
      {/* Background Subtle Accent Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-800/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row: Badge & Dismiss */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/70 border border-red-800/60 text-[11px] font-medium text-red-300">
          <Sparkles className="w-3 h-3 text-red-400" />
          <span>Frustration of the Day</span>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-zinc-500 hover:text-zinc-300 p-1 rounded-md transition-colors"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content Body */}
      <blockquote className="text-zinc-100 text-sm sm:text-base font-normal leading-relaxed mb-3">
        {spotlight.content}
      </blockquote>

      {/* Footer Info & Engagement */}
      <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-900/80">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-medium">{spotlight.author}</span>
          <span>•</span>
          <span className="text-zinc-500">{spotlight.moodTag}</span>
        </div>

        {/* Reaction Counters */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-zinc-400">
            <HeartHandshake className="w-3.5 h-3.5 text-zinc-500" />
            {spotlight.relateCount}
          </span>
          <span className="flex items-center gap-1 text-red-400/80">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            {spotlight.burnCount}
          </span>
          <span className="flex items-center gap-1 text-zinc-400">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
            {spotlight.commentCount}
          </span>
        </div>
      </div>
    </div>
  );
}
