# Tech Debt

## Clerk Proxy Domain (clerk.firehorse.info)
**Added:** 2026-02-13
**Status:** Waiting for SSL propagation

The custom proxy URL `clerk.firehorse.info` was configured in Clerk but SSL provisioning hasn't fully propagated to all Cloudflare edge regions (fails in Thailand, works from other regions). Temporarily removed the proxy to unblock auth — Clerk now uses its default domain.

**To re-enable:**
1. Go to Clerk dashboard → Settings → Domains
2. Re-add proxy URL: `clerk.firehorse.info`
3. Copy the new publishable key (it changes when proxy is enabled)
4. Update `VITE_CLERK_PUBLISHABLE_KEY` in `.env.local` and Netlify env vars
5. Redeploy
6. Verify from Thailand that `clerk.firehorse.info` loads without ERR_CONNECTION_REFUSED

**DNS records already in place (Netlify DNS):**
- `clerk.firehorse.info` → CNAME → `frontend-api.clerk.services`
- `accounts.firehorse.info` → CNAME → `accounts.clerk.services`
- `clkmail.firehorse.info` → CNAME → `mail.wnxjgghv3z4u.clerk.services`
- `clk._domainkey.firehorse.info` → CNAME → `dkim1.wnxjgghv3z4u.clerk.services`
- `clk2._domainkey.firehorse.info` → CNAME → `dkim2.wnxjgghv3z4u.clerk.services`
