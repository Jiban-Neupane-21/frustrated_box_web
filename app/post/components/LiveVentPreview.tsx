// app/post/components/LiveVentPreview.tsx
"use client";

import React from "react";
import {
  Flame,
  Heart,
  MessageSquare,
  EyeOff,
  User,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { CreateVentInput } from "@/types/create";
import { MOOD_OPTIONS } from "./VentComposer";
import { useAuth } from "@/components/AuthContext";

interface LiveVentPreviewProps {
  ventData: CreateVentInput;
}

export function LiveVentPreview({ ventData }: LiveVentPreviewProps) {
  const { user } = useAuth();

  const selectedMood = MOOD_OPTIONS.find((m) => m.id === ventData.mood) || MOOD_OPTIONS[0];

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Main Confession Card Preview */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#0c0c0e] p-5 shadow-2xl transition-all">
        
        {/* Glow Accent */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-600/10 blur-3xl" />

        {/* Card Header (Author + Destination + Mood) */}
        <div className="mb-3.5 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            {ventData.isAnonymous ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-red-800/60 bg-red-950/60 text-red-300">
                <EyeOff className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-bold text-zinc-200">
                {user?.username ? user.username.slice(0, 2).toUpperCase() : <User className="h-4 w-4" />}
              </div>
            )}

            {/* Author Name & Destination */}
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-zinc-100">
                  {ventData.isAnonymous ? "Anonymous Vent" : `@${user?.username || "you"}`}
                </span>
                <span className="text-zinc-600 text-xs">•</span>
                <span className="rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                  {ventData.communitySlug ? `c/${ventData.communitySlug}` : "Global Feed"}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500">
                {ventData.isAnonymous ? "Masked Identity" : "Public Author"} • Just now
              </p>
            </div>
          </div>

          {/* Mood Badge */}
          <div
            className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${selectedMood.colorClass}`}
          >
            <span>{selectedMood.icon}</span>
            <span>{selectedMood.label}</span>
          </div>
        </div>

        {/* Sensitive Content Warning Overlay */}
        {ventData.isSensitive && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-900/40 bg-amber-950/20 px-3 py-1.5 text-[11px] text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span>Content Warning: Sensitive vent</span>
          </div>
        )}

        {/* Vent Content Body */}
        <div className="mb-4 min-h-[70px]">
          {ventData.content.trim() ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200 font-sans">
              {ventData.content}
            </p>
          ) : (
            <p className="italic text-xs leading-relaxed text-zinc-600">
              Your frustration and raw confession will render here in real time as you type...
            </p>
          )}
        </div>

        {/* Dynamic Tags */}
        {ventData.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {ventData.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-zinc-900/80 border border-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-red-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Mock Action Bar (Reactions) */}
        <div className="flex items-center justify-between border-t border-zinc-800/60 pt-3 text-zinc-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs hover:text-red-400">
              <Heart className="h-4 w-4" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs hover:text-orange-400">
              <Flame className="h-4 w-4" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs hover:text-zinc-300">
              <MessageSquare className="h-4 w-4" />
              <span>0</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-600">0 views</span>
        </div>
      </div>

      {/* 2. Venting Principles / Safe Space Guide */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/40 p-4">
        <h4 className="mb-2 text-xs font-bold text-zinc-300 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Venting Guidelines</span>
        </h4>
        <ul className="flex flex-col gap-1.5 text-[11px] text-zinc-400 leading-normal">
          <li className="flex items-start gap-1.5">
            <span className="text-red-500">•</span>
            <span>Do not leak phone numbers, real full names, or private addresses.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-red-500">•</span>
            <span>Pure emotional release & catharsis over targeted harassment.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-red-500">•</span>
            <span>Anonymous vents cannot be tracked back to your profile.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}