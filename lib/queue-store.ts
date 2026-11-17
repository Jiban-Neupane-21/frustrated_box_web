import { mockItems } from "./mock-safety-data";
import type { ActionType, QueueItem, QueueItemView, Reason, Severity, Status } from "@/types/report.type";

// In-memory store. Survives hot reload in dev. Replace with DB calls later.
const g = globalThis as unknown as { __safetyQueue?: QueueItem[] };
const items: QueueItem[] = (g.__safetyQueue ??= structuredClone(mockItems));

const SEVERITY_WEIGHT: Record<Reason, number> = {
  child_safety: 10, self_harm: 9, violence: 8, hate_speech: 6,
  harassment: 5, nudity: 4, misinformation: 3, spam: 1,
};

export function computePriority(i: QueueItem): number {
  const top = Math.max(...(Object.keys(i.reasons) as Reason[]).map((r) => SEVERITY_WEIGHT[r]));
  return Math.round(
    top * 10 + Math.min(i.reportCount, 50) + i.author.priorViolations * 5 + i.reporterTrustAvg * 10
  );
}

export function severityOf(score: number): Severity {
  if (score >= 100) return "critical";
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

const toView = (i: QueueItem): QueueItemView => {
  const priority = computePriority(i);
  return { ...i, priority, severity: severityOf(priority) };
};

export interface Filters {
  status?: Status | "all";
  reason?: Reason | "all";
  q?: string;
  sort?: "priority" | "newest";
}

export function listItems({ status = "all", reason = "all", q = "", sort = "priority" }: Filters = {}) {
  let rows = items.map(toView);
  if (status !== "all") rows = rows.filter((r) => r.status === status);
  if (reason !== "all") rows = rows.filter((r) => r.reasons[reason] !== undefined);
  if (q) {
    const s = q.toLowerCase();
    rows = rows.filter(
      (r) => r.contentPreview.toLowerCase().includes(s) || r.author.name.toLowerCase().includes(s)
    );
  }
  rows.sort((a, b) =>
    sort === "newest" ? +new Date(b.createdAt) - +new Date(a.createdAt) : b.priority - a.priority
  );
  return rows;
}

const find = (id: string) => items.find((i) => i.id === id);

export function claimItem(id: string, adminId: string) {
  const item = find(id);
  if (!item) return { error: "Not found", code: 404 } as const;
  if (item.assignedTo && item.assignedTo !== adminId)
    return { error: `Already claimed by ${item.assignedTo}`, code: 409 } as const;
  item.assignedTo = adminId;
  if (item.status === "pending") item.status = "in_review";
  return { item: toView(item) } as const;
}

export function applyAction(id: string, adminId: string, action: ActionType, note: string, adminRole?: string) {
  const item = find(id);
  if (!item) return { error: "Not found", code: 404 } as const;
  if (item.assignedTo && item.assignedTo !== adminId)
    return { error: `Claimed by ${item.assignedTo}`, code: 409 } as const;
  if (item.status === "actioned" || item.status === "dismissed")
    return { error: "Already resolved", code: 409 } as const;

  item.history.push({
    id: `h_${Date.now()}`, 
    adminId, 
    adminRole,           // ← ADD ROLE TO HISTORY
    action, 
    note, 
    createdAt: new Date().toISOString(),
  });
  if (action === "escalate") {
    item.status = "in_review";
    item.assignedTo = "senior_admin";
  } else {
    item.status = action === "dismiss" ? "dismissed" : "actioned";
    item.assignedTo = adminId;
  }
  return { item: toView(item) } as const;
}