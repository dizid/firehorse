# FireHorse

Celebrating the Year of the Fire Horse 2026. Encyclopedia, zodiac compatibility checker, and blog — built with Vue 3, TypeScript, and a fiery design system.

**Live:** [firehorse.info](http://firehorse.info/)
**Sister site:** [wuxingzodiac.me](https://wuxingzodiac.me/) — multi-zodiac evergreen reference

## Stack

- **Frontend:** Vue 3, TypeScript, Tailwind CSS 4, Vue Router, Pinia
- **Database:** Neon PostgreSQL (serverless)
- **API:** Netlify Functions (Web `Request`/`Response`)
- **Hosting:** Netlify
- **Analytics:** GA4 (event tracking via `useAnalytics` composable)

## Features

- **Encyclopedia** — 8 researched articles covering Fire Horse history, traits, cultural significance, famous people, myths, and the 2026 generation
- **Compatibility Checker** — Interactive zodiac animal + element selector with compatibility scoring against Fire Horse
- **Blog** — Articles served from Neon DB with sanitized markdown rendering (DOMPurify)
- **Fire Design System** — Canvas particle hero with animated constellation horse, glass morphism cards, ember floating particles, fire/ash color palette, page transitions
- **SEO** — Per-page meta tags, canonical URLs, JSON-LD (Article schema for content pages), GA4 SPA tracking

## Setup

```bash
npm install
npm run dev
```

### Environment Variables

Create `.env.local` with:

```
DATABASE_URL=postgresql://...
```

That's it. Auth and payments are not currently wired (see Roadmap below).

## Project Structure

```
src/
  components/     ui, layout, home, blog, compatibility, encyclopedia
  pages/          7 route pages (lazy-loaded)
  lib/            Zodiac data, encyclopedia content, DB client, sanitized markdown
  composables/    useSeo, useAnalytics, useFireHorse (canvas animation)
  styles/         Fire design system (Tailwind CSS 4 @theme)
  router/         Vue Router config
  types/          TypeScript interfaces
netlify/
  functions/      Serverless API endpoints
```

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/encyclopedia` | Article index |
| `/encyclopedia/:slug` | Article detail |
| `/compatibility` | Zodiac compatibility checker |
| `/blog` | Blog index (DB-driven) |
| `/blog/:slug` | Blog post detail |
| `/preview` | **Dev-only** — fire animation preset tuner (gated behind `import.meta.env.DEV`) |
| `*` | 404 |

## API Endpoints

| Endpoint | Methods | Auth |
|---|---|---|
| `/api/blog/posts` | GET | No |

## Roadmap

See [PROJECT-PLAN.md](./PROJECT-PLAN.md) for the execution plan covering:

- Sitemap, robots.txt, Article JSON-LD (in progress)
- `vite-ssg` pre-rendering of encyclopedia + blog (planned)
- Per-article Open Graph images (planned)
- $7 premium compatibility-report PDF via Stripe Checkout + Resend (planned)
- Email-list capture on the compatibility results page (planned)

If auth is ever needed, the project will use **Firebase Auth** (the Dizid stack default). Clerk has been ruled out.

## Commands

```bash
npm run dev          # Vite dev server (Netlify Functions emulated via @netlify/vite-plugin)
npm run build        # vue-tsc + Vite build
npm run test         # Vitest run-once
npm run test:watch   # Vitest watch mode
```
