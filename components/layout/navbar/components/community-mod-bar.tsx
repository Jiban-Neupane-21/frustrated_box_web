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
      {/* Left: Exit button */}
      <button
        type="button"
        onClick={onExit}
        aria-label="Exit community moderation mode"
        title="Exit Workspace"
        className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white active:scale-95 sm:px-3"
      >
        <ArrowLeft className="h-4 w-4 shrink-0 text-zinc-400" />
        <span className="hidden sm:inline">Exit Workspace</span>
      </button>

      {/* Community identifier */}
      <div className="flex min-w-0 shrink items-center gap-2 border-l border-zinc-800 pl-2.5 sm:pl-3.5">
        <Shield className="h-4 w-4 shrink-0 text-red-500" />
        <span className="hidden sm:inline text-xs font-bold text-zinc-200 sm:text-sm">
          {" "}
          c/{communitySlug}
        </span>
      </div>

      {/* Mod navigation items (Normal horizontal navbar design on desktop) */}
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
              className={`relative flex items-center justify-center gap-2 rounded-lg p-2 text-xs font-medium transition sm:text-sm md:px-3 md:py-1.5 ${
                isActive
                  ? "bg-zinc-900 font-semibold text-red-500 shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden w-full text-center md:inline">
                  {link.label}
                </span>
              </div>

              {link.badge && (
                <>
                  {/* Mobile: small dot on icon corner */}
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
