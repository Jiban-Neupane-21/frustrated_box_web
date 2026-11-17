# Project Color Palette & Design Tokens Guide

This document summarizes the exact color palette, design tokens, and severity status colors used across the **Admin Safety Queue & Moderation System**. Use this reference for future component styling, UI consistency, and theme customization.

---

## 1. Core Semantic Colors (Tailwind CSS Variables)

These base colors adapt automatically between **Light Mode** and **Dark Mode** via Tailwind CSS classes.

| Token / Class | Context / Purpose | Standard Light Hex / Value | Standard Dark Hex / Value |
| :--- | :--- | :--- | :--- |
| `bg-background` | Global Page Background | `#FFFFFF` | `#09090B` |
| `text-foreground` | Primary Body Text & Headings | `#09090B` | `#FAFAFA` |
| `bg-card` | Card & List Containers | `#FFFFFF` | `#09090B` |
| `text-card-foreground` | Text inside Cards | `#09090B` | `#FAFAFA` |
| `text-muted-foreground` | Subtitles, Timestamps, Labels | `#71717A` | `#A1A1AA` |
| `bg-muted` | Badges, Dividers, Progress Bar Tracks | `#F4F4F5` | `#27272A` |
| `bg-accent/10` | Active Item / Selected State | `rgba(244, 244, 245, 0.1)` | `rgba(39, 39, 42, 0.2)` |
| `bg-primary` | Active Progress Bar Indicator | `#18181B` | `#FAFAFA` |

---

## 2. Severity Status Colors (`SEVERITY_COLORS`)

Used for risk indication on moderation items, report badges, and priority indicators.

```tsx
const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500 text-red-500 border-red-500/20",
  high: "bg-orange-500 text-orange-500 border-orange-500/20",
  medium: "bg-amber-500 text-amber-500 border-amber-500/20",
  low: "bg-slate-500 text-slate-500 border-slate-500/20",
};
```

| Severity Level | Color Name | Main Color Hex | Border Transparency Hex | Visual Representation |
| :--- | :--- | :--- | :--- | :--- |
| **Critical** | `red-500` | `#EF4444` | `rgba(239, 68, 68, 0.2)` | 🔴 High Priority / Severe Violations |
| **High** | `orange-500` | `#F97316` | `rgba(249, 115, 22, 0.2)` | 🟠 High Alert |
| **Medium** | `amber-500` | `#F59E0B` | `rgba(245, 158, 11, 0.2)` | 🟡 Medium Alert |
| **Low** | `slate-500` | `#64748B` | `rgba(100, 116, 139, 0.2)` | ⚪ Low Risk |

---

## 3. Analytics & Emotion Share Chart Colors (`mock-admin-analytics.ts`)

Used in dashboard analytics charts to categorize community emotional categories.

```ts
export const emotionsBreakdown = [
  { emotion: "Workplace Burnout & Corporate Rage", color: "#991b1b" },
  { emotion: "Future Anxiety & Career Paralysis", color: "#b91c1c" },
  { emotion: "Love Life & Emotional Betrayal", color: "#7f1d1d" },
  { emotion: "Academic & Exam Stress", color: "#450a0a" },
];
```

| Category | Hex Code | Visual Tone | Usage |
| :--- | :--- | :--- | :--- |
| Workplace Burnout | `#991B1B` | Dark Red | Analytics Pie Chart / Bar |
| Future Anxiety | `#B91C1C` | Red | Analytics Pie Chart / Bar |
| Love Life & Betrayal | `#7F1D1D` | Deep Crimson | Analytics Pie Chart / Bar |
| Academic Stress | `#450A0A` | Dark Maroon | Analytics Pie Chart / Bar |

---

## 4. Moderation Notice & Alert Colors

Used for contextual warnings like locked states or claimed items.

| UI Element | Tailwind Class | Light Hex | Dark Hex | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Claim Warning Text** | `text-amber-600` / `dark:text-amber-400` | `#D97706` | `#FBBF24` | Alert text for items locked by another admin |
| **Claim Warning Box** | `bg-amber-500/10` | `rgba(245, 158, 11, 0.1)` | Item lock box background |
| **Claim Warning Border** | `border-amber-500/20` | `rgba(245, 158, 11, 0.2)` | Subtly highlighted lock border |

---

## 5. UI Button Variant Guidelines

- **Primary Action (Claim Item):** Default solid background (`bg-primary`)
- **Secondary Actions (Dismiss, Remove, Warn):** `variant="outline"` (`border border-input bg-background hover:bg-accent`)
- **Destructive Actions (Suspend, Ban):** `variant="destructive"` (`bg-red-500 text-white hover:bg-red-600`)
- **Escalate Action:** `variant="secondary"` (`bg-secondary text-secondary-foreground hover:bg-secondary/80`)

---

## 📌 Usage Quick Reference (Copy & Paste snippet)

```tsx
// Using Severity classes dynamically
<span className={`uppercase text-[10px] px-1.5 py-0.5 rounded border ${SEVERITY_COLORS[item.severity]}`}>
  {item.severity}
</span>

// Lock alert box example
<div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-md">
  Claimed by {assignedTo}.
</div>
```