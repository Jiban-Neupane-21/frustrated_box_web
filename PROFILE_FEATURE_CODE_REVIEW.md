# Profile Feature — Code Review Action Items

**Branch:** `feat/profile`  
**Review Date:** 2026-10-23  
**Reviewer:** Claude Code

---

## 🔴 Critical (Fix Before Merge)

### 1. Username Normalization Mismatch with Static Params
**File:** `app/features/profile/api.ts:25-33` + `app/profile/[username]/page.tsx:5-9`

**Problem:** `generateStaticParams()` generates both `@username` and `username` variants, but `normalizeUsername()` strips `@`. This creates duplicate static pages.

**Fix Options:**
- **Option A:** Change `generateStaticParams` to only generate `@username` (canonical format)
- **Option B:** Update `normalizeUsername` to preserve `@` for API calls

```typescript
// app/profile/[username]/page.tsx - Option A
export function generateStaticParams() {
  return INITIAL_MOCK_USERS.map((user) => ({
    username: `@${user.username}`,  // Only @ format
  }));
}
```

---

## 🟠 High Priority

### 2. Race Condition: Auth Loading Before Data Fetch
**File:** `app/features/profile/components/ProfileView.tsx:72, 89-133`

**Problem:** `useEffect` runs with `viewerId = undefined` if auth hasn't loaded yet. The effect depends on `viewerId` but doesn't gate on `isAuthLoading`.

**Fix:**
```typescript
const { user: currentUser, isLoading: isAuthLoading } = useAuth();

// Add early return
useEffect(() => {
  if (isAuthLoading) return;  // Wait for auth
  // ... rest of effect
}, [username, viewerId, isAuthLoading]);
```

### 3. Mock Adapter Bundled in Production
**File:** `app/features/profile/api.ts:39-132`

**Problem:** ~100 lines of mock code + `localStorage` access included in production bundle when `NEXT_PUBLIC_USE_MOCK=false`.

**Fix:** The dynamic import approach needs to handle async loading properly. Here are the working patterns:

**Option A: Async Factory Function (Recommended — cleanest API)**
```typescript
// api.ts
export async function createProfileApi(): Promise<ProfileApi> {
  if (USE_MOCK) {
    const { mockProfileApi } = await import('./mockApi');
    return mockProfileApi;
  }
  return httpProfileApi;
}

// Usage in components:
const api = await createProfileApi();
const user = await api.getUserByUsername('john');
```

**Option B: Lazy Proxy (Keeps synchronous API for components)**
```typescript
// api.ts
let mockApiPromise: Promise<ProfileApi> | null = null;

async function getMockApi(): Promise<ProfileApi> {
  if (!mockApiPromise) {
    mockApiPromise = import('./mockApi').then(m => m.mockProfileApi);
  }
  return mockApiPromise;
}

const profileApi: ProfileApi = USE_MOCK 
  ? new Proxy({} as ProfileApi, {
      get(_, prop) {
        return async (...args: any[]) => {
          const api = await getMockApi();
          return (api as any)[prop](...args);
        };
      }
    })
  : httpProfileApi;
```

**Option C: Build-time Tree-shaking (Best for production bundle size)**
```javascript
// next.config.js
module.exports = {
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/mockApi$/,
          contextRegExp: /app\/features\/profile$/,
        })
      );
    }
    return config;
  },
};
```
Then use a simple env-based switch in `api.ts`:
```typescript
// api.ts
import { mockProfileApi } from './mockApi';  // Only bundled in dev
import { httpProfileApi } from './httpApi';

const profileApi = process.env.NEXT_PUBLIC_USE_MOCK !== 'false' 
  ? mockProfileApi 
  : httpProfileApi;
```
And set `NEXT_PUBLIC_USE_MOCK` via `next.config.js` env:
```javascript
// next.config.js
module.exports = {
  env: {
    NEXT_PUBLIC_USE_MOCK: process.env.NODE_ENV === 'development' ? 'true' : 'false',
  },
};
```

**Key insight:** Top-level `await import()` doesn't work in regular modules — you need an async boundary (Option A) or a proxy wrapper (Option B) to defer the import until runtime. Option C is the only way to fully eliminate mock code from the production bundle.

---

## 🟡 Medium Priority

### 4. Inconsistent Avatar Strategy
**Files:** 
- `lib/mockData.ts:48` (testmaster: `dicebear 7.x/bottts`)
- `app/features/profile/components/ProfileHeader.tsx:72` (fallback: `dicebear 9.x/avataaars`)

**Fix:** Standardize on one version/style. Either:
- Store full `avatarUrl` in user profile (recommended)
- Or use consistent fallback: `https://api.dicebear.com/9.x/bottts/svg?seed=${username}`

### 5. Hardcoded Route Paths in Components
**Files:**
- `ProfileHeader.tsx:63-64` (`/settings/profile`, `/settings`)
- `ProfileMeta.tsx:158-159` (`/admin`, `/c/${slug}/mod`)

**Fix:** Centralize routes in a config:
```typescript
// lib/routes.ts
export const ROUTES = {
  editProfile: '/settings/profile',
  settings: '/settings',
  admin: '/admin',
  communityConsole: (slug: string) => `/c/${slug}/mod`,
} as const;
```

### 6. ProfileCommunityCard Links All Roles to Same Path
**File:** `app/features/profile/components/ProfileCommunityCard.tsx:48-50`

**Problem:** Member-role communities link to `/c/${slug}` (mod console path).

**Fix:** Role-based href:
```typescript
const getHref = (community: ManagedCommunity, base: string) => {
  if (community.role === 'member') return `${base}/${community.slug}`;
  return `${base}/${community.slug}/mod`;
};
```

### 7. ProfileBanner Uses `<img>` Instead of `next/image`
**File:** `app/features/profile/components/ProfileBanner.tsx:10-14`

**Fix:**
```tsx
import Image from 'next/image';

{coverUrl ? (
  <Image
    src={coverUrl}
    alt=""
    fill
    className="object-cover"
    sizes="100vw"
    priority
  />
) : ( ... )}
```

### 8. Missing Error Boundary
**File:** `app/features/profile/components/ProfileView.tsx`

**Fix:** Wrap component tree or add `error.tsx` in `app/profile/[username]/`:
```tsx
// app/profile/[username]/error.tsx
'use client';
export default function ProfileError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-center">
      <p className="text-sm text-zinc-400">Failed to load profile.</p>
      <button onClick={reset} className="mt-2 text-red-400 hover:text-red-300">
        Try Again
      </button>
    </div>
  );
}
```

---

## 🟢 Low Priority / Polish

### 9. Remove Unused Placeholder Function
**File:** `app/features/profile/components/ProfileView.tsx:36-40`

`useCurrentUser()` duplicates `useAuth()` — remove or clarify.

### 10. Make `visibleCount` Responsive
**File:** `app/features/profile/components/ProfileMeta.tsx:161`

```typescript
// Current: visibleCount = 2
// Better: Responsive based on screen width
const visibleCount = useMediaQuery('(min-width: 640px)') ? 4 : 2;
```

### 11. Consistent Icon Styling in Stats Bar
**File:** `app/features/profile/components/ProfileStatsBar.tsx:51-75`

Some icons have `fill-*`, `drop-shadow`, others don't. Create a wrapper:
```tsx
function StatIcon({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={`h-5 w-5 shrink-0 ${className}`}>{children}</span>;
}
```

### 12. Fix ConsoleLink Long-Press UX
**File:** `app/features/profile/components/ProfileMeta.tsx:124-129`

After long-press shows tooltip, a subsequent tap does nothing (navigation prevented).

**Fix:** Only prevent if tooltip is currently visible:
```tsx
onClick={(e) => {
  if (showTip) {  // Only block when tooltip showing
    e.preventDefault();
    setShowTip(false); // Dismiss tooltip instead
  }
}}
```

---

## ✅ Completed / Good Patterns (No Action Needed)

- [x] Clean architecture separation (types/api/components)
- [x] Strong TypeScript with discriminated unions
- [x] ARIA-compliant tabs with keyboard navigation
- [x] Owner-only tabs via `OWNER_ONLY_TABS` constant
- [x] Adapter pattern for mock ↔ real API switch
- [x] Responsive design with mobile-first breakpoints
- [x] Expandable metadata chips with height animation
- [x] Test user documented as "SUPER TEST USER"

---

## 📋 Quick Fix Checklist

| # | Task | File | Effort |
|---|------|------|--------|
| 1 | Fix username canonical format | `page.tsx` + `api.ts` | 5 min |
| 2 | Gate effect on `isAuthLoading` | `ProfileView.tsx` | 5 min |
| 3 | Tree-shake mock adapter | `api.ts` / `next.config.js` | 15 min |
| 4 | Standardize avatar URLs | `mockData.ts` + `ProfileHeader.tsx` | 10 min |
| 5 | Centralize route constants | New `lib/routes.ts` | 10 min |
| 6 | Role-based community href | `ProfileCommunityCard.tsx` | 5 min |
| 7 | Use `next/image` in banner | `ProfileBanner.tsx` | 5 min |
| 8 | Add error boundary / `error.tsx` | `app/profile/[username]/` | 10 min |

**Estimated Total:** ~65 minutes

---

## 🔗 Related Files

```
app/features/profile/
├── types.ts                    # Domain types
├── api.ts                      # Adapter pattern (mock + HTTP)
├── components/
│   ├── ProfileView.tsx         # Main container
│   ├── ProfileBanner.tsx       # Cover image
│   ├── ProfileHeader.tsx       # Avatar + actions
│   ├── ProfileMeta.tsx         # Bio, chips, console links
│   ├── ProfileStatsBar.tsx     # 4 metrics grid
│   ├── ProfileTabs.tsx         # ARIA tabs
│   └── ProfileCommunityCard.tsx # Community list item
app/profile/[username]/
├── page.tsx                    # Route + static params
└── error.tsx                   # (TODO: add)
lib/mockData.ts                 # Test users + confessions
app/features/feed/mockData.ts   # Test confessions
```

---

> **Note:** This review covers correctness, robustness, and maintainability. The feature architecture is solid — these fixes are polish/guardrails for production readiness.