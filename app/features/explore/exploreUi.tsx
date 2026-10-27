// app/features/explore/explore-ui.tsx
"use client";

import type { ReactNode } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";

export function SectionTitle({
  icon,
  children,
  action,
}: {
  icon: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-1">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
        {icon}
        {children}
      </h3>
      {action}
    </div>
  );
}

export function TextButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
    >
      {children}
    </button>
  );
}

export function BackButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition cursor-pointer"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

export function LoadMoreButton({
  onClick,
  loading,
  label,
  loadingLabel,
}: {
  onClick: () => void;
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <div className="text-center pt-4 pb-2">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white transition cursor-pointer disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
            <span>{loadingLabel}</span>
          </>
        ) : (
          <span>{label}</span>
        )}
      </button>
    </div>
  );
}

export function PostsSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4 py-2 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-32 rounded-xl bg-zinc-900/50 border border-zinc-900"
        />
      ))}
    </div>
  );
}