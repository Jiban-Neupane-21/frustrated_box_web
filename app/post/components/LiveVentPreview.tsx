// app/post/components/LiveVentPreview.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Flame,
  Heart,
  MessageSquare,
  EyeOff,
  Eye,
  User,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { CreateVentInput } from "@/types/create";
import { useAuth } from "@/components/AuthContext";

interface LiveVentPreviewProps {
  ventData: CreateVentInput;
}

export function LiveVentPreview({ ventData }: LiveVentPreviewProps) {
  const { user } = useAuth();
  const [revealed, setRevealed] = useState(false);

  const hasContent = ventData.content.trim().length > 0;
  const isBlurred = ventData.isSensitive && !revealed;

  // Content warning on/off गर्दा blur फेरि रिसेट गर्ने
  useEffect(() => {
    setRevealed(false);
  }, [ventData.isSensitive]);

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Vent card */}
      <article
        aria-label="Vent preview"
        className="relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#0c0c0e] p-4 shadow-2xl sm:p-5"
      >
        {/* Glow accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-600/10 blur-3xl"
        />

        {/* Header: avatar + author */}
        <div className="relative mb-3.5">
          <div className="flex min-w-0 items-center gap-3">
            {ventData.isAnonymous ? (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-800/60 bg-red-950/60 text-red-300">
                <EyeOff className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-bold text-zinc-200">
                {user?.username ? (
                  user.username.slice(0, 2).toUpperCase()
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="max-w-full truncate text-sm font-bold text-zinc-100">
                  {ventData.isAnonymous ? "Anonymous" : `@${user?.username || "you"}`}
                </span>
                <span className="max-w-full truncate rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-xs font-medium text-zinc-400">
                  {ventData.communitySlug ? `c/${ventData.communitySlug}` : "Global feed"}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                {ventData.isAnonymous ? "Identity hidden" : "Public profile"} · Just now
              </p>
            </div>
          </div>
        </div>

        {/* Content warning */}
        {ventData.isSensitive && (
          <div className="relative mb-3 flex items-center gap-2 rounded-xl border border-amber-900/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="flex-1">Content warning: sensitive vent</span>
          </div>
        )}

        {/* Body */}
        <div className="relative mb-4 min-h-[70px]">
          {hasContent ? (
            <>
              <p
                className={`whitespace-pre-wrap break-words text-base leading-relaxed text-zinc-200 transition sm:text-sm ${
                  isBlurred ? "select-none blur-md" : ""
                }`}
                aria-hidden={isBlurred}
              >
                {ventData.content}
              </p>

              {ventData.isSensitive && (
                <div
                  className={
                    isBlurred
                      ? "absolute inset-0 flex items-center justify-center"
                      : "mt-3 flex justify-start"
                  }
                >
                  <button
                    type="button"
                    onClick={() => setRevealed((r) => !r)}
                    className="flex min-h-11 items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/95 px-4 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800 cursor-pointer"
                  >
                    {isBlurred ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    <span>{isBlurred ? "Tap to reveal" : "Hide again"}</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm italic leading-relaxed text-zinc-600">
              Nothing written yet. Go back and write your vent to see it here.
            </p>
          )}
        </div>

        {/* Tags */}
        {ventData.tags.length > 0 && (
          <div className="relative mb-4 flex flex-wrap gap-2">
            {ventData.tags.map((tag) => (
              <span
                key={tag}
                className="max-w-full truncate rounded-md border border-zinc-800/80 bg-zinc-900/80 px-2 py-1 text-xs font-medium text-red-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Mock reactions: preview मा थिच्न मिल्दैन */}
        <div
          aria-hidden="true"
          className="relative flex items-center justify-between border-t border-zinc-800/60 pt-3 text-zinc-500"
        >
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-sm">
              <Heart className="h-4 w-4" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Flame className="h-4 w-4" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>0</span>
            </div>
          </div>
          <span className="text-xs text-zinc-600">0 views</span>
        </div>
      </article>

      {/* 2. Guidelines */}
      <section className="rounded-2xl p-4">
        <h3 className="mb-2.5 flex items-center gap-2 text-sm font-bold text-zinc-300">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Before you post</span>
        </h3>
        <ul className="flex flex-col gap-2 text-xs leading-normal text-zinc-400">
          <li className="flex items-start gap-2">
            <span aria-hidden="true" className="text-red-500">•</span>
            <span>Don&apos;t share phone numbers, full real names or private addresses.</span>
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden="true" className="text-red-500">•</span>
            <span>Vent to let it out. Don&apos;t target or harass specific people.</span>
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden="true" className="text-red-500">•</span>
            <span>Anonymous vents are not linked to your profile.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}