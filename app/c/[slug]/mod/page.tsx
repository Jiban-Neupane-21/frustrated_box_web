import React from "react";
import { Shield, ShieldAlert, Users } from "lucide-react";

export function generateStaticParams() {
  return [{ slug: "tech-life" }, { slug: "corporate-cage" }];
}

export default async function CommunityModPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-800/60 bg-amber-950/60 text-amber-400">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">c/{slug} Mod Workspace</h1>
          <p className="text-xs text-zinc-400">
            Moderate flagged content, manage community rules, and review ban logs.
          </p>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Mod Queue</span>
            <ShieldAlert className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">4</p>
          <p className="mt-0.5 text-[11px] text-zinc-500">Pending user reports</p>
        </div>

        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Community Members</span>
            <Users className="h-4 w-4 text-zinc-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">12,420</p>
          <p className="mt-0.5 text-[11px] text-zinc-500">Active venters</p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-500">
        Review queue items, reports, and rule configuration for c/{slug}.
      </div>
    </div>
  );
}

