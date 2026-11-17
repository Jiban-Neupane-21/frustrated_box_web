// lib/moderationService.ts
import { mockItems } from "@/lib/mock-safety-data";
import type {
  ActionType,
  QueueItem,
  QueueItemView,
  Reason,
  Severity,
  Status,
} from "@/types/report.type";

export interface ModerationFilters {
  status?: Status | "all";
  reason?: Reason | "all";
  sort?: "priority" | "newest";
  q?: string;
}

// ============================================================================
// CONFIGURATION: Real API Switch
// ============================================================================
// जब रियल ब्याकइन्ड तयार हुन्छ, .env मा NEXT_PUBLIC_API_URL राख्नुहोस् वा यसलाई true बनाउनुहोस्।
const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_URL);
const REAL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/reports";

// ============================================================================
// MOCK DATA STORE & LOGIC (Client-Side & Offline-Safe)
// ============================================================================
const STORAGE_KEY = "fb_safety_queue";

const SEVERITY_WEIGHT: Record<Reason, number> = {
  child_safety: 10,
  self_harm: 9,
  violence: 8,
  hate_speech: 6,
  harassment: 5,
  nudity: 4,
  misinformation: 3,
  spam: 1,
};

function computePriority(i: QueueItem): number {
  const reasonsList = Object.keys(i.reasons) as Reason[];
  const top =
    reasonsList.length > 0
      ? Math.max(...reasonsList.map((r) => SEVERITY_WEIGHT[r] ?? 1))
      : 1;
  return Math.round(
    top * 10 +
      Math.min(i.reportCount, 50) +
      i.author.priorViolations * 5 +
      i.reporterTrustAvg * 10
  );
}

function severityOf(score: number): Severity {
  if (score >= 100) return "critical";
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function toView(i: QueueItem): QueueItemView {
  const priority = computePriority(i);
  return { ...i, priority, severity: severityOf(priority) };
}

// LocalStorage बाट Mock डेटा ल्याउने वा mockItems बाट इनिसियलाइज गर्ने
function getStoredQueue(): QueueItem[] {
  if (typeof window === "undefined") return mockItems;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockItems));
    return mockItems;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return mockItems;
  }
}

function saveStoredQueue(items: QueueItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// ============================================================================
// SERVICE IMPLEMENTATION
// ============================================================================
export const moderationService = {
  /**
   * १. रिपोर्टहरूको सूची ल्याउने (Get Reports List)
   */
  async getReports(
    filters: ModerationFilters = {},
    token?: string | null
  ): Promise<QueueItemView[]> {
    // -------------------------------------------------------------
    // REAL API MODE (भविष्यमा ब्याकइन्ड बनेपछि चल्ने)
    // -------------------------------------------------------------
    if (USE_REAL_API) {
      const params = new URLSearchParams({
        status: filters.status ?? "all",
        reason: filters.reason ?? "all",
        sort: filters.sort ?? "priority",
        q: filters.q ?? "",
      });

      const res = await fetch(`${REAL_API_BASE}?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ error: "Failed to load reports" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      return Array.isArray(data.items) ? data.items : [];
    }

    // -------------------------------------------------------------
    // MOCK MODE (हालको लागि १००% सुरक्षित र भरपर्दो)
    // -------------------------------------------------------------
    // वास्तविक API जस्तै थोरै अनुभव दिन सानो delay (simulated latency)
    await new Promise((resolve) => setTimeout(resolve, 80));

    const rawItems = getStoredQueue();
    let rows = rawItems.map(toView);

    // Filter by status
    if (filters.status && filters.status !== "all") {
      rows = rows.filter((r) => r.status === filters.status);
    }

    // Filter by reason
    if (filters.reason && filters.reason !== "all") {
      rows = rows.filter(
        (r) => r.reasons[filters.reason as Reason] !== undefined
      );
    }

    // Filter by search query (content or author name)
    if (filters.q && filters.q.trim()) {
      const s = filters.q.toLowerCase().trim();
      rows = rows.filter(
        (r) =>
          r.contentPreview.toLowerCase().includes(s) ||
          r.author.name.toLowerCase().includes(s)
      );
    }

    // Sort
    rows.sort((a, b) =>
      filters.sort === "newest"
        ? +new Date(b.createdAt) - +new Date(a.createdAt)
        : b.priority - a.priority
    );

    return rows;
  },

  /**
   * २. रिपोर्टलाई Claim / Lock गर्ने
   */
  async claimReport(
    id: string,
    adminId: string,
    adminRole: string,
    token?: string | null
  ): Promise<QueueItemView> {
    // -------------------------------------------------------------
    // REAL API MODE
    // -------------------------------------------------------------
    if (USE_REAL_API) {
      const res = await fetch(`${REAL_API_BASE}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Id": adminId,
          "X-Admin-Role": adminRole,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type: "claim" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to claim item");
      return data;
    }

    // -------------------------------------------------------------
    // MOCK MODE
    // -------------------------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 80));

    const items = getStoredQueue();
    const item = items.find((i) => i.id === id);

    if (!item) {
      throw new Error("Report not found");
    }

    if (item.assignedTo && item.assignedTo !== adminId) {
      throw new Error(`Already claimed by ${item.assignedTo}`);
    }

    item.assignedTo = adminId;
    if (item.status === "pending") {
      item.status = "in_review";
    }

    saveStoredQueue(items);
    return toView(item);
  },

  /**
   * ३. रिपोर्टमा Action (Dismiss, Ban, Warn, आदि) लिने
   */
  async applyAction(
    id: string,
    action: ActionType,
    note: string,
    adminId: string,
    adminRole: string,
    token?: string | null
  ): Promise<QueueItemView> {
    // -------------------------------------------------------------
    // REAL API MODE
    // -------------------------------------------------------------
    if (USE_REAL_API) {
      const res = await fetch(`${REAL_API_BASE}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Id": adminId,
          "X-Admin-Role": adminRole,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type: "action", action, note }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to apply action");
      return data;
    }

    // -------------------------------------------------------------
    // MOCK MODE
    // -------------------------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 80));

    const items = getStoredQueue();
    const item = items.find((i) => i.id === id);

    if (!item) {
      throw new Error("Report not found");
    }

    if (item.assignedTo && item.assignedTo !== adminId) {
      throw new Error(`Claimed by ${item.assignedTo}`);
    }

    if (item.status === "actioned" || item.status === "dismissed") {
      throw new Error("Report is already resolved");
    }

    // History मा रेकर्ड थप्ने
    item.history.push({
      id: `h_${Date.now()}`,
      adminId,
      adminRole,
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

    saveStoredQueue(items);
    return toView(item);
  },

  /**
   * ४. (वैकल्पिक) Mock Data रिसेट गर्ने
   */
  resetMockData() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};
