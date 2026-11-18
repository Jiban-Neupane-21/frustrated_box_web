# Fix Plan: Cloudflare Pages 404 on Admin Routes

## Problem Summary
- **Environment**: Cloudflare Pages dev deployment (`dev.frustratedbox.com`)
- **Issue**: 404 "page can't be found" when accessing `/admin/*` routes (e.g., `/admin/moderation`)
- **Build**: Works locally, builds successfully with OpenNext
- **Error**: HTTP 404 on initial request (not client-side redirect)

## Root Cause Analysis

### 1. Next.js Version Incompatibility (PRIMARY SUSPECT)
- **Current**: Next.js 16.3.7
- **@opennextjs/cloudflare@1.20.17 requires**: `next@">=15.5.29 <16 || >=16.4.5"`
- **Gap**: 16.3.7 is between 16.0.0 and 16.4.5 → **NOT SUPPORTED**
- **Latest stable**: Next.js 16.4.6 (supported)

### 2. Cloudflare Pages Routing Configuration
- `_routes.json` added to `public/` → copied to `.open-next/assets/`
- Tells Cloudflare Pages to route all paths to worker except static assets
- **May need**: `_routes.json` in `.open-next/` root (not just assets)

### 3. OpenNext Worker Configuration
- Worker deployed as single function (`worker.js`)
- Middleware handler includes all admin routes in manifest
- But worker might not be invoked for preview deployments

### 4. Cloudflare Pages Dev Branch Deployment
- Preview deployments (branches ≠ main) may not include Functions by default
- Custom domain `dev.frustratedbox.com` pointing to develop branch preview
- May need explicit Functions enablement in Pages dashboard

### 5. Client-Side Redirect in AppShell
- `AppShell.tsx` has useEffect redirecting unauthenticated users to `/login` for `/admin` routes
- But this is client-side → should not cause initial 404

## Investigation Checklist

- [x] Upgrade Next.js to 16.4.6 (minimum 16.4.5) - **COMPLETED**
- [x] Verify `_routes.json` location (in `public/` → copied to `.open-next/assets/`) - **COMPLETED**
- [ ] Check Cloudflare Pages dashboard: Functions enabled for preview deployments
- [ ] Verify custom domain routing to correct branch
- [x] Test with `opennextjs-cloudflare preview` locally - **COMPLETED (all routes return 200)**
- [ ] Check worker logs for errors

## Proposed Fixes (Priority Order)

### Fix 1: Upgrade Next.js to 16.4.6 (HIGHEST PRIORITY)
```bash
npm install next@16.4.6 react@19 react-dom@19 --legacy-peer-deps
npm run build:cloudflare
```

### Fix 2: Ensure _routes.json in Correct Location
- Add to `public/_routes.json` (already done) 
- Also add to `.open-next/_routes.json` via build script
- Or configure via `open-next.config.ts`

### Fix 3: Verify Cloudflare Pages Settings
- Dashboard → Pages project → Settings → Functions → Enable for preview deployments
- Custom domain → DNS → Ensure pointing to Pages project
- Branch deployment → develop branch → Check "Include Functions"

### Fix 4: Local Testing with Wrangler
```bash
npx wrangler pages dev .open-next --compatibility-date=2024-11-18 --compatibility-flag=nodejs_compat
```
Test `http://localhost:8788/admin/moderation`

### Fix 5: Check OpenNext Configuration
```typescript
// open-next.config.ts
export default defineCloudflareConfig({
  // Ensure proper routing
  edge: {
    splitFunctionPerRoute: true,
  },
});
```

## Implementation Steps

1. **Update package.json** → Next.js 16.4.6 ✅ **DONE**
2. **Run build** → Verify no peer dependency errors ✅ **DONE**
3. **Test locally** → `opennextjs-cloudflare preview` ✅ **DONE** (all routes return 200)
4. **Deploy to develop branch** → GitHub Actions (push to develop)
5. **Verify on dev.frustratedbox.com** → Test admin routes
6. **If still failing** → Check Cloudflare dashboard settings

## Related Issues Found Online
- OpenNext + Next.js 16.3.x incompatibility: Multiple GitHub issues
- Cloudflare Pages preview deployments not running Functions: Known limitation
- _routes.json not picked up from assets/ subdirectory: Common issue

## Rollback Plan
If fixes don't work:
1. Revert Next.js to 15.5.2 (last supported 15.x)
2. Or use `@cloudflare/next-on-pages` (deprecated but supports Next.js 15)
3. Or deploy as static export (remove API routes)

## Success Criteria
- [x] `npm run build:cloudflare` completes without errors ✅
- [x] Local `opennextjs-cloudflare preview` serves admin routes ✅ (all return 200)
- [ ] Deployed `dev.frustratedbox.com/admin/moderation` returns 200 (or 302 to login, not 404)
- [ ] All admin routes accessible