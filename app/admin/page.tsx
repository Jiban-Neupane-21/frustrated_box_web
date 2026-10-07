"use client";

import React from "react";
import { ShieldCheck, Layers } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-800/60 bg-red-950/60 text-red-400">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Platform Admin Console</h1>
          <p className="text-xs text-zinc-400">
            Global safety overview, stress heatmap, and platform administration.
          </p>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Global Safety Queue</span>
            <ShieldCheck className="h-4 w-4 text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">4</p>
          <p className="mt-0.5 text-[11px] text-zinc-500">Pending flagged vents</p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Active Communities</span>
            <Layers className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">18</p>
          <p className="mt-0.5 text-[11px] text-zinc-500">Venting topic hubs</p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-500">
        Admin dashboard modules and live stress heatmap will be displayed here.
      </div>
    </div>
  );
}
