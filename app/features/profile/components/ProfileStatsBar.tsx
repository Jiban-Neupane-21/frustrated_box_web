import type { ReactNode } from "react";
import { Flame, Heart, Zap, Shield } from "lucide-react";
import type { ProfileStats } from "../types";

interface ProfileStatsBarProps {
  stats: ProfileStats | null;
}

function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

interface StatItemProps {
  icon: ReactNode;
  shortLabel: string; // mobile
  label: string; // sm ra thulo
  value?: number;
}

function StatItem({ icon, shortLabel, label, value }: StatItemProps) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-3 text-center sm:flex-row sm:justify-start sm:gap-3 sm:px-4 sm:py-4 sm:text-left">
      {/* Icon matra, background chhaina */}
      <span className="shrink-0">{icon}</span>

      <div className="min-w-0">
        <p className="text-base font-bold leading-tight text-zinc-100 sm:text-xl">
          {value === undefined ? (
            <span className="inline-block h-5 w-8 animate-pulse rounded bg-zinc-800" />
          ) : (
            formatCount(value)
          )}
        </p>
        <p className="truncate text-[10px] uppercase tracking-wide text-zinc-500 sm:text-xs sm:normal-case sm:tracking-normal">
          <span className="sm:hidden">{shortLabel}</span>
          <span className="hidden sm:inline">{label}</span>
        </p>
      </div>
    </div>
  );
}

export default function ProfileStatsBar({ stats }: ProfileStatsBarProps) {
  return (
    <div className="px-4 pt-4 sm:px-6">
      <div className="grid grid-cols-4 divide-x divide-zinc-800/80 overflow-hidden rounded-xl border border-zinc-800/80 bg-[#0d0d0f]">
        <StatItem
          icon={
            <Flame className="h-5 w-5 fill-orange-500/30 text-orange-400 drop-shadow-[0_0_6px_rgba(249,115,22,0.7)]" />
          }
          shortLabel="Vents"
          label="Total Vents"
          value={stats?.ventCount}
        />
        <StatItem
          icon={<Heart className="h-5 w-5 fill-rose-500/30 text-rose-500" />}
          shortLabel="Relates"
          label="Relates Received"
          value={stats?.relateCount}
        />
        <StatItem
          icon={<Zap className="h-5 w-5 fill-yellow-400/30 text-yellow-400" />}
          shortLabel="Burns"
          label="Burns Sparked"
          value={stats?.burnCount}
        />
        <StatItem
          icon={<Shield className="h-5 w-5 fill-amber-500/20 text-amber-400" />}
          shortLabel="Spaces"
          label="Communities"
          value={stats?.communityCount}
        />
      </div>
    </div>
  );
}