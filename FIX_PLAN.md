# Cloudflare Admin Route 404: Investigation and Fix

## Problem Summary

- **Environment**: `dev.frustratedbox.com`
- **Issue**: `/admin/moderation` returns HTTP 404 on initial request.
- **Verified responses**: `/` and `/admin` return HTTP 200; `/admin/moderation` returns HTTP 404.

## Root Cause

- The installed versions are compatible: Next.js 16.4.6, `@opennextjs/cloudflare` 1.20.17, and Wrangler 4.164.0.
- OpenNext outputs a Worker entrypoint at `.open-next/worker.js` and static files under `.open-next/assets/`.
- The GitHub Actions workflow was using `wrangler pages deploy .open-next`, which publishes a Pages static directory instead of deploying the OpenNext Worker. Pages therefore was not running the Next.js route handler for routes such as `/admin/moderation`.

## Code Fix Applied

- Changed CI to deploy with `opennextjs-cloudflare deploy`, the OpenNext-supported Cloudflare Workers deployment command.
- `main` and `develop` deploy to separate Worker names so one branch cannot overwrite the other.
- Removed the Pages-only `_routes.json` files and ignored generated `.open-next` output.

## Remaining Cloudflare Setup

- Confirm the GitHub Actions secrets exist: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and the API URL secrets.
- After the first Worker deployment, attach `dev.frustratedbox.com` to the `frustratedbox-web-develop` Worker in the Cloudflare dashboard. If that hostname is still attached to the Pages project, remove it from Pages before attaching it to Workers.
- Check the GitHub Actions deployment logs and Worker logs after deployment.

## Verification Status

- [x] Confirmed deployed `/admin/moderation` was returning 404.
- [x] Confirmed Next.js and OpenNext package versions are compatible.
- [x] Built with `npm run build:cloudflare` and confirmed `/admin/moderation` returns HTTP 200 in the local Worker preview.
- [ ] Deploy from `develop`, attach the custom domain, and verify `/admin/moderation` returns 200 or redirects to `/login`.
