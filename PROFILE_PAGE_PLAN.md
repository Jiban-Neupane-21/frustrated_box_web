# FrustratedBox — User Profile Page Implementation Guide & Checklist

> **Purpose:** This document serves as the implementation checklist and technical roadmap for building the user profile page (`/profile/[username]` and `/profile/@${username}`). Keep this file open in VS Code to track progress.

---

## 📋 Quick Implementation Checklist

### Phase 1: Data Access & Resolver Layer (`app/features/profile/api.ts`)
- [ ] Create `app/features/profile/types.ts` (Profile stats, tab types, view modes).
- [ ] Create `app/features/profile/api.ts` with mock database queries:
  - [ ] `getUserByUsername(username: string): Promise<User | null>` (resolves from `INITIAL_MOCK_USERS` + `localStorage`).
  - [ ] `getUserConfessions(userId: string, isOwnProfile: boolean): Promise<Confession[]>` (filters `BASE_CONFESSIONS` and `BULK_CONFESSIONS`).
  - [ ] `getUserEchoes(userId: string): Promise<Array<{ confession: Confession; comment: ConfessionComment }>>` (threaded replies).
  - [ ] `getUserStats(userId: string): Promise<{ ventCount: number; relateCount: number; burnCount: number; communityCount: number }>`
- [ ] Add unit verification to ensure all 20 characters from `lib/mockData.ts` resolve cleanly.

---

### Phase 2: UI Components Breakdown (`app/features/profile/components/`)
- [ ] **`ProfileBanner.tsx`**:
  - [ ] Dark cyber crimson banner with subtle noise grid and gradient overlay.
  - [ ] Fallback support for custom `coverUrl` if present.
- [ ] **`ProfileHeader.tsx`**:
  - [ ] Avatar with deterministic Dicebear seed + role ring.
  - [ ] Authority badge indicator (`ADMIN` = Glowing Red ShieldCheck, `MODERATOR` = Amber Shield, `OWNER` = Crimson Crown, `USER` = Clean Ring).
  - [ ] Action buttons:
    - If **Own Profile**: "Edit Profile" button + "Settings" shortcut.
    - If **Other User**: "Follow / Unfollow" button + "Share" link copy toast.
- [ ] **`ProfileMeta.tsx`**:
  - [ ] Full Name and `@username`.
  - [ ] User Bio (styled with subtle italic quotes).
  - [ ] Metadata badges with Lucide icons:
    - [ ] 💼 Work (`occupation` @ `company`).
    - [ ] 🎓 Education (`degree` @ `schoolOrCollege`).
    - [ ] 📍 Location (`city`, `hometown`).
    - [ ] 💔 Relationship status (`Complicated`, `Single`, etc.).
    - [ ] 📅 Joined date (`Joined October 2026`).
    - [ ] 🌐 Website (clickable link with `ExternalLink` icon).
- [ ] **`ProfileStatsBar.tsx`**:
  - [ ] 4-card metric strip:
    - 🔥 **Total Vents** (Confessions count).
    - ❤️ **Relates Received** (Resonance score).
    - ⚡ **Burns Sparked** (Frustration energy).
    - 🛡️ **Communities** (Spaces joined or managed).
- [ ] **`ProfileTabs.tsx`**:
  - [ ] Tab 1: **Vents** (Confessions authored by user).
  - [ ] Tab 2: **Echoes** (Comments & replies made by user).
  - [ ] Tab 3: **Communities** (Owned, moderated, and joined spaces).
  - [ ] Tab 4: **Saved** (Only visible on own profile).
- [ ] **`ProfileCommunityCard.tsx`**:
  - [ ] Compact cards showing community avatar/slug, member/mod badge, and pending report counters for moderators.

---

### Phase 3: Route Setup (`app/profile/`)
- [ ] Create `app/profile/[username]/page.tsx`:
  - [ ] Dynamic param normalization (strip `@` prefix so both `/profile/@devbro` and `/profile/devbro` work seamlessly).
  - [ ] Resolve user profile via `api.ts`.
  - [ ] Render 404 / "Venter Not Found" state if invalid username is requested.
  - [ ] Handle client-side responsive layout (compatible with desktop 3-column shell).
- [ ] Create `app/profile/page.tsx`:
  - [ ] Client component redirecting authenticated users to `/profile/@${currentUser.username}`.
  - [ ] Redirects guests to `/login?redirect=/profile`.

---

### Phase 4: Privacy & Relational Integration
- [ ] **Anonymous Post Privacy Guard**:
  - [ ] If viewing own profile: show anonymous posts with a special discreet badge: `🔒 Anonymous (Visible only to you)`.
  - [ ] If viewing other user's profile: strictly filter out anonymous posts to preserve anonymity.
- [ ] **Interactive Confession Actions**:
  - [ ] Ensure "Relate", "Burn", and "Echo (Comment)" work on profile confession feeds using existing feed handlers.

---

### Phase 5: Verification & Polish
- [ ] Test with **Super Admin**: `/profile/@admin` (Check Admin Console link, Shield badge).
- [ ] Test with **Community Owner**: `/profile/@devbro` (Check Tech Life owner badge, 2 managed communities, prod crash confessions).
- [ ] Test with **Moderator**: `/profile/@sarah_j` (Check Corporate Cage moderator workspace).
- [ ] Test with **Regular Member**: `/profile/@chiya_lover` (Check relationship status "Complicated", education/bio).
- [ ] Run `npm run lint` and verify **0 Errors / 0 Warnings**.

---

## 🎨 Design System & Token Specifications

| Element | Color / Tailwind Class | Purpose |
| :--- | :--- | :--- |
| **Page Canvas** | `#050505` (`bg-[#050505]`) | Deep cyber void background |
| **Card Surface** | `#0d0d0f` (`bg-[#0d0d0f]`) | Elevated card panels |
| **Borders** | `#2a0808` / `border-zinc-800/80` | Subtle crimson accent borders |
| **Admin Badges** | `text-red-400 border-red-500/30 bg-red-950/40` | Authority highlights |
| **Moderator Badges** | `text-amber-400 border-amber-500/30 bg-amber-950/40` | Mod community tags |
| **Relate Accent** | `text-rose-500 bg-rose-950/20` | Resonance interaction |
| **Burn Accent** | `text-orange-500 bg-orange-950/20` | Vent fire energy |

---

## 🗂️ File Structure to be Created

```text
frustratedbox-web/
├── app/
│   ├── features/
│   │   └── profile/
│   │       ├── api.ts                     <-- Relational queries & stats
│   │       ├── types.ts                   <-- Profile & tab types
│   │       └── components/
│   │           ├── ProfileBanner.tsx       <-- Top cyber cover
│   │           ├── ProfileHeader.tsx       <-- Avatar, role badge & actions
│   │           ├── ProfileMeta.tsx         <-- Work, school, location chips
│   │           ├── ProfileStatsBar.tsx     <-- Vents, relates, burns counters
│   │           ├── ProfileTabs.tsx         <-- Navigation tabs
│   │           └── ProfileCommunityCard.tsx<-- Communities grid
│   └── profile/
│       ├── page.tsx                       <-- Auto-redirect to logged-in user
│       └── [username]/
│           └── page.tsx                   <-- Dynamic user profile page
└── PROFILE_PAGE_PLAN.md                   <-- This checklist
```

