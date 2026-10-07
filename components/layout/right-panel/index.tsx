"use client";

import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { TrendingFrustrations } from "@/components/cards/trending-frustrations";
import { ActiveCommunities } from "@/components/cards/active-communities";
export function RightPanel() {
  return (
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 flex-col gap-4 overflow-y-auto px-4 py-4 xl:flex border-l border-zinc-900 bg-zinc-950/40">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search vents, #tags, topics..."
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/70 py-2.5 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-500 transition focus:border-red-600/80 focus:outline-none focus:ring-1 focus:ring-red-600/50"
        />
      </div>

      {/* 2. Trending Frustrations Widget */}
      <TrendingFrustrations />

      {/* Active Communities */}
      <ActiveCommunities />

      {/* 4. Footer Navigation & Copyright */}
      <footer className="px-2 pt-2 text-[11px] leading-relaxed text-zinc-600">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/terms" className="hover:text-zinc-400 transition">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-zinc-400 transition">
            Privacy Policy
          </Link>
          <Link href="/rules" className="hover:text-zinc-400 transition">
            Community Rules
          </Link>
        </div>
        <p className="mt-2 text-zinc-600">© 2026 FrustratedBox, Inc.</p>
      </footer>
    </aside>
  );
}
