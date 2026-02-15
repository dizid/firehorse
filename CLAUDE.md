# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (includes Netlify Functions via @netlify/vite-plugin)
npm run build        # Type-check (vue-tsc) + Vite build
npm run test         # Run all Vitest tests once
npm run test:watch   # Run Vitest in watch mode
npx vitest run src/lib/__tests__/zodiac-data.test.ts  # Run a single test file
```

Do NOT use `netlify dev` — the `@netlify/vite-plugin` handles Netlify Functions inside Vite's dev server. Do NOT add Vite proxy config for `/api` routes.

## Architecture

**Vue 3 SPA** with Netlify Functions as the API layer. All pages are lazy-loaded via Vue Router.

### Frontend (`src/`)
- **Pages** (`src/pages/`) — 7 route pages, all lazy-loaded in `src/router/index.ts`
- **Components** — organized by domain: `ui/`, `layout/`, `home/`, `blog/`, `compatibility/`, `encyclopedia/`
- **State** — Pinia for stores, Vue composables in `src/composables/`
- **Types** — all shared interfaces in `src/types/index.ts`
- **Static content** — encyclopedia articles and zodiac data live in `src/lib/` as TypeScript modules (not DB)

### API (`netlify/functions/`)
1 serverless function, exports a `config` object with its route path:
- `blog-posts.ts` → `/api/blog/posts`

Uses `neon()` from `@neondatabase/serverless` directly.

### Database
Neon PostgreSQL (serverless driver). Key tables: `blog_posts`. The DB uses snake_case columns; API functions map to camelCase for the frontend.

### Design System
Tailwind CSS 4 with `@theme {}` block in `src/styles/main.css`. Custom color palettes:
- `fire-*` (orange gradient: 50-950)
- `ember-*` (gold accent: 400-600)
- `ash-*` (dark neutrals: 50-950)

CSS utility classes: `.glass`, `.glass-strong`, `.fire-glow`, `.fire-text`, `.btn-fire`, `.ember-border`
Fonts: `--font-display` (Cinzel serif), `--font-body` (Inter sans-serif)

## Key Conventions

- **Path alias:** `@/` maps to `src/`
- **TypeScript strict mode** with `noUnusedLocals` and `noUnusedParameters`
- **Test environment:** Vitest with happy-dom; tests live in `__tests__/` directories alongside source
- **API pattern:** Netlify Functions use the Web API `Request`/`Response` pattern (not Express). Route is set via `export const config = { path: "/api/..." }`
- **Tailwind CSS 4:** Uses `@theme {}` syntax, NOT `tailwind.config.js`. Typography plugin loaded via `@plugin "@tailwindcss/typography"`

## Environment Variables

```
DATABASE_URL                 # Neon PostgreSQL connection string
```
