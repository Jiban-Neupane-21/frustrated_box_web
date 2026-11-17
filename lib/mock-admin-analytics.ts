// lib/mock-admin-analytics.ts

export interface MetricCardData {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

export interface EmotionShare {
  emotion: string;
  percentage: number;
  color: string;
}

export interface WeeklyTrendItem {
  day: string;
  vents: number;
  stressLevel: number; // percentage
}

export const mockAnalyticsData = {
  metrics: [
    { title: "Total Platform Vents", value: "3,240", change: "+14.2% this week", trend: "up" },
    { title: "Average Stress Index", value: "76.8%", change: "+4.1% vs last week", trend: "up" },
    { title: "Peak Venting Window", value: "11 PM - 2 AM", change: "High late-night traffic", trend: "neutral" },
    { title: "Active Communities", value: "6 Spaces", change: "Stable engagement", trend: "up" },
  ] as MetricCardData[],

  emotionsBreakdown: [
    { emotion: "Workplace Burnout & Corporate Rage", percentage: 45, color: "#991b1b" },
    { emotion: "Future Anxiety & Career Paralysis", percentage: 25, color: "#b91c1c" },
    { emotion: "Love Life & Emotional Betrayal", percentage: 18, color: "#7f1d1d" },
    { emotion: "Academic & Exam Stress", percentage: 12, color: "#450a0a" },
  ] as EmotionShare[],

  weeklyTrend: [
    { day: "Mon", vents: 320, stressLevel: 68 },
    { day: "Tue", vents: 380, stressLevel: 72 },
    { day: "Wed", vents: 450, stressLevel: 79 },
    { day: "Thu", vents: 410, stressLevel: 74 },
    { day: "Fri", vents: 590, stressLevel: 88 },
    { day: "Sat", vents: 640, stressLevel: 92 },
    { day: "Sun", vents: 450, stressLevel: 75 },
  ] as WeeklyTrendItem[],
};