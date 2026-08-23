# AGENTS.md — @suuudokuuu/landing

`@suuudokuuu/landing` is the fully static Next.js App Router site that owns the content and SEO surface of `https://www.suuudokuuu.com`. It is built with `output: 'export'`, so every route must be renderable at build time with no request context.

Read the root `AGENTS.md` first. Every engineering rule there applies here.

`docs/seo-pages.md` is the long-form content-page architecture guide: page anatomy, the compound-children pattern behind the schema primitives, the concern → primitive reference table, the indexing and submission rules, and the checklist for adding a page. This file stays the rules-of-record summary; read the guide before authoring a new page or a new SEO primitive.

`docs/indexing.md` is the indexing runbook: what the build publishes, why IndexNow submission is a CLI script rather than an API route, the `INDEXNOW_KEY` environment variable and key rotation, the Search Console and Bing setup, and what to monitor. Read it before changing `src/indexing`, `sitemap.ts`, `robots.ts`, or either indexing script.

## Commands

```bash
yarn workspace @suuudokuuu/landing start   # next dev
yarn workspace @suuudokuuu/landing build   # next build -> static export in out/
yarn workspace @suuudokuuu/landing ts
yarn workspace @suuudokuuu/landing lint
yarn workspace @suuudokuuu/landing generate:rating-sample      # re-forge the committed guide sample, changes every published number
yarn workspace @suuudokuuu/landing submit:indexnow --dry-run   # print the sitemap-derived URL list
yarn workspace @suuudokuuu/landing submit:indexnow             # needs INDEXNOW_KEY, run after deploy
```

The static export lands in `packages/landing/out`. Both `packages/landing/.next` and `packages/landing/out` are git-ignored.

## Structure

```text
src/
├── app/                     # App Router routes and native metadata routes
│   ├── global.css           # system font stack and every visible class, no next/font network fetches
│   ├── layout.tsx           # root layout, site chrome, metadataBase, viewport
│   ├── manifest.ts          # /manifest.webmanifest
│   ├── metadata.ts          # home page metadata sidecar
│   ├── page.tsx             # placeholder home page
│   ├── robots.ts            # /robots.txt
│   ├── sitemap.ts           # /sitemap.xml, built from buildIndexablePages()
│   ├── guides/              # long-form guide articles built on generated solve data
│   └── techniques/          # /techniques hub plus one folder per technique page
├── chrome/
│   ├── components/          # site header, site footer, and the comfort-control text-size stepper
│   ├── constants/           # comfort-scale steps, storage key, CSS custom property name
│   ├── interfaces/          # comfort-scale step view model
│   └── utils/               # buildComfortScaleInitScript, the pre-hydration scale script
├── difficulty/
│   ├── components/          # prev/next difficulty chain
│   ├── constants/           # difficulty display names, ladder order, difficulty page paths
│   └── utils/               # clue count per difficulty, derived from DIFFICULTY_BANDS
├── indexing/
│   ├── constants/           # IndexNow env-var name, endpoint and key pattern, llms.txt section names
│   ├── interfaces/          # the indexable page view model
│   └── utils/               # buildIndexablePages (the one URL enumeration), llms.txt builder, IndexNow key helpers
├── rating/
│   ├── components/          # tier-ladder and technique-frequency tables, SE range and tier band renderers
│   ├── constants/           # committed rated puzzle sample and the technique ladder order
│   ├── interfaces/          # rated sample entry, logical solve result and per-tier report view models
│   └── utils/               # solvePuzzleLogically and the memoised tier reports
├── seo/
│   ├── components/          # JsonLd, PageHeader, the compound FAQPage/HowTo/SoftwareApplication/BreadcrumbList schemas, and the visible Breadcrumbs, UpdatedDate and HowTo renderers
│   ├── constants/           # site identity and schema.org constants
│   ├── interfaces/          # page metadata, page alternates, shared slot props
│   ├── registries/          # metadata-only aggregators consumed by sitemap.ts
│   ├── types/               # sitemap change frequency, slot component type
│   └── utils/               # metadata factory, locale URLs, alternates, slot toolkit, node text extraction
└── techniques/
    ├── components/          # zero-JS example board, the playable-board island, TL;DR box, prev/next chain
    ├── constants/           # field-dom label contracts and technique display names
    ├── interfaces/          # example view model
    └── utils/               # buildTechniqueExample, cell labels, step narration
```

### CSS

There are no CSS modules. `noPropertyAccessFromIndexSignature` forces `styles['x']` access, which the `dot-notation` lint rule then rejects, so every visible class lives in `src/app/global.css` and is referenced as a plain string. Variant state is expressed with `data-*` attributes and CSS attribute selectors rather than composed class names.

### Comfort scale

`--landing-scale` (defined in `:root`, default `1`) is the one control point for reader-driven text and board sizing. `html { font-size: calc(100% * var(--landing-scale, 1)); }` scales every `rem`-based size site-wide, and `--landing-cell-size` folds the same variable into its `clamp()` so the board grows with it too. `ComfortControl` (`src/chrome/components/comfort-control/comfort-control.tsx`) is the client-island stepper in `SiteHeader` that writes the chosen step's scale to that custom property via `element.style.setProperty` and persists the step id to `localStorage` under `COMFORT_SCALE_STORAGE_KEY` (`src/chrome/constants/comfort-scale.constant.ts`). `buildComfortScaleInitScript` (`src/chrome/utils/build-comfort-scale-init-script.util.ts`) renders the same steps into a small inline `<script>` placed as the first child of `<body>` in the root layout, so a repeat visitor's saved scale applies before the rest of the page paints, with no flash and no server dependency. Without JavaScript the control renders as inert static buttons and every size falls back to the `1` default, so the exported HTML never changes.

## Hard Rules

### 1. One static route file per SEO page

Every SEO page lives at its own `src/app/<route>/page.tsx`. Never collapse content pages into a dynamic `src/app/[slug]/page.tsx`. Adding a page means adding a route folder; deleting a page means deleting that folder. `sitemap.ts` and future listing pages are the only legitimate enumeration endpoints.

### 2. Copy stays in the page file

Per-page visible copy — section headings, prose, bullets, FAQ questions and answers, CTA text, legal text — is written inline as JSX in the route `page.tsx`. A reader must be able to grep a visible sentence and land on the route that renders it.

The `<h1>` is the one exception: it is also the `Article` schema headline, so it lives in the sidecar as `headline` and is rendered by `PageHeader`. Never write an `<h1>` in a route file.

Do not move body copy into registries, keyed content objects, string arrays, slug dispatchers, or prop bags. Do not build fixed JSX lists by mapping over arrays of strings just to shorten a file.

### 3. Registries hold metadata only

`src/seo/registries/*.registry.ts` aggregates page-owned metadata sidecars for `sitemap.ts` and listing pages. Allowed fields are stable metadata and relationships only: `path`, `title`, `metaTitle`, `metaDescription`, `publishedAt`, `updatedAt`, `changeFrequency`, `priority`, image descriptors, and relationship slugs.

Never allowed in a registry: FAQ bodies, hero bullets, section prose, comparison rows, benefit cards, CTA copy.

A route page never re-discovers itself with `.find(...)` against a registry. It imports its sibling `./metadata` directly.

### 4. Metadata sidecars are required and carry dates

Every `page.tsx` has a sibling `metadata.ts` exporting a `PageMetadataInterface` object. `publishedAt` and `updatedAt` are required by the type, so TypeScript guarantees every page carries a freshness signal into `sitemap.ts`, into the `Article` schema, into the visible `<time>` line and into the Open Graph date tags. There are no fallback dates and no central last-modified map.

`title` is the short name used by breadcrumbs, prev/next chains and `llms.txt`. `headline` is the rendered `<h1>`, optional and falling back to `title`. `PageHeader` renders the `<h1>` and `ArticleSchema` reads the same resolved value, so a page never states its own name twice. See `docs/seo-pages.md` §2.2.

```ts
export const howToPlayPageMetadata: PageMetadataInterface = {
    path: '/how-to-play',
    title: 'How to play Sudoku',
    headline: 'How to Play Sudoku',
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
    <FaqHeading>Suuudokuuu FAQ</FaqHeading>
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

Metadata routes (`sitemap.ts`, `robots.ts`, `manifest.ts`) compile to route handlers, so each one must export `export const dynamic = 'force-static';`. The build fails without it. If one of them ever becomes host- or locale-dependent it must switch to `force-dynamic`; a time-based `revalidate` on a metadata route is never correct.

Root-level files that are not routes — `llms.txt` and the IndexNow key file — are written into `public/` by `scripts/generate-indexing-files.ts` before `next build`, because a static export cannot serve them from a route handler and the key must come from an environment variable rather than the repository. Both are git-ignored.

### 9. One URL enumeration

`buildIndexablePages()` in `src/indexing/utils/build-indexable-pages.util.ts` is the only enumeration of the site's URLs. `sitemap.ts`, `llms.txt` and `scripts/submit-indexnow.ts` all derive from it. Never rebuild a URL list by walking `PAGE_METADATA_REGISTRY` in submitting or listing code — two enumerations drift, and a submitted set that no longer matches the crawlable set corrupts search-console signals. See `docs/seo-pages.md` §4 and `docs/indexing.md`.

### 10. No network fonts

Do not add `next/font/google`. Offline CI builds must not depend on font downloads. Use the system font stack in `src/app/global.css`.

### 11. Brand constants live in one module

Site name, origin, locales, tagline, description and theme colors live in `src/seo/constants/site.constant.ts`. Do not re-declare the origin or the site name anywhere else. URLs are built with `buildLocaleUrl`, canonical and hreflang with `buildAlternates` / `buildLanguageAlternates`.

### 12. No Lingui yet

The landing package is English-only and is deliberately excluded from the root ESLint Lingui config block. Plain JSX text is correct here. The locale plumbing (`DEFAULT_LOCALE`, `SUPPORTED_LOCALES`, `buildLocaleUrl`, `x-default` hreflang) is already in place so adding locales is a constants change plus a route segment, not a rewrite. When Lingui is introduced, re-add `packages/landing/**/*.{ts,tsx}` to the Lingui block in the root `eslint.config.mjs`.

## Adding a page

1. Create `src/app/<route>/page.tsx` and its sibling `metadata.ts`.
2. Export `metadata` from the page with `buildPageMetadata(<page>Metadata)`.
3. Register the sidecar in `src/seo/registries/page-metadata.registry.ts`.
4. Write the body copy inline in the page.
5. Add JSON-LD with the compound schema components where it applies.
6. Run `yarn workspace @suuudokuuu/landing ts` and `yarn workspace @suuudokuuu/landing lint`, then the root validation sequence.

## Technique pages and the worked-example pipeline

Every page under `src/app/techniques/<slug>` renders a board that comes from the real solver rather than from hand-drawn markup.

```tsx
const EXAMPLE_BOARD = '..7..1..2..8..7..1912..3745...';

<TechniqueWorkedExample board={EXAMPLE_BOARD} technique={SolutionTechniqueEnum.HiddenQuad}>
    Caption prose describing what the solver found.
</TechniqueWorkedExample>;
```

`TechniqueWorkedExample` is the only worked-example entry point a page uses. It calls `buildTechniqueExample(board, technique)` during static generation and feeds both the prerendered table and the live board from that one board string, so the two can never drift.

`buildTechniqueExample` executes once during static generation. It parses the 81-character board with `Sudoku.fromString`, builds a `TechniqueManager` over `createTechniqueStrategies()` filtered down to the single requested technique, and calls `findNextStep()`. The returned `TechniqueResultInterface` supplies the highlighted pattern cells, the placement or the eliminations, and the candidate list of every blank cell. If the detector does not report the expected technique the util throws and the build fails, so copy and diagram can never drift.

Filtering the registry matters. `findNextStep` returns the first strategy in the given order that fires, so an unfiltered manager can only ever report the simplest technique available on a board. Several techniques, `HiddenQuad` above all, can never be the simplest step on any legal position, and a filtered registry is the only way to observe them.

To add a technique page:

1. Find a board where the technique fires. Boards from `packages/techniques/src/**/*.spec.ts` work, and so does any real solve position.
2. Create `src/app/techniques/<slug>/metadata.ts` with `...buildTechniquePageNames(SolutionTechniqueEnum.<Member>)` in place of `title` and `headline` and a keyword-first `metaTitle`, and register it in `page-metadata.registry.ts`.
3. Copy the structure of an existing technique page: `TechniquePageHeader metadata=`, a definition-first opening sentence, `TechniqueSummary`, prose sections, `TechniqueWorkedExample`, `HowTo` with `HowToStep` children, a mistakes list, `FaqPage` with `Faq`/`FaqQuestion`/`FaqAnswer` children, and `TechniqueNavigation`.
4. Point the `previous` and `next` props at the neighbouring sidecars in `SolutionTechniqueEnum` order.
5. Write 600 to 900 words of copy inline. Use typographic apostrophes; `react/no-unescaped-entities` rejects raw `'` in JSX text.
6. Keep the `max-lines-per-function` disable on the page component. Long-form copy in a route file is the reason it is there.

## The playable-board island

`TechniqueWorkedExample` (server) renders `TechniqueExampleBoard` inside `TechniquePlayableBoard` (client). The prerendered table is the baseline and the SEO artefact; the live board is an opt-in island.

- The static `<table class="sudoku-board">`, its candidate grid, and the `solver-output` list are always in the exported HTML, wrapped in a `<details open>` that stays in the DOM after the island mounts. View-source is the crawlability contract; never move the table behind a client-only render.
- The island mounts on user intent, not on visibility. `TechniquePlayableBoard` ships only a button and a `useState` flag; the engine arrives through `next/dynamic(..., { ssr: false })` when the reader presses “Try it on a live board”. On-visible gating would charge every scrolling reader the full `field-core` + `field-dom` + `techniques` + `generator` payload for a widget most readers never touch, so intent gating is the rule here. The island chunk must never appear in the page's script or preload list.
- `TechniqueLiveBoard` owns the engine: `new FieldEngine({ sudokuString: board, difficulty, showAutoCandidates: true })`, `getGivenCellKeys(board)`, and `findStepScript(engine.Sudoku, createTechniqueStrategies().filter(...))` narrowed to the page's technique — the same narrowing `buildTechniqueExample` uses, which is why the walkthrough reproduces the static solver output exactly.
- `field-dom` ships no strings. `FIELD_LABELS` in `src/techniques/constants/field-labels.constant.ts` supplies every control label, and `renderTechniqueNarration` turns the structured `{ technique, cells, values }` payload into prose generically for all 26 pages. Do not hand-write per-technique narration.
- Theming happens by overriding `--field-*` custom properties on `.technique-embed__live` in `global.css`. The packaged stylesheet is wrapped in `@layer field-dom`, so the unlayered landing rules win. Map every colour to the existing `--landing-*` token so the live board matches the static table.

## Guide pages and the generated solve data

The guides under `src/app/guides` publish measured numbers, never hand-written ones. `TierLadderTable` and `TechniqueFrequencyTable` call `getTierTechniqueReports()` during static generation; the reports are memoised per build so both guides share one computation.

`RATING_SAMPLE_PUZZLES` in `src/rating/constants/rating-sample.constant.ts` is a committed, fixed sample of `RATING_SAMPLE_SIZE` rated puzzles per difficulty, each entry a `{ puzzle, rating, isRatingCeiling }` record. Sourcing is random and the Hell corpus is large, so the sample is frozen in source to keep every build deterministic and every published number reproducible. The file is written by `scripts/generate-rating-sample.ts` (`yarn workspace @suuudokuuu/landing generate:rating-sample`): the five generated tiers come from `forgePuzzle(difficulty)` in `@suuudokuuu/puzzle-forge`, retried until the board is in band so the sample proves the tier contract; the Hell entries are the first `RATING_SAMPLE_SIZE` records of `@suuudokuuu/hell-corpus`, which carry a verified rating. Regenerating the sample changes every number on both guides, the six difficulty landers and the printable booklets, so treat it as data, not as code to tidy. Keep each entry on one line: the generator emits tier arrays at top level precisely so a full entry fits inside the 140-column print width and the file stays under the `max-lines` limit.

Clue counts come from `DIFFICULTY_BANDS` in `@suuudokuuu/puzzle-forge` via `getDifficultyClueCount`. Never read `defaultSudokuConfig.difficultyBlankCells` for a published number: that table is frozen legacy inference for pre-band shared links and no longer describes generated puzzles.

`solvePuzzleLogically` is a thin adapter over `TechniqueManager.solveLogically()` from `@suuudokuuu/techniques`, which threads one `CandidateContext` through the whole solve. The shared driver reports `solved`, `stuck` or `contradiction` and stops; the landing wraps it so it can enumerate every technique a board uses: it applies the placements the shared driver found, and when the outcome is not `solved` it fills one cell from the solution and runs the shared driver again from there. Anything that needed such a fill is reported as past the technique ladder. Guides must never present that outcome as proof a puzzle needs guessing — it means the required technique is not implemented yet.

Prose on these pages reads its numbers from `getTierTechniqueReport(difficulty)` rather than repeating literals, so copy cannot drift from the tables. `SeRatingRange` renders a report's measured SE spread and `TierBandRequirement` renders the band contract the forge enforces; use them instead of writing a rating or a band into copy by hand.

## Knip

Next.js route files and the SEO primitives are declared as entry points for this workspace in the root `knip.json`. Add new reserved App Router file names there if Next introduces them; do not silence real dead code by widening the globs.
