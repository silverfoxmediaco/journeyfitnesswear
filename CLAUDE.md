# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `journeyfitnesswear/` directory:

```bash
npm run dev          # Start local dev server (Shopify Hydrogen + Vite + codegen)
npm run build        # Production build with codegen
npm run preview      # Preview production build locally
npm run lint         # ESLint (flat config, eslint.config.js)
npm run typecheck    # React Router typegen + tsc --noEmit
npm run codegen      # Regenerate Shopify GraphQL types + React Router types
```

No test runner is configured. The project uses `eslint-plugin-jest` for linting test files but has no test suite.

## Architecture

**Shopify Hydrogen 2026.1.0** storefront built on **React Router 7** (NOT Remix) with **Vite**, deployed to **Shopify Oxygen**.

### Critical Import Rule

All routing imports must come from `react-router`, NEVER from `@remix-run/*` or `react-router-dom`. See `.cursor/rules/hydrogen-react-router.mdc` for the full Remix→React Router mapping table.

```ts
// CORRECT
import { useLoaderData, Link, Form } from 'react-router';
// WRONG — never use these
import { ... } from '@remix-run/react';
import { ... } from 'react-router-dom';
```

### Request Flow

1. `server.ts` — Cloudflare Workers fetch handler, creates Hydrogen context, delegates to React Router
2. `app/lib/context.ts` — Creates `HydrogenRouterContext` with storefront client, session, cart, customer account
3. `app/root.tsx` — Root layout with global styles, fonts, Analytics provider, Organization JSON-LD, skip-to-content link
4. `app/components/PageLayout.tsx` — Wraps all pages with Header, Footer, and Aside drawers (cart, search, mobile menu)
5. `app/routes/` — File-based routing (React Router conventions)

### Route Patterns

- **Loader pattern**: Each route exports `loader` with `loadCriticalData` (awaited, above-fold) and `loadDeferredData` (streamed, below-fold via `<Suspense>` + `<Await>`)
- **GraphQL**: Inline `#graphql` tagged template literals at the bottom of route files. Shared fragments live in `app/lib/fragments.ts`. Run `npm run codegen` after modifying queries to regenerate types in `storefrontapi.generated.d.ts`
- **SEO**: Routes use `getSeoMeta()` from `app/lib/seo.ts` for OG/Twitter meta. Product pages include JSON-LD via `getProductJsonLd()`
- **Dedicated routes** override the catch-all `pages.$handle.tsx`: `pages.about.tsx`, `pages.contact.tsx`, `pages.size-guide.tsx`

### Styling

- **Tailwind CSS v3** via `tailwind.config.cjs` + `postcss.config.cjs` (`.cjs` because `"type": "module"` in package.json)
- **Dark-first theme**: `<html class="dark">`, `<body class="bg-jfw-black text-jfw-white font-body">`
- **Brand tokens** defined in `tailwind.config.cjs`:
  - Colors: `jfw-blue` (#00CFFF), `jfw-black`, `jfw-dark`, `jfw-gray`, `jfw-blue-dark`, `jfw-blue-glow`
  - Fonts: `font-heading` (Orbitron), `font-body` (Poppins) — loaded via Google Fonts in root.tsx
  - Shadows: `shadow-jfw-glow`, `shadow-jfw-glow-lg`
- **Convention**: All components use unique `jfw-*` classNames (e.g., `jfw-header`, `jfw-product-card`) for specificity and debugging
- Animations use **framer-motion** (scroll reveals, staggered entrances)
- Icons use **lucide-react**

### Key Directories

- `app/components/home/` — Homepage sections (HeroBanner, FeaturedCollections, MotivationBanner, BrandStory, Newsletter)
- `app/components/product/` — ProductCard, ProductGrid, RecommendedProducts
- `app/components/ui/` — Reusable primitives (Button, Badge, LoadingSpinner)
- `app/lib/constants.ts` — Site name, tagline, brand colors, social links
- `app/lib/seo.ts` — SEO helpers (getSeoMeta, getProductJsonLd, getOrganizationJsonLd)
- `public/logos/` — Brand logo variants (BLUE for header, WHITE for footer, BLACKBLUE for light backgrounds)

### Printify Content Overrides

Product descriptions come from Printify with inline styles (e.g., `color:#525252`). Global CSS overrides in `app/styles/app.css` force these to white text and dark-theme table borders using `!important`.

### Environment

- `.env` contains Shopify credentials (not committed): `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`, `SESSION_SECRET`, etc.
- Node.js >= 18 required
- Deployed to Shopify Oxygen (Cloudflare Workers runtime)
- Google Ads gtag.js (AW-17978852504) loaded in `root.tsx` head

### Legacy URL Redirects

Old WordPress URLs are handled via dedicated route files that return 301 redirects (e.g., `app/routes/about-us.tsx` → `/pages/about`). Add new redirect routes as needed for SEO preservation.

## Edit Tracking

All changes must be recorded in `editsummary.txt` with: item number, component/file affected, what changed, and unique classNames added. Continue numbering from the last entry (currently #73).
