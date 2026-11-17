// types/report.type.ts
export type Reason =
  | "child_safety" | "self_harm" | "violence" | "hate_speech"
  | "harassment" | "nudity" | "misinformation" | "spam";

export type Status = "pending" | "in_review" | "actioned" | "dismissed";
export type ActionType = "dismiss" | "remove_content" | "warn" | "suspend" | "ban" | "escalate";
export type Severity = "critical" | "high" | "medium" | "low";

export interface ModerationAction {
  id: string;
  adminId: string;
  adminRole?: string; // ← यो लाइन थप्नुपर्छ (ताकि route.ts को adminRole म्याच होस्)
  action: ActionType;
  note: string;
  createdAt: string;
}

export interface QueueItem {
  id: string;
  targetType: "post" | "comment" | "user" | "message";
  targetId: string;
  contentPreview: string;
  contentSensitive: boolean;
  author: { id: string; name: string; priorViolations: number };
  reasons: Partial<Record<Reason, number>>; // reason -> number of reports
  reportCount: number;
  reporterTrustAvg: number; // 0..1, how often this group's past reports were valid
  status: Status;
  assignedTo: string | null;
  createdAt: string;
  history: ModerationAction[];
}

export type QueueItemView = QueueItem & { priority: number; severity: Severity };