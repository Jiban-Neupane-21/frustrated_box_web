// app/post/page.tsx
"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Shield, ArrowLeft, Sparkles, Users, Lock } from "lucide-react";
import { CreateTabMode, CreateVentInput, CreateCommunityInput } from "@/types/create";
import { VentComposer } from "./components/VentComposer";
import { LiveVentPreview } from "./components/LiveVentPreview";
import { CommunityCreator } from "./components/CommunityCreator";
import { createConfession } from "@/app/features/feed/api";
import { communityService } from "@/lib/communityService";
import { useAuth } from "@/components/AuthContext";
import { DarkToast } from "@/lib/swal";

export default function PostPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] p-8 text-center text-zinc-500">
          Loading creation studio...
        </div>
      }
    >
      <PostPageContent />
    </Suspense>
  );
}

function PostPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as CreateTabMode) || "vent";
  const initialCommunity = searchParams.get("c") || null;

  const { user, isAuthenticated, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<CreateTabMode>(initialTab);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // १. Vent Form State
  const [ventData, setVentData] = useState<CreateVentInput>({
    content: "",
    mood: "general",
    tags: [],
    communitySlug: initialCommunity,
    isAnonymous: true,
    isSensitive: false,
  });

  // २. Community Form State
  const [communityData, setCommunityData] = useState<CreateCommunityInput>({
    name: "",
    slug: "",
    description: "",
    category: "tech",
    rules: [],
    isRestricted: false,
    isAnonymousOnly: false,
  });

  // ३. Vent Submit Handler
  const handleVentSubmit = async () => {
    if (!ventData.content.trim()) return;

    try {
      setIsSubmitting(true);

      await createConfession(ventData.content, ventData.tags, {
        alias: user?.name || user?.username,
        isAnonymous: ventData.isAnonymous,
        authorId: user?.id,
      });

      DarkToast.fire({
        icon: "success",
        title: "Vent released into the void 🔥",
      });

      // Destination community वा Home page मा पठाउने
      if (ventData.communitySlug) {
        router.push(`/c/${ventData.communitySlug}`);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Failed to post vent:", err);
      DarkToast.fire({
        icon: "error",
        title: "Failed to release vent. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ४. Community Submit Handler
  const handleCommunitySubmit = async () => {
    if (!isAuthenticated || !user) {
      DarkToast.fire({
        icon: "warning",
        title: "Please log in to found a community.",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { managedRecord } = await communityService.createCommunity(
        communityData,
        user.id
      );

      // AuthContext र Sidebar मा नयाँ Owner Role तत्कालै Sync गर्ने
      const currentManaged = user.managedCommunities || [];
      updateUser({
        managedCommunities: [...currentManaged, managedRecord],
      });

      DarkToast.fire({
        icon: "success",
        title: `c/${managedRecord.slug} created! You are the Owner 🛡️`,
      });

      // नयाँ कम्युनिटीको पृष्ठमा पठाउने
      router.push(`/c/${managedRecord.slug}`);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create community";
      DarkToast.fire({
        icon: "error",
        title: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-red-950 selection:text-red-200">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        
        {/* Header Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
              title="Go back to Home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Creation Studio</span>
                <Sparkles className="h-4 w-4 text-amber-500" />
              </h1>
              <p className="text-xs text-zinc-400">
                Release your frustration into the void or build a safe venting community.
              </p>
            </div>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="flex rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("vent")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "vent"
                  ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Drop a Vent</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("community")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "community"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-950/50"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Create Community</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* बायाँ स्तम्भ (Form Section - 7 Columns) */}
          <section className="lg:col-span-7">
            {activeTab === "vent" ? (
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm">
                <h2 className="mb-1 text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="h-4 w-4 text-red-500" />
                  <span>Write Your Confession</span>
                </h2>
                <p className="mb-4 text-xs text-zinc-400">
                  Choose your destination, identity mode, and emotions below.
                </p>

                <VentComposer
                  ventData={ventData}
                  onChange={(updates) =>
                    setVentData((prev) => ({ ...prev, ...updates }))
                  }
                  onSubmit={handleVentSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm">
                <h2 className="mb-1 text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-500" />
                  <span>Launch New Venting Hub</span>
                </h2>
                <p className="mb-4 text-xs text-zinc-400">
                  Establish custom rules, identity filters, and claim ownership.
                </p>

                <CommunityCreator
                  communityData={communityData}
                  onChange={(updates) =>
                    setCommunityData((prev) => ({ ...prev, ...updates }))
                  }
                  onSubmit={handleCommunitySubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
          </section>

          {/* दायाँ स्तम्भ (Real-Time Live Preview - 5 Columns) */}
          <aside className="lg:col-span-5">
            <div className="sticky top-6 flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  {activeTab === "vent" ? "Live Feed Preview" : "Community Hub Preview"}
                </span>
                <span className="text-[10px] text-zinc-600">
                  Real-time appearance
                </span>
              </div>

              {activeTab === "vent" ? (
                <LiveVentPreview ventData={ventData} />
              ) : (
                /* Community Hub Live Preview */
                <div className="flex flex-col gap-4">
                  <div className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#0c0c0e] p-5 shadow-2xl">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-900/50 bg-amber-950/40 text-amber-400 font-bold text-lg">
                        c/
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-zinc-100 truncate">
                          {communityData.name || "Community Name"}
                        </h3>
                        <p className="text-[11px] text-amber-500 font-mono">
                          c/{communityData.slug || "slug-preview"}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed mb-4 min-h-[40px]">
                      {communityData.description ||
                        "Your community mission statement will display here..."}
                    </p>

                    <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500 border-t border-zinc-800/60 pt-3">
                      <span className="flex items-center gap-1 rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5">
                        <Users className="h-3 w-3 text-zinc-400" />
                        <span>1 Member</span>
                      </span>
                      {communityData.isRestricted && (
                        <span className="flex items-center gap-1 rounded bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-amber-400">
                          <Lock className="h-3 w-3" />
                          <span>Restricted</span>
                        </span>
                      )}
                      <span className="rounded bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 text-amber-300 font-semibold">
                        Role: Owners
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>

        </div>

      </div>
    </main>
  );
}