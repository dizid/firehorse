# FireHorse — Project Overview & Strategic Recommendations

**Live:** [firehorse.info](http://firehorse.info)
**Repo:** /home/marc/DEV/firehorse/firehorse/
**Date:** 2026-04-30 (Year of the Fire Horse runs Feb 17 2026 → Feb 5 2027)

---

## Context

You asked for a project overview plus suggestions for improvement, user retention, and commercialization. You will cross-reference with other AIs, so this is written to be honest and verifiable rather than aspirational. I read the actual source, not just the README — and the two diverge sharply. That gap is the single most important thing in this document.

---

## 1. Project Overview (what actually exists)

### Concept
A Vue 3 single-page site celebrating the **Year of the Fire Horse 2026** (Chinese zodiac). Fire/ember design system, Cinzel display font, canvas particle hero, glass-morphism cards. Domain: `firehorse.info`.

### Stack (verified against [package.json](package.json))
- **Frontend:** Vue 3.5, TypeScript, Vue Router 4, Pinia 3, Tailwind CSS 4 (via `@theme {}`), `marked`, `fuse.js`
- **API:** Netlify Functions (Web `Request`/`Response` style), `@netlify/vite-plugin` for local dev
- **DB:** Neon Postgres via `@neondatabase/serverless`
- **Tests:** Vitest + happy-dom
- **Hosting:** Netlify
- **Analytics:** GA4 (`G-SRT8Y06JPS`) wired in [index.html](index.html#L26-L32) and [src/router/index.ts:53-59](src/router/index.ts#L53-L59)

### Live features (from [src/pages/](src/pages/) + [src/router/index.ts](src/router/index.ts))
| Route | Page | Status |
|---|---|---|
| `/` | HomePage | live |
| `/encyclopedia` | EncyclopediaPage (8 articles in [src/lib/encyclopedia-data.ts](src/lib/encyclopedia-data.ts)) | live |
| `/encyclopedia/:slug` | EncyclopediaArticlePage | live |
| `/compatibility` | CompatibilityPage (zodiac × element vs. Fire Horse) | live |
| `/blog` | BlogPage (DB-driven via `/api/blog/posts`) | live |
| `/blog/:slug` | BlogPostPage | live |
| `/preview` | PreviewPage | live |
| `*` | NotFoundPage | live |

### Reality vs. README — material gaps
[README.md](README.md) advertises features that **do not exist in the codebase**:

| README claim | Reality |
|---|---|
| "Community Forum — threaded discussions, voting, paid posting" | No forum routes, no forum components, no forum tables, no forum functions |
| "13 route pages" | 7 routes (8 with catch-all) |
| "7 serverless API endpoints" | 1 function: [`netlify/functions/blog-posts.ts`](netlify/functions/blog-posts.ts) |
| "Auth: Clerk" | No Clerk SDK in `package.json`, [`src/components/auth/`](src/components/auth/) is empty, [`src/stores/`](src/stores/) is empty |
| "Payments: Stripe (paid forum posting)" | No Stripe SDK in `package.json`, no checkout flow, no webhook handler |

**Why this matters:** any commercialization recommendation that assumes the forum/auth/Stripe stack works is fiction. The infra envs are configured (`.env.local` has live Clerk + Stripe keys) and tech-debt notes ([TECHDEBT.md](TECHDEBT.md)) reference Clerk DNS, so the intent was there — but the implementation was never finished or was rolled back.

### Security flags (verifiable, fix before doing anything else)
1. **`.env.local` contains LIVE secrets** — Clerk live keys, Stripe live keys, Netlify auth token, Neon password. Confirm `.gitignore` excludes it. If any of these ever leaked to git history, **rotate immediately.**
2. **Live Stripe keys in a project with no Stripe code path** — the keys are exposed in your local env for no functional reason. Either ship the paywall or rotate and remove.
3. The single API function ([blog-posts.ts](netlify/functions/blog-posts.ts)) needs a security read for SQL injection / auth assumptions before any forum work resumes.

### The elephant in the room: temporal scope
The site is themed and named for **one specific year**. The Year of the Fire Horse ends **2027-02-05**. After that, the brand asset (`firehorse.info`) becomes an evergreen Chinese-zodiac resource at best, or dead inventory at worst. **You have ~9 months of relevance left.** Every retention and commercialization decision should be evaluated against this clock.

---

## 2. Improvement Suggestions (engineering)

Ordered by leverage, not effort.

1. **Reconcile README with reality.** Either delete the forum/auth/Stripe claims from [README.md](README.md) or finish those features. Lying to your future self is the most expensive bug.
2. **Decide on auth/payments before May.** If you want any subscription revenue from this 2026 cycle, you need ~6 months of paying users. Two viable forks:
   - **Drop the forum entirely.** Rip out the Stripe + Clerk env vars, simplify the README. Pivot to ad/affiliate revenue (see §4).
   - **Ship the forum in 2 weeks.** Use the existing Clerk DNS work, add `@clerk/clerk-js` + Stripe Checkout, build forum tables in Neon, ship 4 missing functions. Don't half-build it.
3. **Add a sitemap and `robots.txt`.** [public/](public/) currently has neither (verify). For an SEO-driven content site this is table stakes. JSON-LD is already in [index.html:35-58](index.html#L35-L58) — extend with `Article` schema on encyclopedia + blog pages.
4. **SSR or pre-render the encyclopedia + blog.** This is a Vue 3 SPA — Google indexes JS-rendered SPAs, but slowly and with lower ranking signal. For a content site competing for "year of the fire horse 2026" SERPs, switch to **Nuxt 3** or use **vite-ssg** for static pre-rendering of encyclopedia + blog routes. This is the single biggest unlock for organic traffic.
5. **Add Open Graph images per article.** [index.html:16](index.html#L16) hardcodes one `og:image`. Per-article OG = much higher social CTR. Generate them at build time via `@vercel/og` or a Netlify Function.
6. **Extend test coverage beyond [src/lib/__tests__/](src/lib/__tests__/).** Compatibility scoring is a pure function and is the most user-visible logic. Untested logic on a paid site is liability.
7. **Stale-chunk handler at [router/index.ts:62-69](src/router/index.ts#L62-L69) does a full reload on dynamic-import failure** — fine for now, but you'll lose form state if you ever build the forum. Worth tracking.
8. **`PreviewPage` is exposed at `/preview` with no auth gate.** Either remove it from production or gate it. Confirm what it does.
9. **`marked` v17 — confirm sanitization.** If blog posts come from a CMS or DB and render via `v-html`, you need DOMPurify or `marked` with a sanitizer. XSS via blog content is a classic.

---

## 3. User Retention

Retention is hard for **any** zodiac/horoscope site because the value is one-shot ("read my Fire Horse traits → leave"). Honest framing: you're not building a daily-active product, you're building a **traffic flywheel** with email capture. Optimize for that.

### Tactics ranked by ROI

1. **Email list — the only retention asset that survives 2027.** Add a single capture: "Get the Fire Horse Year-in-Review newsletter — monthly cultural deep-dives + 2027 predictions sent free." Use ConvertKit / Buttondown / Resend. Send 1 email/month. List of 5K addresses is worth more in 2027 than the entire site.
2. **Compatibility checker → email gate (soft).** Let users see top-line score; gate the full breakdown ("Get your full 12-page Fire Horse compatibility report") behind email. This is your highest-intent moment.
3. **Birthday/zodiac reminders.** "We'll email you on the next auspicious Fire Horse day" — low effort, high goodwill, builds the list.
4. **Famous Fire Horses interactive timeline.** People come for traits, stay for "who else was born in a Fire Horse year." Embed shareable cards (Bruce Springsteen, Cindy Crawford, Ariana Grande, etc.) — drives social referral, which is the only viable retention loop here.
5. **PWA + push notifications.** Likely overkill for the lifecycle, **skip** unless forum ships.
6. **The forum is a retention trap on the wrong side of the equation.** A paid forum with no seed users dies on launch. If you ship it, seed it with 50+ AI-written threads first, then invite. If you can't commit to that, kill the forum.
7. **"Daily Fire Horse" widget** — a small rotating piece of trivia / quote / cultural fact on the homepage. Gives reason for repeat visits and improves time-on-site (SEO signal). Cheap to build.

### What I would NOT prioritize
- A mobile app. The site already works on mobile per your global preferences; an app would never recoup dev time before the year ends.
- Gamification (badges, streaks). Doesn't fit a 9-month single-zodiac site.
- Account systems beyond email if forum is dropped.

---

## 4. Commercialization

The painful truth: a **single-year, single-zodiac** site has a hard ceiling. Be realistic — you're not building the next Co–Star. You're harvesting attention from a specific search peak (Chinese New Year + "year of the X" queries). Plan accordingly.

### Revenue streams ranked by realistic 2026 yield

1. **Display ads (Mediavine / Raptive / Ezoic / AdSense).** Mediavine requires 50K monthly sessions; Ezoic accepts smaller. With 8 encyclopedia articles + a blog driving organic, this is the most realistic income. Estimated RPM: $15–30 for US/UK traffic. Needs SSR/pre-render (§2.4) to maximize.
2. **Affiliate: Chinese New Year / cultural products.** Amazon Associates + niche affiliates: red envelopes, jade horse pendants, lunar calendar planners, feng shui kits, books on Chinese astrology. One curated "Fire Horse 2026 gift guide" article ranks for high-intent buyer queries from October–February.
3. **Premium compatibility report (one-time purchase, $4.99–9.99).** Stripe Checkout, no subscription, no account needed — buyer enters email, gets PDF. **Doesn't need the forum stack.** Lowest implementation cost, highest unit margin. Sell across all 12 zodiac × 5 element combinations.
4. **Personalized BaZi / Chinese astrology reading ($19–49).** Either AI-generated (cheap, scales infinitely — wire `@anthropic-ai/sdk` with Claude Haiku 4.5 against the user's birth data) or partner with a human astrologer for revenue split. This is the highest-margin product if you ship it.
5. **Sponsored content / partnerships.** Once you have 20K+ monthly users, brands selling Chinese New Year products will pay for "Featured in our Fire Horse 2026 guide" placements. Email outbound to relevant DTC brands in October.
6. **Newsletter sponsorships.** Once the list crosses 5K, ConvertKit/Beehiiv has a sponsorship marketplace. $50–200 per send is realistic for a niche cultural list.
7. **Paid forum membership** (current README claim). **Lowest realistic ROI.** Discord/Reddit are free and have network effects. Charging for forum access on a 9-month site is a bad bet. Drop it.

### The 2027+ path — what to do with the asset post-Fire-Horse

The domain `firehorse.info` is a one-trick name. Three honest options:

- **A. Pivot to evergreen "Chinese Zodiac Hub"** — rebrand to `chinesezodiac.info` or similar; expand encyclopedia to all 12 animals × 5 elements (60 combos). Keep firehorse.info as a redirect/landing for 2026 traffic. **Best long-term ROI.**
- **B. Sell the domain in late 2027** — niche domains with 6 months of traffic + a built newsletter list sell on Flippa / MicroAcquire for 30–40× monthly profit. If you hit $500/mo by Q4 2026, that's $15–20K exit.
- **C. Let it run to natural decay** as a content archive that earns long-tail traffic from "fire horse 1966 / 2026" queries forever. Low maintenance, low return.

### What I'd actually do if it were my site (opinion)

Given the 9-month clock, drop the forum entirely, ship the **premium compatibility report ($7)** in 2 weeks (Stripe Checkout, no auth, email-gated PDF delivery), build the **email list aggressively** with the compatibility-results gate, and put **Ezoic ads** on encyclopedia + blog as soon as you hit 10K monthly users. In parallel, start writing for plan A (rebrand to multi-zodiac in February 2027). Skip everything else.

---

## 5. Critical files to modify (if you proceed with my recommendations)

| File | Why |
|---|---|
| [README.md](README.md) | Reconcile or delete forum/auth/Stripe claims |
| [package.json](package.json) | Add `vite-ssg` or migrate to Nuxt; add `dompurify`; possibly add Stripe + email SDK |
| [public/](public/) | Add `sitemap.xml`, `robots.txt` |
| [index.html](index.html) | Per-route OG; expand JSON-LD with `Article`/`Person` schema |
| [src/composables/useSeo.ts](src/composables/useSeo.ts) | Per-page meta + JSON-LD injection |
| [src/router/index.ts](src/router/index.ts) | Add `/checkout` and `/report` routes if shipping the PDF product |
| [netlify/functions/](netlify/functions/) | Add `stripe-checkout.ts`, `stripe-webhook.ts`, `report-generate.ts` if shipping paid report |
| `.env.local` | Rotate any committed live secrets; remove unused keys |

---

## 6. Verification (how to sanity-check this with another AI)

Tell the cross-checking AI to run the same verifications I did:

```bash
# Confirm route count
grep -c "path:" src/router/index.ts          # should print 9 (8 routes + 1 nested closing)

# Confirm function count
ls netlify/functions/                         # should list only blog-posts.ts

# Confirm no Clerk / Stripe SDKs
grep -E "clerk|stripe" package.json           # should return nothing

# Confirm empty auth/stores
ls src/components/auth/ src/stores/           # should be empty

# Confirm sitemap missing
ls public/                                     # check for sitemap.xml / robots.txt
```

If those checks contradict the recommendations above, the document is wrong — update it.

---

## 7. Out of scope (intentionally not covered)

- No Lighthouse audit run. Recommend running before SSR work.
- No GA4 traffic analysis. Recommendations assume "modest organic traffic, no paid acquisition." Adjust if reality differs.
- Not every component file read — only enough to verify the architectural claims.
- No Core Web Vitals benchmark.
