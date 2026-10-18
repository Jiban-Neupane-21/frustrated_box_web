"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  Flame,
  MessageSquare,
  Bookmark,
  Share2,
  MoreHorizontal,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { ExplorePost } from "./types";

interface ExplorePostCardProps {
  post: ExplorePost;
}

export function ExplorePostCard({ post }: ExplorePostCardProps) {
  const [hasRelated, setHasRelated] = useState(false);

  const [relateCount, setRelateCount] = useState<number>(post.relateCount);
  const [burnCount, setBurnCount] = useState<number>(post.burnCount);
  const [hasBurned, setHasBurned] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [isRevealed, setIsRevealed] = useState(!post.isSensitive);
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle Handlers
  const handleRelate = () => {
    setRelateCount((prev: number) => (hasRelated ? prev - 1 : prev + 1));
    setHasRelated(!hasRelated);
  };

  const handleBurn = () => {
    setBurnCount((prev: number) => (hasBurned ? prev - 1 : prev + 1));
    setHasBurned(!hasBurned);
  };

  const shouldTruncate = post.content.length > 180 && !isExpanded;

  return (
    <article className="rounded-xl border border-zinc-900 bg-[#0a0a0a] p-4 sm:p-5 transition-colors hover:border-zinc-800">
      {/* 1. Header: User Info & Tag */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-300">
            {post.avatarSeed}
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-medium text-zinc-200">
              {post.author}
            </span>
            <span
              suppressHydrationWarning
              className="text-[11px] text-zinc-500 truncate max-w-40 sm:max-w-xs"
            >
              {post.authorTag ? `${post.authorTag} • ` : ""}
              {post.createdAt}
            </span>
            s
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
            {post.moodLabel}
          </span>
          <button
            type="button"
            className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Content Body with Sensitive Blur / Truncate */}
      <div className="relative my-3">
        {!isRevealed ? (
          <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex flex-col items-center justify-center text-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500/80" />
            <p className="text-xs text-zinc-400">
              This vent contains sensitive or heavy emotions.
            </p>
            <button
              type="button"
              onClick={() => setIsRevealed(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs rounded-md border border-zinc-700 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Reveal Vent
            </button>
          </div>
        ) : (
          <div className="text-sm sm:text-base text-zinc-200 leading-relaxed wrap-break-word">
            {shouldTruncate ? `${post.content.slice(0, 180)}...` : post.content}

            {post.content.length > 180 && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1 text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Action Toolbar */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-900/90 text-xs">
        <div className="flex items-center gap-4">
          {/* Relate Button */}
          <button
            type="button"
            onClick={handleRelate}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              hasRelated
                ? "text-red-400 font-medium"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <HeartHandshake
              className={`w-4 h-4 ${hasRelated ? "text-red-500" : ""}`}
            />
            <span>{relateCount}</span>
          </button>

          {/* Burn / Heat Button */}
          <button
            type="button"
            onClick={handleBurn}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
              hasBurned
                ? "text-amber-400 font-medium"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Flame
              className={`w-4 h-4 ${hasBurned ? "text-amber-500 fill-amber-500/20" : ""}`}
            />
            <span>{burnCount}</span>
          </button>

          {/* Comments */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentCount}</span>
          </button>
        </div>

        {/* Right Tools: Bookmark & Share */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSaved(!isSaved)}
            className={`p-1.5 rounded transition-colors ${
              isSaved
                ? "text-red-400"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
            }`}
            title="Save to Vault"
          >
            <Bookmark
              className={`w-4 h-4 ${isSaved ? "fill-red-400/20" : ""}`}
            />
          </button>

          <button
            type="button"
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
