"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Flame, Lock, Users } from "lucide-react";
import { getCommunityBySlug, type CommunityMeta } from "@/lib/communities";
import { communityService } from "@/lib/communityService";
import { FeedStream } from "@/app/features/feed/components/FeedStream";


import { useJoinedCommunities } from "@/lib/useJoinedCommunities";

export function CommunityView({ slug }: { slug: string }) {
  // undefined = checking localStorage, null = not found
  // Default community server/client dubai ma same → hydration mismatch hudaina
  const [meta, setMeta] = useState<CommunityMeta | null | undefined>(() =>
    getCommunityBySlug(slug),
  );
  const { isJoined: checkJoined, toggle } = useJoinedCommunities();
  const isJoined = checkJoined(slug);
  // Custom community: client-side matra (localStorage)
  useEffect(() => {
    if (meta) return;
    setMeta(communityService.getCommunityBySlug(slug) ?? null);
  }, [slug, meta]);

  // Loading
  if (meta === undefined) {
    return (
      <div className="p-6">
        <div className="h-16 animate-pulse rounded-2xl bg-zinc-900" />
      </div>
    );
  }

  // Not found
  if (meta === null) {
    return (
      <div className="flex flex-col items-center gap-3 p-10 text-center">
        <Flame className="h-8 w-8 text-zinc-600" />
        <h1 className="text-lg font-bold text-white">c/{slug} not found</h1>
        <p className="text-xs text-zinc-500">
          This community doesn&apos;t exist (or was never created on this
          device).
        </p>
        <Link
          href="/"
          className="mt-2 flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white"
              style={{ backgroundColor: meta.accentColor }}
            >
              {meta.initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xl font-bold text-white">
                  {meta.name}
                </h1>
                {meta.isRestricted && (
                  <Lock
                    className="h-3.5 w-3.5 shrink-0 text-amber-400"
                    aria-label="Restricted"
                  />
                )}
              </div>
              <p className="text-xs text-zinc-500">
                c/{meta.slug} · <Users className="mb-0.5 inline h-3 w-3" />{" "}
                {meta.membersCount.toLocaleString("en-US")} members ·{" "}
                {meta.category}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>

        <p className="text-sm text-zinc-400">{meta.description}</p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toggle(slug)}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              isJoined
                ? "border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                : "bg-red-600 text-white hover:bg-red-500"
            }`}
          >
            {isJoined ? "Joined" : "Join"}
          </button>

          <Link
            href={`/post?c=${meta.slug}`}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition"
          >
            Vent to this community
          </Link>
        </div>
      </div>

      {/* Community Feed (Step 4 ko filter) */}
      <FeedStream key={meta.slug} community={meta.slug} />
    </div>
  );
}
