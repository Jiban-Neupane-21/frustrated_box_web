import type { QueueItem } from "@/types/report.type";

const ago = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

export const mockItems: QueueItem[] = [
  {
    id: "q_001", targetType: "post", targetId: "post_8841",
    contentPreview: "[Graphic image: alleged assault] Caption: dekhnus yo kasto hunchha...",
    contentSensitive: true,
    author: { id: "u_204", name: "Ramesh K.", priorViolations: 2 },
    reasons: { violence: 31, hate_speech: 4 }, reportCount: 35, reporterTrustAvg: 0.82,
    status: "pending", assignedTo: null, createdAt: ago(1), history: [],
  },
  {
    id: "q_002", targetType: "post", targetId: "post_8790",
    contentPreview: "[Image flagged: possible minor in unsafe context] Caption hidden pending review.",
    contentSensitive: true,
    author: { id: "u_511", name: "Anon_Seller", priorViolations: 0 },
    reasons: { child_safety: 9 }, reportCount: 9, reporterTrustAvg: 0.9,
    status: "pending", assignedTo: null, createdAt: ago(3), history: [],
  },
  {
    id: "q_003", targetType: "comment", targetId: "cmt_20931",
    contentPreview: "Timi jasto manche yaha basna layak chhainau, bhag yaha bata, natra...",
    contentSensitive: false,
    author: { id: "u_377", name: "Sunita M.", priorViolations: 1 },
    reasons: { harassment: 6 }, reportCount: 6, reporterTrustAvg: 0.6,
    status: "in_review", assignedTo: "admin_sita", createdAt: ago(6), history: [],
  },
  {
    id: "q_004", targetType: "post", targetId: "post_8702",
    contentPreview: "Aba ma kei garna sakdina, sabai kura sakiyo bhanera lagyo...",
    contentSensitive: true,
    author: { id: "u_120", name: "Bikash T.", priorViolations: 0 },
    reasons: { self_harm: 5 }, reportCount: 5, reporterTrustAvg: 0.75,
    status: "pending", assignedTo: null, createdAt: ago(2), history: [],
  },
  {
    id: "q_005", targetType: "post", targetId: "post_8611",
    contentPreview: "BREAKING: yo pani khanda cancer thik huncha, doctor le lukayeko kura!",
    contentSensitive: false,
    author: { id: "u_098", name: "HealthTips_NP", priorViolations: 3 },
    reasons: { misinformation: 14, spam: 3 }, reportCount: 17, reporterTrustAvg: 0.55,
    status: "pending", assignedTo: null, createdAt: ago(12), history: [],
  },
  {
    id: "q_006", targetType: "message", targetId: "msg_5521",
    contentPreview: "Click here to win iPhone 16 -> bit.ly/xxxxx (sent to 240 users)",
    contentSensitive: false,
    author: { id: "u_650", name: "promo_deals77", priorViolations: 5 },
    reasons: { spam: 22 }, reportCount: 22, reporterTrustAvg: 0.4,
    status: "pending", assignedTo: null, createdAt: ago(5), history: [],
  },
  {
    id: "q_007", targetType: "post", targetId: "post_8500",
    contentPreview: "[Image: partial nudity, art-class context claimed]",
    contentSensitive: true,
    author: { id: "u_301", name: "Anita S.", priorViolations: 0 },
    reasons: { nudity: 3 }, reportCount: 3, reporterTrustAvg: 0.3,
    status: "pending", assignedTo: null, createdAt: ago(20), history: [],
  },
  {
    id: "q_008", targetType: "comment", targetId: "cmt_19002",
    contentPreview: "Tero post ekdam bekaar chha, delete gar.",
    contentSensitive: false,
    author: { id: "u_412", name: "Prakash L.", priorViolations: 0 },
    reasons: { harassment: 2 }, reportCount: 2, reporterTrustAvg: 0.2,
    status: "dismissed", assignedTo: "admin_sita", createdAt: ago(30),
    history: [{ id: "h_1", adminId: "admin_sita", action: "dismiss", note: "Mild disagreement, not harassment.", createdAt: ago(28) }],
  },
];