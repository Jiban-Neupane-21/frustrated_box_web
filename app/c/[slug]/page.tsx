import React from "react";
import Link from "next/link";
import { Users, Flame, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return [{ slug: "tech-life" }, { slug: "corporate-cage" }];
}

export default async function CommunityFeedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-red-500 font-bold text-lg">
            c/
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">c/{slug}</h1>
            <p className="text-xs text-zinc-400">
              Community rants, discussions, and uncensored vents.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
      </div>

      {/* Community Feed Placeholder */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-8 text-center">
        <Flame className="mx-auto h-8 w-8 text-red-500/80 animate-pulse mb-3" />
        <h2 className="text-sm font-semibold text-zinc-200">
          Welcome to c/{slug} Feed
        </h2>
        <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
          You are viewing this community as a member. Be the first to drop a
          vent here!
        </p>
      </div>
    </div>
  );
}
