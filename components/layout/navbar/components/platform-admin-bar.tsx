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
      {/* Left: Exit button */}
      <button
        type="button"
        onClick={onExit}
        aria-label="Exit admin console"
        title="Exit Console"
        className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white active:scale-95 sm:px-3"
      >
        <ArrowLeft className="h-4 w-4 shrink-0 text-zinc-400" />
        <span className="hidden sm:inline">Exit Console</span>
      </button>

      {/* Admin identifier */}
      <div className="flex shrink-0 items-center gap-2 border-l border-zinc-800 pl-2.5 sm:pl-3.5">
        <ShieldCheck className="h-4 w-4 shrink-0 text-red-500" />
        {/* Mobile ma purai hide hunchha, sm (>= 640px) dekhi matrai dekhinchha */}
        <span className="hidden sm:inline text-xs font-bold text-zinc-200 sm:text-sm">
          Platform Admin
        </span>
      </div>

      {/* Admin navigation items (Normal horizontal navbar design on desktop) */}
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
              className={`flex items-center justify-center gap-2 rounded-lg p-2 text-xs font-medium transition sm:text-sm md:px-3 md:py-1.5 ${
                isActive
                  ? "bg-zinc-900 font-semibold text-red-500 shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline w-full text-center text-xs">
                  {link.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
