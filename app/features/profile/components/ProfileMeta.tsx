"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  HeartCrack,
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  ShieldCheck,
  Crown,
  Flag,
  ChevronDown,
} from "lucide-react";
import type { User } from "@/types/auth";

interface ProfileMetaProps {
  user: User;
  isOwnProfile: boolean;
  adminHref?: string;
  /** Community slug bata console URL banaune */
  communityConsoleHref?: (slug: string) => string;
  /** Show more thichnu agadi kati chip dekhaune */
  visibleCount?: number;
}

const CHIP_CLASS =
  "inline-flex max-w-full items-center gap-1.5 rounded-full border border-zinc-800/80 bg-[#0d0d0f] px-3 py-1 text-xs text-zinc-300";
function MetaChip({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className={CHIP_CLASS}>
      <span className="text-zinc-500">{icon}</span>
      {children}
    </span>
  );
}

// Join two text fields with '@' (e.g. "Software Engineer @ Google")
function joinPair(a?: string, b?: string): string | null {
  if (a && b) return `${a} @ ${b}`;
  return a || b || null;
}

function formatJoined(iso?: string): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return `Joined ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
}

function normalizeWebsite(url: string): { href: string; label: string } {
  const hasProtocol = /^https?:\/\//i.test(url);
  return {
    href: hasProtocol ? url : `https://${url}`,
    label: url.replace(/^https?:\/\//i, "").replace(/\/$/, ""),
  };
}

interface ConsoleLinkProps {
  href: string;
  label: string;
  icon: ReactNode;
  className: string;
  badge?: number;
}

function ConsoleLink({
  href,
  label,
  icon,
  className,
  badge = 0,
}: ConsoleLinkProps) {
  const [showTip, setShowTip] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);

  useEffect(() => {
    return () => {
      if (pressTimer.current) clearTimeout(pressTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  function startPress() {
    longPressed.current = false;
    if (hideTimer.current) clearTimeout(hideTimer.current);
    pressTimer.current = setTimeout(() => {
      longPressed.current = true;
      setShowTip(true);
    }, 400);
  }

  function cancelPress() {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  }

  function endPress() {
    cancelPress();
    if (longPressed.current) {
      hideTimer.current = setTimeout(() => setShowTip(false), 1500);
    }
  }

  return (
    <Link
      href={href}
      aria-label={label}
      onTouchStart={startPress}
      onTouchMove={cancelPress}
      onTouchEnd={endPress}
      onTouchCancel={endPress}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
        // Long-press pachhi navigate nagarne
        if (longPressed.current) {
          e.preventDefault();
          longPressed.current = false;
        }
      }}
      className={`group relative inline-flex h-10 w-10 select-none items-center justify-center rounded-lg border text-xs font-semibold transition [-webkit-touch-callout:none] sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-1.5 ${className}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>

      {badge > 0 && (
        <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-4 text-white sm:static sm:ml-0.5 sm:min-w-0 sm:gap-0.5 sm:px-1.5 sm:py-0.5 sm:leading-normal">
          {badge}
        </span>
      )}

      {/* Tooltip: mobile ma matra (hover ya long-press) */}
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-0 top-full z-20 mt-1.5 whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] font-medium text-zinc-100 shadow-lg transition-opacity sm:hidden ${
          showTip ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

export default function ProfileMeta({
  user,
  isOwnProfile,
  adminHref = "/admin",
  communityConsoleHref = (slug: string) => `/c/${slug}/mod`,

  visibleCount = 2,
}: ProfileMetaProps) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const p = user.profile;

  const work = joinPair(p?.work?.occupation, p?.work?.company);
  const education = joinPair(
    p?.education?.degree,
    p?.education?.schoolOrCollege,
  );
  const location = [p?.location?.city, p?.location?.hometown]
    .filter(Boolean)
    .join(", ");
  const joined = formatJoined(p?.joinedDate);
  const website = p?.website ? normalizeWebsite(p.website) : null;

  // Khali field push hudaina, tesaile count sahi aauchha
  const chips: ReactNode[] = [];
  if (work)
    chips.push(
      <MetaChip key="work" icon={<Briefcase className="h-3.5 w-3.5" />}>
        {work}
      </MetaChip>,
    );
  if (education)
    chips.push(
      <MetaChip key="edu" icon={<GraduationCap className="h-3.5 w-3.5" />}>
        {education}
      </MetaChip>,
    );
  if (location)
    chips.push(
      <MetaChip key="loc" icon={<MapPin className="h-3.5 w-3.5" />}>
        {location}
      </MetaChip>,
    );
  if (p?.relationshipStatus)
    chips.push(
      <MetaChip key="rel" icon={<HeartCrack className="h-3.5 w-3.5" />}>
        {p.relationshipStatus}
      </MetaChip>,
    );
  if (joined)
    chips.push(
      <MetaChip key="joined" icon={<CalendarDays className="h-3.5 w-3.5" />}>
        {joined}
      </MetaChip>,
    );
  if (website)
    chips.push(
      <a
        key="web"
        href={website.href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={`${CHIP_CLASS} !text-red-400 transition hover:!border-red-500/40 hover:!text-red-300`}
      >
        <ExternalLink className="h-3.5 w-3.5" />
        {website.label}
      </a>,
    );

  const firstChips = chips.slice(0, visibleCount);
  const extraChips = chips.slice(visibleCount);
  const hasMore = extraChips.length > 0;

  // Owner ya moderator bhako community matra, afno profile ma
  const consoleCommunities = isOwnProfile
    ? (user.managedCommunities ?? []).filter(
        (c) => c.role === "owner" || c.role === "moderator",
      )
    : [];
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="space-y-3 px-4 pt-3 sm:px-6">
      {/* Name + username */}
      <div>
        <h1 className="text-xl font-bold text-zinc-100 sm:text-2xl">
          {user.name}
        </h1>
        <p className="text-sm text-zinc-500">@{user.username}</p>
      </div>

      {/* Bio */}
      {p?.bio && (
        <p className="max-w-xl text-sm italic leading-relaxed text-zinc-300">
          &ldquo;{p.bio}&rdquo;
        </p>
      )}

      {/* Metadata chips */}
      {chips.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-2">{firstChips}</div>

          {hasMore && (
            <>
              {/* Height animation: grid-rows 0fr -> 1fr */}
              <div
                id={panelId}
                inert={!expanded}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
                  expanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-wrap gap-2 pt-2">{extraChips}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition hover:text-zinc-300"
              >
                {expanded ? "Show less" : `Show more (${extraChips.length})`}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </>
          )}
        </div>
      )}

      {/* Dashboard Shortcuts — centered on own profile */}
      {isOwnProfile && (isAdmin || consoleCommunities.length > 0) && (
        <div className="flex w-full justify-center pt-3">
          <div className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-2.5">
            {isAdmin && (
              <ConsoleLink
                href={adminHref}
                label="Admin Console"
                icon={<LayoutDashboard className="h-4 w-4 shrink-0" />}
                className="rounded-xl border border-red-500/30 bg-red-950/30 px-3 py-2 text-red-400 shadow-sm transition-all duration-200 hover:border-red-500/50 hover:bg-red-950/60 hover:shadow-md"
              />
            )}

            {consoleCommunities.map((c) => {
              const isOwnerRole = c.role === "owner";
              const Icon = isOwnerRole ? Crown : ShieldCheck;

              return (
                <ConsoleLink
                  key={c.id}
                  href={communityConsoleHref(c.slug)}
                  label={`${c.name} ${
                    isOwnerRole ? "Console" : "Mod Workspace"
                  }`}
                  icon={<Icon className="h-4 w-4 shrink-0" />}
                  badge={c.pendingReportsCount ?? 0}
                  className={
                    isOwnerRole
                      ? "rounded-xl border border-amber-500/30 bg-amber-950/30 px-3 py-2 text-amber-400 shadow-sm transition-all duration-200 hover:border-amber-500/50 hover:bg-amber-950/60 hover:shadow-md"
                      : "rounded-xl border border-orange-500/30 bg-orange-950/30 px-3 py-2 text-orange-400 shadow-sm transition-all duration-200 hover:border-orange-500/50 hover:bg-orange-950/60 hover:shadow-md"
                  }
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
