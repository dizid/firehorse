# FireHorse

Celebrating the Year of the Fire Horse 2026. Encyclopedia, zodiac compatibility checker, community forum, and blog — built with Vue 3, TypeScript, and a fiery design system.

**Live:** [firehorse.info](http://firehorse.info/)

## Stack

- **Frontend:** Vue 3, TypeScript, Tailwind CSS 4, Vue Router, Pinia
- **Auth:** Clerk
- **Database:** Neon PostgreSQL (serverless)
- **API:** Netlify Functions
- **Hosting:** Netlify
- **Payments:** Stripe (paid forum posting)

## Features

- **Encyclopedia** — 8 researched articles covering Fire Horse history, traits, cultural significance, famous people, myths, and the 2026 generation
- **Compatibility Checker** — Interactive zodiac animal + element selector with compatibility scoring against Fire Horse
- **Community Forum** — Threaded discussions with categories, voting, pagination. Free to browse, paid membership to post
- **Blog** — Articles served from Neon DB with full markdown rendering
- **Fire Design System** — Canvas particle hero, glass morphism cards, ember floating particles, fire/ash color palette, page transitions

## Setup

```bash
npm install
npm run dev
```

### Environment Variables

Create `.env.local` with:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

## Project Structure

```
src/
  components/     UI, layout, home, forum, blog, compatibility, encyclopedia
  pages/          13 route pages (lazy-loaded)
  lib/            Zodiac data, encyclopedia content, DB client, markdown
  styles/         Fire design system (Tailwind CSS 4 @theme)
  router/         Vue Router config
  types/          TypeScript interfaces
netlify/
  functions/      6 serverless API endpoints
```

## API Endpoints

| Endpoint | Methods | Auth |
|----------|---------|------|
| `/api/forum/categories` | GET | No |
| `/api/forum/threads` | GET, POST | POST requires auth + paid |
| `/api/forum/posts` | GET, POST | POST requires auth + paid |
| `/api/forum/vote` | POST | Yes |
| `/api/blog/posts` | GET | No |
| `/api/user/profile` | GET, PUT | Yes |
