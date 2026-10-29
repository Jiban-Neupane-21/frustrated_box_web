"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Users, Plus } from "lucide-react";
import { getDefaultCommunities, type CommunityMeta } from "@/lib/communities";
import { communityService } from "@/lib/communityService";
import { useJoinedCommunities } from "@/lib/useJoinedCommunities";

export function CommunitiesView() {
  const [communities, setCommunities] = useState<CommunityMeta[]>(() =>
    getDefaultCommunities(),
  );
  const [query, setQuery] = useState("");
  const { isJoined, toggle } = useJoinedCommunities();

  useEffect(() => {
    setCommunities(communityService.getAllCommunities());
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = communities.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q),
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      {/* Redesigned Header with Create Action */}
      <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Communities
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Explore spaces, find your tribe, and vent freely.
          </p>
        </div>
        
        <Link
          href="/post?tab=community"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-800"
        >
          <Plus className="h-4 w-4" />
          <span>Create Community</span>
        </Link>
      </div>

      {/* Modern Compact Search Bar */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by community name or keywords..."
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition"
        />
      </div>

      {/* Standard Responsive Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {filtered.map((c) => {
          const joined = isJoined(c.slug);

          return (
            <div
              key={c.slug}
              className={`group relative flex flex-col justify-between rounded-2xl border bg-zinc-950/60 p-5 transition-all hover:bg-zinc-900/40 ${
                joined
                  ? "border-zinc-800/90 hover:border-zinc-700"
                  : "border-zinc-800/60 hover:border-zinc-700"
              }`}
            >
              {/* Card Clickable Body Area */}
              <Link href={`/c/${c.slug}`} className="block space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: c.accentColor || "#18181b" }}
                    >
                      {c.initials || c.name.slice(0, 2).toUpperCase()}
                    </div>
                    
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-bold text-white group-hover:text-red-400 transition-colors">
                        {c.name}
                      </h2>
                      <span className="inline-block rounded-md bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-zinc-800">
                        {c.category || "General"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="line-clamp-2 min-h-[2.5rem] text-xs text-zinc-400 leading-relaxed">
                  {c.description}
                </p>
              </Link>

              {/* Card Footer Actions */}
              <div className="mt-4 flex items-center justify-between border-t border-zinc-800/60 pt-3.5">
                <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Users className="h-3.5 w-3.5 text-zinc-500" />
                  {c.membersCount.toLocaleString("en-US")} members
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle(c.slug);
                  }}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                    joined
                      ? "border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  {joined ? "Joined" : "Join"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Search Fallback */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
          <p className="text-sm text-zinc-400">
            No communities matching &quot;{query}&quot; found.
          </p>
        </div>
      )}
    </div>
  );
}