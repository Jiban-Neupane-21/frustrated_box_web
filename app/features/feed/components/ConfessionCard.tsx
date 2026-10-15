"use client";

import React, { useRef, useState } from "react";
import {
  Flame,
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Send,
  Loader2,
  Bookmark,
  Link2,
  Flag,
  EyeOff,
  Check,
} from "lucide-react";
import { Confession, ConfessionComment } from "../types";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import {
  toggleRelate,
  toggleBurn,
  addComment,
  toggleFollowAuthor,
} from "../api";

// 👈 यो इम्पोर्ट लाइन थप्नुहोस्:
import { DarkSwal, DarkToast } from "@/lib/swal";

import { toBlob } from "html-to-image";

interface ConfessionCardProps {
  confession: Confession;
  onTagClick?: (tag: string) => void;
}

// Relative time formatter helper
function formatRelativeTime(dateString: string): string {
  const diffInSeconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000,
  );

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function ConfessionCard({
  confession,
  onTagClick,
}: ConfessionCardProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [relateCount, setRelateCount] = useState(confession.relateCount);
  const [isRelatable, setIsRelatable] = useState(confession.isRelatableByMe);

  // 🔘 More Menu States
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);

  const [capturing, setCapturing] = useState(false);

  const [burnCount, setBurnCount] = useState(confession.burnCount);
  const [isBurned, setIsBurned] = useState(confession.isBurnedByMe);

  const [isRelatePending, setIsRelatePending] = useState(false);
  const [isBurnPending, setIsBurnPending] = useState(false);

  // कमेन्ट खोल्ने/बन्द गर्ने र कतिवटा देखाउने स्टेट
  const [showComments, setShowComments] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  const [commentsList, setCommentsList] = useState<ConfessionComment[]>(
    confession.comments || [],
  );
  const [echoCount, setEchoCount] = useState(confession.echoCount);
  const [commentText, setCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  // जम्मा कमेन्टहरू
  const allComments = commentsList || [];
  const visibleComments = allComments.slice(0, visibleCount);
  const hasMoreComments = allComments.length > visibleCount;

  // Toggle Function
  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  // 🔖 Save / Bookmark Post Handler
  const handleToggleSave = () => {
    if (!isAuthenticated) {
      setMoreMenuOpen(false);
      requireLoginPrompt();
      return;
    }
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    setMoreMenuOpen(false);

    DarkToast.fire({
      icon: "success",
      title: nextSaved ? "Saved to your bookmarks" : "Removed from bookmarks",
    });
  };

  // 🔗 Copy Link to Post Handler
  const handleCopyPostLink = async () => {
    const shareUrl = `${window.location.origin}#${confession.id}`;
    setMoreMenuOpen(false);

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      DarkToast.fire({
        icon: "success",
        title: "Post link copied to clipboard!",
      });
    } catch {
      DarkToast.fire({
        icon: "error",
        title: "Couldn't copy link",
      });
    }
  };

  // 🚩 Report Post Handler
  const handleReportConfession = async () => {
    setMoreMenuOpen(false);

    const result = await DarkSwal.fire({
      title: "Report Confession",
      text: "Why are you reporting this confession?",
      input: "select",
      inputOptions: {
        harassment: "Harassment or Hate Speech",
        spam: "Spam or Promotion",
        violence: "Self-harm or Violence",
        inappropriate: "Inappropriate Content",
      },
      inputPlaceholder: "Select a reason",
      showCancelButton: true,
      confirmButtonText: "Submit Report",
      cancelButtonText: "Cancel",
      inputValidator: (value) =>
        !value ? "Please select a reason" : undefined,
    });

    if (result.isConfirmed) {
      DarkToast.fire({
        icon: "success",
        title: "Report received",
      });
    }
  };
  // Load More Function (अर्को ४ वटा थप्ने)
  const handleLoadMoreComments = () => {
    setVisibleCount((prev) => prev + 4);
  };

  // 👥 Follow सम्बन्धी लजिक र स्टेट
  const authorId = confession.author.id || confession.author.alias;
  const isAnonymous = confession.author.isAnonymous;
  const isMe = Boolean(
    isAuthenticated &&
    user &&
    (user.name === confession.author.alias ||
      user.username === confession.author.alias ||
      user.id === confession.author.id),
  );

  const [isFollowing, setIsFollowing] = useState(
    Boolean(confession.author.isFollowedByMe),
  );
  const [isFollowPending, setIsFollowPending] = useState(false);

  // Follow / Unfollow बटन क्लिक गर्दा चल्ने फङ्सन
  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      requireLoginPrompt();
      return;
    }
    if (isFollowPending || isAnonymous || isMe) return;

    setIsFollowPending(true);
    const nextState = !isFollowing;
    setIsFollowing(nextState); // तत्काल UI मा परिवर्तन (Optimistic)

    try {
      await toggleFollowAuthor(authorId);
    } catch {
      setIsFollowing(!nextState); // समस्या आएमा पुरानै अवस्थामा फर्काउने
    } finally {
      setIsFollowPending(false);
    }
  };

  // 💬 कमेन्ट पोस्ट गर्ने ह्यान्डलर
  // 💬 कमेन्ट पोस्ट गर्ने एउटै फङ्सन (लगइन भएको र Anonymous दुबैको लागि)
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isPostingComment) return;

    setIsPostingComment(true);
    try {
      // यदि युजर लगइन छ भने उसको नाम, छैन भने Anonymous alias बन्नेछ:
      const authorAlias =
        isAuthenticated && user
          ? user.name || user.username
          : `Anonymous #${Math.floor(100 + Math.random() * 900)}`;

      // API मा कमेन्ट पठाउने
      const newComment = await addComment(
        confession.id,
        commentText.trim(),
        authorAlias, // 👈 यहाँ authorAlias पास भयो
      );

      // कमेन्ट लिस्टको सुरुमा तुरुन्तै थप्ने र काउन्टर १ ले बढाउने
      setCommentsList((prev) => [newComment, ...prev]);
      setEchoCount((prev) => prev + 1);
      setCommentText(""); // इनपुट बक्स खाली गर्ने
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsPostingComment(false);
    }
  };

  // 🔒 Login Prompt Helper
  const requireLoginPrompt = () => {
    DarkSwal.fire({
      title: "Login Required",
      text: "You need to be logged in to react to this confession.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Log In",
      cancelButtonText: "Cancel",
    }).then((result) => {
      // प्रयोगकर्ताले "Log In" थिचे मात्र रिडाइरेक्ट हुन्छ
      if (result.isConfirmed) {
        router.push("/login");
      }
      // यदि "Cancel" वा बाहिर क्लिक गरेमा केही पनि हुँदैन, त्यहीँ बस्छ
    });
  };

  // Optimistic Relate handler
  const handleRelate = async () => {
    if (!isAuthenticated) {
      requireLoginPrompt();
      return;
    }
    if (isRelatePending) return;

    // Snapshot previous state for rollback
    const prevRelate = isRelatable;
    const prevCount = relateCount;

    // Optimistic UI update
    const nextState = !prevRelate;
    setIsRelatable(nextState);
    setRelateCount((prev) => prev + (nextState ? 1 : -1));
    setIsRelatePending(true);

    try {
      await toggleRelate(confession.id);
    } catch {
      // Rollback on failure
      setIsRelatable(prevRelate);
      setRelateCount(prevCount);
    } finally {
      setIsRelatePending(false);
    }
  };

  // Optimistic Burn/Vent handler
  const handleBurn = async () => {
    if (!isAuthenticated) {
      requireLoginPrompt();
      return;
    }
    if (isBurnPending) return;

    const prevBurn = isBurned;
    const prevCount = burnCount;

    const nextState = !prevBurn;
    setIsBurned(nextState);
    setBurnCount((prev) => prev + (nextState ? 1 : -1));
    setIsBurnPending(true);

    try {
      await toggleBurn(confession.id);
    } catch {
      setIsBurned(prevBurn);
      setBurnCount(prevCount);
    } finally {
      setIsBurnPending(false);
    }
  };

  // 📸 Image + Link सँगै सेयर गर्ने फङ्सन
  const handleShare = async () => {
    if (!cardRef.current || sharing) return;

    setSharing(true);
    setCapturing(true);

    try {
      // ब्रान्डिङ/वाटरमार्क रेन्डर हुन २ वटा फ्रेम पर्खिने
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r(null))),
      );
      await document.fonts.ready;

      // १. कार्डलाई तस्बिर बनाउने
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#070707",
        style: { padding: "20px" },
        filter: (node) =>
          !(
            node instanceof HTMLElement && node.dataset.noCapture !== undefined
          ),
      });

      if (!blob) throw new Error("Image generation failed");

      const file = new File([blob], "confession.png", { type: "image/png" });
      const shareUrl = `${window.location.origin}#${confession.id}`;
      // २. मोबाइलमा तस्बिर + लिङ्क सँगै सेयर गर्ने:
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "FrustratedBox Confession",
          text: shareUrl,
        });
      } else {
        // ३. डेस्कटपको लागि: तस्बिर डाउनलोड गर्ने र लिङ्क क्लिपबोर्डमा कपी गर्ने
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `confession-${confession.id}.png`;
        a.click();
        URL.revokeObjectURL(url);

        // लिङ्क पनि स्वतः कपी गरिदिने
        await navigator.clipboard.writeText(shareUrl);
        alert("Image downloaded & post link copied to clipboard!");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Failed to share:", err);
      }
    } finally {
      setCapturing(false);
      setSharing(false);
    }
  };

  // यदि युजरले यो पोस्ट Hide गरेमा:
  if (isHidden) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-zinc-900 bg-[#070707] p-4 text-xs text-zinc-500">
        <span>This confession has been hidden from your view.</span>
        <button
          type="button"
          onClick={() => setIsHidden(false)}
          className="text-red-400 hover:text-red-300 font-medium underline"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <article
      id={confession.id}
      ref={cardRef}
      className="group relative rounded-xl border border-zinc-900 bg-[#070707] p-5 shadow-sm transition-all duration-200 hover:border-zinc-800 hover:shadow-md"
    >
      {/* Top Header: Author Alias & Timestamp */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-zinc-300 ring-1 ring-zinc-800">
            {confession.author.alias.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-200">
                {confession.author.alias}
              </span>
            </div>
            <span className="text-[11px] text-zinc-500">
              {formatRelativeTime(confession.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isAnonymous && !isMe && (
            <button
              type="button"
              data-no-capture
              onClick={handleFollowToggle}
              disabled={isFollowPending}
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
                isFollowing
                  ? "border border-red-500 bg-red-800/80 text-zinc-300 hover:border-red-600/60 hover:text-red-400"
                  : "border border-red-600 bg-red-600 text-white hover:border-red-600 hover:bg-red-500"
              }`}
            >
              {isFollowing ? "Following" : "+ Follow"}
            </button>
          )}

          {/* 🔘 3-Dots More Options Menu */}
          <div className="relative">
            <button
              type="button"
              data-no-capture
              onClick={() => setMoreMenuOpen((prev) => !prev)}
              aria-label="More options"
              className={`rounded-md p-1.5 transition-colors ${
                moreMenuOpen
                  ? "bg-zinc-800 text-zinc-200"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              }`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {/* Dropdown Menu Popover */}
            {moreMenuOpen && (
              <>
                {/* बाहिर कतै क्लिक गर्दा मेनु बन्द हुने ब्याकड्रप */}
                <div
                  className="fixed inset-0 z-20 cursor-default"
                  onClick={() => setMoreMenuOpen(false)}
                />

                {/* मेनु बक्स */}
                <div className="absolute right-0 top-full mt-1.5 z-30 w-44 rounded-xl border border-zinc-800 bg-[#0c0c0e] p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  {/* १. Save Post */}
                  <button
                    type="button"
                    onClick={handleToggleSave}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                  >
                    <Bookmark
                      className={`h-3.5 w-3.5 ${
                        isSaved ? "fill-red-500 text-red-500" : "text-zinc-400"
                      }`}
                    />
                    <span>{isSaved ? "Saved" : "Save confession"}</span>
                  </button>

                  {/* २. Copy Link */}
                  <button
                    type="button"
                    onClick={handleCopyPostLink}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Link2 className="h-3.5 w-3.5 text-zinc-400" />
                    )}
                    <span>{copied ? "Copied!" : "Copy link"}</span>
                  </button>

                  {/* ३. Hide Post */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsHidden(true);
                      setMoreMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                  >
                    <EyeOff className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Hide confession</span>
                  </button>

                  <div className="my-1 border-t border-zinc-900" />

                  {/* ४. Report Post (रातो हाइलाइट) */}
                  <button
                    type="button"
                    onClick={handleReportConfession}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300"
                  >
                    <Flag className="h-3.5 w-3.5 text-red-400" />
                    <span>Report post</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Main Content Body */}
      <div className="py-1">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200 selection:bg-red-950 selection:text-red-200">
          {confession.content}
        </p>
      </div>
      {/* Dynamic Organic Tags */}
      {confession.tags && confession.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3">
          {confession.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick?.(tag)}
              className="rounded-full bg-zinc-900/80 px-2.5 py-0.5 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              #{tag}
            </button>
          ))}
          {/* Image ma matra dekhine footer */}
          {capturing && (
            <div className="mt-3 flex items-center justify-between border-t border-zinc-900/60 pt-3 text-[10px] text-zinc-500">
              <span className="font-semibold text-zinc-400">
                FrustratedBox 👻
              </span>
              <span>frustratedbox.com</span>
            </div>
          )}
        </div>
      )}
      {/* Action Bar */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-900/80 pt-3 text-xs text-zinc-400">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Relate Button */}
          <button
            type="button"
            onClick={handleRelate}
            aria-pressed={isRelatable}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all duration-150 active:scale-95 ${
              isRelatable
                ? "bg-red-950/40 text-red-400 ring-1 ring-red-900/60"
                : "hover:bg-zinc-900 hover:text-zinc-200"
            }`}
          >
            <Heart
              className={`h-4 w-4 transition-transform ${
                isRelatable ? "fill-red-600 stroke-red-600 scale-110" : ""
              }`}
            />
            <span>{relateCount}</span>
            <span className="hidden sm:inline text-[11px]">Relatable</span>
          </button>

          {/* Burn Button */}
          <button
            type="button"
            onClick={handleBurn}
            aria-pressed={isBurned}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all duration-150 active:scale-95 ${
              isBurned
                ? "bg-red-950/40 text-red-400 ring-1 ring-red-900/60"
                : "hover:bg-zinc-900 hover:text-zinc-200"
            }`}
          >
            <Flame
              className={`h-4 w-4 transition-transform ${
                isBurned ? "fill-red-600 stroke-red-600 scale-110" : ""
              }`}
            />
            <span>{burnCount}</span>
            <span className="hidden sm:inline text-[11px]">Burned</span>
          </button>

          {/* Echo / Replies Button */}
          <button
            type="button"
            onClick={toggleComments}
            aria-expanded={showComments}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
              showComments
                ? "bg-zinc-800 text-zinc-100"
                : "hover:bg-zinc-900 hover:text-zinc-200"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{echoCount}</span>{" "}
          </button>
        </div>{" "}
        {/* Share Button */}
        {/* Share Button (1-Click Image + Link) */}
        <button
          type="button"
          onClick={handleShare}
          disabled={sharing}
          aria-label="Share confession"
          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300 disabled:opacity-50"
        >
          {sharing ? (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
        </button>
      </div>{" "}
      {/* 💬 Echoes / Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-zinc-900/80 pt-3 space-y-2.5 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-semibold text-zinc-400">
              Echoes ({commentsList.length})
            </span>
            <span className="text-[11px] text-zinc-500">
              Showing {Math.min(visibleCount, commentsList.length)} of{" "}
              {commentsList.length}
            </span>
          </div>

          {isAuthenticated ? (
            <form
              onSubmit={handlePostComment}
              className="flex items-center gap-2 pb-1"
            >
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Echo your thoughts..."
                disabled={isPostingComment}
                className="flex-1 rounded-lg border border-zinc-900 bg-zinc-950/80 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-red-900/60 focus:outline-none focus:ring-1 focus:ring-red-900/60"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isPostingComment}
                className="flex items-center justify-center p-2 text-red-500 transition-colors hover:text-red-400 hover:bg-red-500/10 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPostingComment ? (
                  <span className="text-[10px]">Posting...</span>
                ) : (
                  <Send className="h-4 w-4 text-red-500" />
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-3 rounded-lg border border-zinc-900 bg-zinc-950/50 p-2.5 text-xs sm:flex-row sm:items-center sm:justify-between">
              <span className="text-zinc-400 shrink-0">
                Want to join the conversation?
              </span>

              <form
                onSubmit={handlePostComment}
                className="flex w-full items-center gap-2 sm:w-auto sm:flex-1 sm:max-w-md"
              >
                <div className="relative min-w-0 flex-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Echo anonymously..."
                    className="w-full rounded-lg bg-zinc-900/60 border border-zinc-800 px-3 py-2 pr-24 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500/50"
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 select-none">
                    Ghost mode 👻
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!commentText.trim() || isPostingComment}
                  className="flex items-center justify-center p-2 text-red-500 transition-colors hover:text-red-400 hover:bg-red-500/10 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPostingComment ? (
                    <span className="text-[10px]">Posting...</span>
                  ) : (
                    <Send className="h-4 w-4 text-red-500" />
                  )}
                </button>
              </form>
            </div>
          )}

          {commentsList.length === 0 ? (
            <p className="text-xs text-zinc-500 py-2">
              No echoes yet. Be the first to reply!
            </p>
          ) : (
            <>
              {visibleComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg border border-zinc-900 bg-zinc-900/40 p-2.5 text-xs sm:text-sm"
                >
                  <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                    <span className="font-medium text-zinc-300">
                      {comment.author.alias}
                    </span>
                    <span className="text-[10px]">
                      {new Date(comment.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-zinc-200 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}

              {hasMoreComments && (
                <button
                  type="button"
                  onClick={handleLoadMoreComments}
                  className="w-full mt-2 rounded-lg border border-zinc-900 bg-zinc-900/30 py-2 text-center text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
                >
                  See more echoes ({commentsList.length - visibleCount}{" "}
                  remaining)
                </button>
              )}
            </>
          )}
        </div>
      )}
    </article>
  );
}
