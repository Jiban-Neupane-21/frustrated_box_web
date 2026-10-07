"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { PLATFORM_ADMIN_NAV_LINKS } from "../config/admin-nav";

interface PlatformAdminBarProps {
  onExit: () => void;
}

export function PlatformAdminBar({ onExit }: PlatformAdminBarProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
      {/* Left: Exit button (fixed size) */}
      <button
        type="button"
        onClick={onExit}
        aria-label="Exit admin console"
        title="Exit Console"
        className="flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white active:scale-95 md:px-3"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        <span className="hidden md:inline">Exit Console</span>
      </button>

      {/* Admin identifier (fixed size, label hidden on mobile) */}
      <div className="flex shrink-0 items-center gap-1.5 border-l border-zinc-800 pl-2 sm:pl-4">
        <ShieldCheck className="h-4 w-4 shrink-0 text-red-500" />
        <span className="hidden text-xs font-bold text-zinc-200 sm:inline sm:text-sm">
          Platform Admin
        </span>
        <span className="hidden rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400 lg:inline">
          Super Admin
        </span>
      </div>

      {/* Admin navigation takes all remaining space
          Mobile: icons evenly spread
          Desktop: aligned to the right */}
      <nav className="flex min-w-0 flex-1 items-center justify-evenly gap-1 md:justify-end md:gap-2">
        {PLATFORM_ADMIN_NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.id}
              href={link.href}
              aria-label={link.label}
              title={link.label}
              className={`flex items-center justify-center rounded-lg p-2 transition lg:min-w-18 lg:flex-col lg:gap-1 lg:px-3 lg:py-1.5 ${
                isActive
                  ? "bg-zinc-800 text-red-400"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 lg:h-5 lg:w-5" />
              <span className="hidden text-[11px] font-medium leading-none lg:block">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
