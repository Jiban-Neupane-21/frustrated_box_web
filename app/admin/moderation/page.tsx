"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  ActionType,
  QueueItemView,
  Reason,
  Status,
} from "@/types/report.type";
import { Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { moderationService } from "@/lib/moderationService";

const REASON_LABEL: Record<Reason, string> = {
  child_safety: "Child safety",
  self_harm: "Self-harm",
  violence: "Violence",
  hate_speech: "Hate speech",
  harassment: "Harassment",
  nudity: "Nudity",
  misinformation: "Misinformation",
  spam: "Spam",
};

const STATUS_LABEL: Record<Status, string> = {
  pending: "Pending",
  in_review: "In review",
  actioned: "Actioned",
  dismissed: "Dismissed",
};

const ACTION_LABEL: Record<ActionType, string> = {
  dismiss: "Dismiss",
  remove_content: "Remove content",
  warn: "Warn user",
  suspend: "Suspend user",
  ban: "Ban user",
  escalate: "Escalate",
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500 text-red-500 border-red-500/20",
  high: "bg-orange-500 text-orange-500 border-orange-500/20",
  medium: "bg-amber-500 text-amber-500 border-amber-500/20",
  low: "bg-slate-500 text-slate-500 border-slate-500/20",
};

const timeAgo = (iso: string) => {
  const h = Math.max(1, Math.round((Date.now() - +new Date(iso)) / 3600_000));
  return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
};

export default function SafetyQueuePage() {
  const { user, token, isLoading: authLoading } = useAuth();

  const ME = user?.username ?? "anonymous";
  const userRole = (user?.role ?? "USER").toUpperCase();
  const isAuthorized = userRole === "ADMIN" || userRole === "MODERATOR";

  const [items, setItems] = useState<QueueItemView[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | "all">("pending");
  const [reason, setReason] = useState<Reason | "all">("all");
  const [sort, setSort] = useState<"priority" | "newest">("priority");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [note, setNote] = useState("");
  const [toast, setToast] = useState("");

  const say = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const load = useCallback(async () => {
    if (!isAuthorized) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await moderationService.getReports(
        { status, reason, sort, q },
        token,
      );
      setItems(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load reports";
      setErrorMessage(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [status, reason, sort, q, token, isAuthorized]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Verifying permissions…</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              You need Admin or Moderator privileges to access the safety queue.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selected = items.find((i) => i.id === selectedId) ?? null;
  const mine = selected?.assignedTo === ME;
  const lockedByOther = Boolean(selected?.assignedTo && !mine);
  const resolved =
    selected?.status === "actioned" || selected?.status === "dismissed";

  const claim = async () => {
    if (!selected) return;
    try {
      await moderationService.claimReport(selected.id, ME, userRole, token);
      say("Claimed. Only you can act on this item now.");
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error claiming item";
      say(msg);
    }
  };

  const act = async (action: ActionType) => {
    if (!selected) return;
    if (action === "ban" && !window.confirm("Ban this user permanently?"))
      return;

    try {
      await moderationService.applyAction(
        selected.id,
        action,
        note,
        ME,
        userRole,
        token,
      );
      say(`${ACTION_LABEL[action]} saved`);
      setNote("");
      await load();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error performing action";
      say(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 box-border">
      {/* Header */}
      <header className="flex justify-between items-baseline mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Global safety queue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {items.length} items · signed in as{" "}
            <span className="font-semibold text-foreground">
              {user?.name || ME} (@{user?.username || ME})
              <Badge variant="secondary" className="ml-2 text-xs">
                {userRole}
              </Badge>
            </span>
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Search content or author..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />

        <Select
          value={status}
          onValueChange={(v) => setStatus(v as Status | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(STATUS_LABEL) as Status[]).map((k) => (
              <SelectItem key={k} value={k}>
                {STATUS_LABEL[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={reason}
          onValueChange={(v) => setReason(v as Reason | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All reasons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All reasons</SelectItem>
            {(Object.keys(REASON_LABEL) as Reason[]).map((k) => (
              <SelectItem key={k} value={k}>
                {REASON_LABEL[k]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(v) => setSort(v as "priority" | "newest")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Highest priority</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <Button variant="outline" size="sm" onClick={() => load()}>
            Retry
          </Button>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,420px)_1fr] gap-6 items-start">
        {/* Reports List */}
        <div className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden divide-y">
          {loading && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading reports…
            </div>
          )}
          {!loading && items.length === 0 && !errorMessage && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No reports match these filters. Try another status.
            </div>
          )}
          {items.map((i) => {
            const isSelected = i.id === selectedId;
            const isLockedByOther = Boolean(
              i.assignedTo && i.assignedTo !== ME,
            );
            const sevColorClass =
              SEVERITY_COLORS[i.severity] || "bg-muted text-muted-foreground";

            return (
              <button
                key={i.id}
                className={`grid grid-cols-[6px_1fr] text-left w-full bg-transparent border-0 cursor-pointer transition-colors hover:bg-muted/50 ${
                  isSelected ? "bg-accent/10 dark:bg-accent/20" : ""
                }`}
                onClick={() => {
                  setSelectedId(i.id);
                  setNote("");
                }}
              >
                <span
                  className={`self-stretch ${sevColorClass.split(" ")[0]}`}
                />
                <div className="p-3.5 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span
                        className={`uppercase text-[10px] px-1.5 py-0.5 rounded border ${sevColorClass}`}
                      >
                        {i.severity}
                      </span>
                      · {i.reportCount} reports
                    </span>
                    <span className="flex items-center gap-1">
                      {isLockedByOther && (
                        <span title={`Locked by ${i.assignedTo}`}>
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                        </span>
                      )}
                      {timeAgo(i.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm line-clamp-2 leading-snug">
                    {i.contentSensitive
                      ? "Sensitive content: open to review"
                      : i.contentPreview}
                  </p>

                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {i.author.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isLockedByOther ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          {i.assignedTo}
                        </span>
                      ) : (
                        <span>
                          {STATUS_LABEL[i.status]}
                          {i.assignedTo ? ` · ${i.assignedTo}` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <Card className="p-6 sticky top-6 shadow-sm">
          {!selected ? (
            <div className="p-12 text-center text-muted-foreground">
              Select a report to review it.
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold tracking-tight">
                {selected.targetType}{" "}
                <span className="text-muted-foreground font-normal text-sm">
                  #{selected.targetId}
                </span>
              </h2>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/40 p-3 rounded-lg border text-xs">
                <div>
                  <dt className="text-muted-foreground mb-0.5">
                    Priority score
                  </dt>
                  <dd className="font-semibold">
                    {selected.priority} ({selected.severity})
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground mb-0.5">Author</dt>
                  <dd className="font-semibold">{selected.author.name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground mb-0.5">
                    Past violations
                  </dt>
                  <dd className="font-semibold">
                    {selected.author.priorViolations}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground mb-0.5">
                    Reporter trust
                  </dt>
                  <dd className="font-semibold">
                    {Math.round(selected.reporterTrustAvg * 100)}%
                  </dd>
                </div>
              </dl>

              <div className="space-y-2">
                <div
                  className={`p-4 rounded-lg border bg-background text-sm leading-relaxed relative ${
                    selected.contentSensitive && !revealed.has(selected.id)
                      ? "filter blur-md select-none"
                      : ""
                  }`}
                >
                  {selected.contentPreview}
                </div>
                {selected.contentSensitive && !revealed.has(selected.id) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setRevealed(new Set(revealed).add(selected.id))
                    }
                  >
                    Show sensitive content
                  </Button>
                )}
              </div>

              {/* Reasons Breakdown */}
              <div className="flex flex-col gap-2">
                {Object.entries(selected.reasons).map(([r, n]) => (
                  <div
                    className="grid grid-cols-[120px_1fr_28px] gap-3 items-center text-xs"
                    key={r}
                  >
                    <span className="text-muted-foreground font-medium">
                      {REASON_LABEL[r as Reason]}
                    </span>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(n! / selected.reportCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-right font-medium">{n}</span>
                  </div>
                ))}
              </div>

              {lockedByOther && (
                <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 p-3 rounded-md border border-amber-500/20">
                  Claimed by {selected.assignedTo}. You can view this item but
                  not act on it.
                </p>
              )}

              {!resolved && !selected.assignedTo && (
                <div className="flex gap-2">
                  <Button className="w-full" onClick={claim}>
                    Claim this item
                  </Button>
                </div>
              )}

              {mine && !resolved && (
                <div className="flex flex-col gap-3 pt-2 border-t">
                  <Textarea
                    placeholder="Note for the audit log (required for ban or suspend)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => act("dismiss")}
                    >
                      Dismiss
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => act("remove_content")}
                    >
                      Remove content
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => act("warn")}
                    >
                      Warn user
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={!note.trim()}
                      onClick={() => act("suspend")}
                    >
                      Suspend user
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={!note.trim()}
                      onClick={() => act("ban")}
                    >
                      Ban user
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => act("escalate")}
                    >
                      Escalate
                    </Button>
                  </div>
                </div>
              )}

              {selected.history.length > 0 && (
                <div className="pt-2 border-t flex flex-col gap-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Moderation history
                  </span>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {selected.history.map((h) => (
                      <li key={h.id} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                        <span>
                          <strong className="text-foreground">
                            {ACTION_LABEL[h.action]}
                          </strong>{" "}
                          by {h.adminId}
                          {h.adminRole ? ` (${h.adminRole})` : ""},{" "}
                          {timeAgo(h.createdAt)}
                          {h.note ? `: ${h.note}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {toast && (
        <div
          className="fixed bottom-4 right-4 z-50 bg-foreground text-background px-4 py-2.5 rounded-md shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2"
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
