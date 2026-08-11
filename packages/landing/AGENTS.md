# AGENTS.md — @suuudokuuu/landing

`@suuudokuuu/landing` is the fully static Next.js App Router site that owns the content and SEO surface of `https://www.suuudokuuu.com`. It is built with `output: 'export'`, so every route must be renderable at build time with no request context.

Read the root `AGENTS.md` first. Every engineering rule there applies here.

## Commands

```bash
yarn workspace @suuudokuuu/landing start   # next dev
yarn workspace @suuudokuuu/landing build   # next build -> static export in out/
yarn workspace @suuudokuuu/landing ts
yarn workspace @suuudokuuu/landing lint
```

The static export lands in `packages/landing/out`. Both `packages/landing/.next` and `packages/landing/out` are git-ignored.

## Structure

```text
src/
├── app/                     # App Router routes and native metadata routes
│   ├── global.css           # system font stack, no next/font network fetches
│   ├── layout.tsx           # root layout, metadataBase, viewport
│   ├── manifest.ts          # /manifest.webmanifest
│   ├── metadata.ts          # home page metadata sidecar
│   ├── page.tsx             # placeholder home page
│   ├── robots.ts            # /robots.txt
│   └── sitemap.ts           # /sitemap.xml, built from the metadata registry
└── seo/
    ├── components/          # JsonLd plus the compound FAQPage, HowTo, SoftwareApplication and BreadcrumbList schemas
    ├── constants/           # site identity and schema.org constants
    ├── interfaces/          # page metadata, page alternates, shared slot props
    ├── registries/          # metadata-only aggregators consumed by sitemap.ts
    ├── types/               # sitemap change frequency, slot component type
    └── utils/               # metadata factory, locale URLs, alternates, slot toolkit, node text extraction
```

## Hard Rules

### 1. One static route file per SEO page

Every SEO page lives at its own `src/app/<route>/page.tsx`. Never collapse content pages into a dynamic `src/app/[slug]/page.tsx`. Adding a page means adding a route folder; deleting a page means deleting that folder. `sitemap.ts` and future listing pages are the only legitimate enumeration endpoints.

### 2. Copy stays in the page file

Per-page visible copy — headings, prose, bullets, FAQ questions and answers, CTA text, legal text — is written inline as JSX in the route `page.tsx`. A reader must be able to grep a visible sentence and land on the route that renders it.

Do not move body copy into registries, keyed content objects, string arrays, slug dispatchers, or prop bags. Do not build fixed JSX lists by mapping over arrays of strings just to shorten a file.

### 3. Registries hold metadata only

`src/seo/registries/*.registry.ts` aggregates page-owned metadata sidecars for `sitemap.ts` and listing pages. Allowed fields are stable metadata and relationships only: `path`, `title`, `metaTitle`, `metaDescription`, `publishedAt`, `updatedAt`, `changeFrequency`, `priority`, image descriptors, and relationship slugs.

Never allowed in a registry: FAQ bodies, hero bullets, section prose, comparison rows, benefit cards, CTA copy.

A route page never re-discovers itself with `.find(...)` against a registry. It imports its sibling `./metadata` directly.

### 4. Metadata sidecars are required and carry dates

Every `page.tsx` has a sibling `metadata.ts` exporting a `PageMetadataInterface` object. `publishedAt` and `updatedAt` are required by the type, so TypeScript guarantees every page carries a freshness signal into `sitemap.ts` and into the Open Graph date tags. There are no fallback dates and no central last-modified map.

```ts
export const howToPlayPageMetadata: PageMetadataInterface = {
    path: '/how-to-play',
    title: 'How to play Sudoku',
    metaTitle: 'How to play Sudoku — Suuudokuuu',
    metaDescription: 'Learn the rules of Sudoku and the solving techniques that get you unstuck.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.8
};
```

The page exports `export const metadata = buildPageMetadata(howToPlayPageMetadata);` and the registry imports the same sidecar. Metadata is never hand-assembled in a route file.

### 5. Composition shells provide chrome only

A shell may own layout, header, footer, breadcrumbs, JSON-LD placement, and spacing. It accepts explicit metadata and JSX `children`. A shell must never branch on slug, look content up from a registry, choose a page variant from a map, or receive a prop bag holding page-specific copy.

### 6. Multi-entry content is compound JSX children

Repeated authored content — FAQ entries, how-to steps, feature lists, breadcrumb items — is expressed as sentinel children the parent walks by type, never as string-array or object-array props.

```tsx
<FaqPage>
    <Faq>
        <FaqQuestion>Is Suuudokuuu free?</FaqQuestion>
        <FaqAnswer>Yes. The game is free, ad-free and works offline.</FaqAnswer>
    </Faq>
</FaqPage>
```

Sentinels are created with `createSlot()` and render `null`; the parent picks them up with `findSlot` / `findSlots`. For JSON-LD the parent turns a child's nodes into a plain string with `extractNodeText`; for visible output it renders the child's nodes directly, so the schema and the visible copy share one source of truth.

Use compound children for authored content only. Runtime or registry-driven data stays a prop that the component maps over.

### 7. JSON-LD goes through `<JsonLd />`

Never hand-write `<script type="application/ld+json">`. `JsonLd` rewrites every opening angle bracket in the serialized payload to its escaped JSON form (backslash, `u003c`), so schema text can never terminate the script element.

### 8. Static-only rendering

No `headers()`, `cookies()`, `searchParams`-driven branching, route handlers, middleware, or server actions. `output: 'export'` fails on all of them. Everything the site renders must be knowable at build time.

Metadata routes (`sitemap.ts`, `robots.ts`, `manifest.ts`) compile to route handlers, so each one must export `export const dynamic = 'force-static';`. The build fails without it.

### 9. No network fonts

Do not add `next/font/google`. Offline CI builds must not depend on font downloads. Use the system font stack in `src/app/global.css`.

### 10. Brand constants live in one module

Site name, origin, locales, tagline, description and theme colors live in `src/seo/constants/site.constant.ts`. Do not re-declare the origin or the site name anywhere else. URLs are built with `buildLocaleUrl`, canonical and hreflang with `buildAlternates` / `buildLanguageAlternates`.

### 11. No Lingui yet

The landing package is English-only and is deliberately excluded from the root ESLint Lingui config block. Plain JSX text is correct here. The locale plumbing (`DEFAULT_LOCALE`, `SUPPORTED_LOCALES`, `buildLocaleUrl`, `x-default` hreflang) is already in place so adding locales is a constants change plus a route segment, not a rewrite. When Lingui is introduced, re-add `packages/landing/**/*.{ts,tsx}` to the Lingui block in the root `eslint.config.mjs`.

## Adding a page

1. Create `src/app/<route>/page.tsx` and its sibling `metadata.ts`.
2. Export `metadata` from the page with `buildPageMetadata(<page>Metadata)`.
3. Register the sidecar in `src/seo/registries/page-metadata.registry.ts`.
4. Write the body copy inline in the page.
5. Add JSON-LD with the compound schema components where it applies.
6. Run `yarn workspace @suuudokuuu/landing ts` and `yarn workspace @suuudokuuu/landing lint`, then the root validation sequence.

## Knip

Next.js route files and the SEO primitives are declared as entry points for this workspace in the root `knip.json`. Add new reserved App Router file names there if Next introduces them; do not silence real dead code by widening the globs.
