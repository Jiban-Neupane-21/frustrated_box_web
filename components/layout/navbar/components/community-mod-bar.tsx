"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
import { getCommunityModNavLinks } from "../config/community-mod-nav";

interface CommunityModBarProps {
  communitySlug: string;
  pendingCount?: number;
  onExit: () => void;
}

export function CommunityModBar({
  communitySlug,
  pendingCount = 0,
  onExit,
}: CommunityModBarProps) {
  const pathname = usePathname();
  const links = getCommunityModNavLinks(communitySlug, pendingCount);

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
      {/* Left: Exit button (fixed size) */}
      <button
        type="button"
        onClick={onExit}
        aria-label="Exit community moderation mode"
        title="Exit Workspace"
        className="flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white active:scale-95 md:px-3"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        <span className="hidden md:inline">Exit Workspace</span>
      </button>

      {/* Community identifier (fixed size, slug truncates on small screens) */}
      <div className="flex min-w-0 shrink items-center gap-1.5 border-l border-zinc-800 pl-2 sm:pl-4">
        <Shield className="h-4 w-4 shrink-0 text-red-500" />
        <span className="max-w-18 truncate text-xs font-bold text-zinc-200 sm:max-w-40 sm:text-sm">
          c/{communitySlug}
        </span>
        <span className="hidden rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400 sm:inline">
          {" "}
          Mod
        </span>
      </div>

      {/* Middle/Right: Mod navigation takes all remaining space
          Mobile: icons evenly spread
          Desktop: aligned to the right */}
      <nav className="flex min-w-0 flex-1 items-center justify-evenly gap-1 md:justify-end md:gap-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.id}
              href={link.href}
              aria-label={link.label}
              title={link.label}
              className={`relative flex items-center justify-center gap-1.5 rounded-lg p-2 text-xs font-medium transition md:px-3 md:py-1.5 ${
                isActive
                  ? "bg-zinc-800 font-semibold text-red-700"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden md:inline">{link.label}</span>

              {link.badge && (
                <>
                  {/* Mobile: small dot on the icon corner */}
                  <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-600 ring-2 ring-[#050505] md:hidden" />
                  {/* Desktop: number pill beside label */}
                  <span className="hidden rounded-full border border-red-800/60 bg-red-950 px-1.5 py-px text-[9px] font-bold text-red-400 md:inline">
                    {link.badge}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
