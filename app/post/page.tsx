"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Flame,
  Shield,
  ArrowLeft,
  Sparkles,
  Users,
  Lock,
  Pencil,
  Send,
  Loader2,
  Eye,
} from "lucide-react";
import { CreateTabMode, CreateVentInput, CreateCommunityInput } from "@/types/create";
import { VentComposer } from "./components/VentComposer";
import { LiveVentPreview } from "./components/LiveVentPreview";
import { CommunityCreator } from "./components/CommunityCreator";
import { createConfession } from "@/app/features/feed/api";
import { communityService } from "@/lib/communityService";
import { notificationService } from "@/lib/notificationService"; // <--- ADDED IMPORT
import { useAuth } from "@/components/AuthContext";
import { DarkToast } from "@/lib/swal";

type Step = "edit" | "preview";

export default function PostPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] p-8 text-center text-sm text-zinc-500">
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
  const tabParam = searchParams.get("tab");
  const initialTab: CreateTabMode = tabParam === "community" ? "community" : "vent";
  const initialCommunity = searchParams.get("c") || null;

  const { user, isAuthenticated, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<CreateTabMode>(initialTab);
  const [step, setStep] = useState<Step>("edit");
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

  // Step बदलिँदा पेजको माथि स्क्रोल गर्ने (मोबाइलमा महत्त्वपूर्ण)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const switchTab = (tab: CreateTabMode) => {
    if (isSubmitting) return;
    setActiveTab(tab);
    setStep("edit");
  };

  const goToPreview = () => setStep("preview");
  const goToEdit = () => {
    if (!isSubmitting) setStep("edit");
  };

  // ३. Vent Submit Handler with Notification Dispatch
  const handleVentSubmit = async () => {
    if (!ventData.content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const createdPost = await createConfession(ventData.content, ventData.tags, {
        alias: ventData.isAnonymous ? "Anonymous" : user?.name || user?.username,
        isAnonymous: ventData.isAnonymous,
        authorId: user?.id,
        communitySlug: ventData.communitySlug || null,
      });

      const postId = createdPost?.id || `vent_${Date.now()}`;
      const authorId = ventData.isAnonymous ? "anonymous" : user?.id || "current_user";
      const authorName = ventData.isAnonymous
        ? "Anonymous User"
        : user?.username || user?.name || "User";

      // Dispatch notifications to Followers, Interacted Users, and Joined Community Members
      notificationService.dispatchNewPostNotifications({
        postId,
        authorId,
        authorName,
        communitySlug: ventData.communitySlug || null,
      });

      DarkToast.fire({
        icon: "success",
        title: "Vent released into the void 🔥",
      });

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
    if (isSubmitting) return;

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

      const currentManaged = user.managedCommunities || [];
      updateUser({
        managedCommunities: [...currentManaged, managedRecord],
      });

      DarkToast.fire({
        icon: "success",
        title: `c/${managedRecord.slug} created! You are the Owner 🛡️`,
      });

      router.push(`/c/${managedRecord.slug}`);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to create community";
      DarkToast.fire({
        icon: "error",
        title: errorMsg,
      });
      // Slug मिलेन भने user ले form सच्याउन सकोस् भनेर edit मा फर्काउने
      setStep("edit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVent = activeTab === "vent";
  const handleFinalSubmit = isVent ? handleVentSubmit : handleCommunitySubmit;

  return (
    <main
      className={`min-h-screen bg-[#050505] text-zinc-100 selection:bg-red-950 selection:text-red-200 ${
        step === "preview" ? "pb-32" : "pb-10"
      }`}
    >
      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 sm:py-8">
        {/* Header */}
        <header className="mb-5 flex flex-col gap-4 border-b border-zinc-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 text-lg font-bold text-white">
                <span>Creation Studio</span>
                <Sparkles className="h-4 w-4 text-amber-500" />
              </h1>
              <p className="text-xs leading-snug text-zinc-400">
                Release your frustration or build a safe venting community.
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div
            role="tablist"
            aria-label="Create type"
            className="grid grid-cols-2 gap-1 rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={isVent}
              onClick={() => switchTab("vent")}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-all cursor-pointer ${
                isVent
                  ? "bg-red-600 text-white shadow-lg shadow-red-950/50"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Flame className="h-4 w-4" />
              <span>Drop a Vent</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={!isVent}
              onClick={() => switchTab("community")}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition-all cursor-pointer ${
                !isVent
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-950/50"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Create Community</span>
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 text-xs font-medium" aria-label="Progress">
            <span
              className={`flex items-center gap-1.5 ${
                step === "edit" ? "text-white" : "text-zinc-500"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  step === "edit" ? (isVent ? "bg-red-600" : "bg-amber-600") : "bg-zinc-800"
                }`}
              >
                1
              </span>
              Write
            </span>
            <span className="h-px w-6 bg-zinc-700" />
            <span
              className={`flex items-center gap-1.5 ${
                step === "preview" ? "text-white" : "text-zinc-500"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  step === "preview" ? (isVent ? "bg-red-600" : "bg-amber-600") : "bg-zinc-800"
                }`}
              >
                2
              </span>
              Preview &amp; publish
            </span>
          </div>
        </header>

        {/* STEP 1: EDIT */}
        {step === "edit" && (
          <section>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-sm sm:p-5">
              {isVent ? (
                <>
                  <h2 className="mb-1 flex items-center gap-2 text-base font-bold text-white">
                    <Flame className="h-4 w-4 text-red-500" />
                    <span>Write your confession</span>
                  </h2>
                  <p className="mb-5 text-xs text-zinc-400">
                    Pick where to post, who you are, and how you feel. You can preview
                    before it goes live.
                  </p>
                  <VentComposer
                    ventData={ventData}
                    onChange={(updates) =>
                      setVentData((prev) => ({ ...prev, ...updates }))
                    }
                    onSubmit={async () => goToPreview()}
                    isSubmitting={isSubmitting}
                  />
                </>
              ) : (
                <>
                  <h2 className="mb-1 flex items-center gap-2 text-base font-bold text-white">
                    <Shield className="h-4 w-4 text-amber-500" />
                    <span>Launch a new venting hub</span>
                  </h2>
                  <p className="mb-5 text-xs text-zinc-400">
                    Set the rules and privacy, then preview your community before
                    creating it.
                  </p>
                  <CommunityCreator
                    communityData={communityData}
                    onChange={(updates) =>
                      setCommunityData((prev) => ({ ...prev, ...updates }))
                    }
                    onSubmit={async () => goToPreview()}
                    isSubmitting={isSubmitting}
                  />
                </>
              )}
            </div>
          </section>
        )}

        {/* STEP 2: PREVIEW */}
        {step === "preview" && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
              <Eye className="h-4 w-4 text-zinc-400" />
              <h2 className="text-sm font-bold text-zinc-200">
                {isVent ? "This is how your vent will look" : "This is how your community will look"}
              </h2>
            </div>

            {isVent ? (
              <LiveVentPreview ventData={ventData} />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-[#0c0c0e] p-4 shadow-2xl sm:p-5">
                <div className="mb-3 flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-900/50 bg-amber-950/40 text-lg font-bold text-amber-400">
                    c/
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold text-zinc-100">
                      {communityData.name || "Community Name"}
                    </h3>
                    <p className="truncate font-mono text-xs text-amber-500">
                      c/{communityData.slug || "slug-preview"}
                    </p>
                  </div>
                </div>

                <p className="mb-4 min-h-[40px] break-words text-sm leading-relaxed text-zinc-300">
                  {communityData.description ||
                    "Your community mission statement will display here..."}
                </p>

                <div className="flex flex-wrap gap-2 border-t border-zinc-800/60 pt-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1">
                    <Users className="h-3 w-3" />
                    <span>1 Member</span>
                  </span>
                  {communityData.isRestricted && (
                    <span className="flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-amber-400">
                      <Lock className="h-3 w-3" />
                      <span>Restricted</span>
                    </span>
                  )}
                  {communityData.isAnonymousOnly && (
                    <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300">
                      Anonymous only
                    </span>
                  )}
                  <span className="rounded border border-amber-800/40 bg-amber-950/40 px-2 py-1 font-semibold text-amber-300">
                    Role: Owner
                  </span>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Sticky action bar */}
      {step === "preview" && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-[#050505]/95 backdrop-blur">
          <div
            className="mx-auto flex max-w-2xl items-center gap-3 px-4 pt-3 sm:px-6"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
          >
            <button
              type="button"
              onClick={goToEdit}
              disabled={isSubmitting}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-sm font-bold text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-400"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className={`flex min-h-12 flex-[2] items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white ${
                isVent
                  ? "bg-red-600 shadow-red-950/50 hover:bg-red-500"
                  : "bg-amber-600 shadow-amber-950/50 hover:bg-amber-500"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isVent ? "Publishing..." : "Creating..."}</span>
                </>
              ) : isVent ? (
                <>
                  <Send className="h-4 w-4" />
                  <span>Release vent 🔥</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Create community 🛡️</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}