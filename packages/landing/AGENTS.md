# AGENTS.md — @suuudokuuu/landing

`@suuudokuuu/landing` is the fully static Next.js App Router site that owns the content and SEO surface of `https://www.suuudokuuu.com`. It is built with `output: 'export'`, so every route must be renderable at build time with no request context.

Read the root `AGENTS.md` first. Every engineering rule there applies here.

`docs/seo-pages.md` is the long-form content-page architecture guide: page anatomy, the compound-children pattern behind the schema primitives, the concern → primitive reference table, the indexing and submission rules, and the checklist for adding a page. This file stays the rules-of-record summary; read the guide before authoring a new page or a new SEO primitive.

`docs/indexing.md` is the indexing runbook: what the build publishes, why IndexNow submission is a CLI script rather than an API route, the `INDEXNOW_KEY` environment variable and key rotation, the Search Console and Bing setup, what to monitor, and the weekly SEO report and its `GCP_SA_KEY` / `CRUX_API_KEY` setup. Read it before changing `src/indexing`, `sitemap.ts`, `robots.ts`, or any of the indexing and reporting scripts.

## Commands

```bash
pnpm --filter @suuudokuuu/landing start   # next dev
pnpm --filter @suuudokuuu/landing build   # next build -> static export in out/
pnpm --filter @suuudokuuu/landing ts
pnpm --filter @suuudokuuu/landing lint
pnpm --filter @suuudokuuu/landing generate:rating-sample      # re-forge the committed guide sample, changes every published number
pnpm --filter @suuudokuuu/landing check:tier-reports           # ~65 s, fails when the committed reports drift from the sample
pnpm --filter @suuudokuuu/landing check:hreflang               # after build: every hreflang cluster in out/ is reciprocal and matches sitemap.xml
pnpm --filter @suuudokuuu/landing i18n:sync                    # extract and strictly compile the Lingui catalogs
pnpm --filter @suuudokuuu/landing submit:indexnow --dry-run   # print the sitemap-derived URL list
pnpm --filter @suuudokuuu/landing submit:indexnow             # needs INDEXNOW_KEY, run after deploy
pnpm --filter @suuudokuuu/landing seo:report                  # needs GCP_SA_KEY and CRUX_API_KEY, run weekly by CI
```

The static export lands in `packages/landing/out`. Both `packages/landing/.next` and `packages/landing/out` are git-ignored.

## Structure

```text
src/
├── analytics/
│   ├── components/          # the inline Microsoft Clarity script tag
│   ├── constants/           # analytics environment-variable names and Vercel environment values
│   └── utils/               # buildMicrosoftClarityScript, the cookieless consentv2 snippet
├── app/                     # App Router routes and native metadata routes
│   ├── global.css           # system font stack and every visible class, no next/font network fetches
│   ├── global-not-found.tsx # the 404 document, needed because the site has two root layouts
│   ├── manifest.ts          # /manifest.webmanifest
│   ├── robots.ts            # /robots.txt
│   ├── sitemap.ts           # /sitemap.xml, built from buildIndexablePages()
│   ├── (en)/                # English root layout and every English route, served from the site root
│   │   ├── layout.tsx       # <SiteDocument locale="en">, metadataBase, viewport
│   │   ├── metadata.ts      # home page metadata sidecar, including its translations
│   │   ├── page.tsx         # English home route
│   │   ├── guides/          # long-form guide articles built on generated solve data
│   │   └── techniques/      # /techniques hub plus one folder per technique page
│   └── [locale]/            # localized root layout and the localized routes, served from /<locale>
├── chrome/
│   ├── components/          # site document, header, footer, language switcher, and the comfort-control text-size stepper
│   ├── constants/           # comfort-scale steps, storage key, CSS custom property name
│   ├── interfaces/          # comfort-scale step view model
│   └── utils/               # buildComfortScaleInitScript, the pre-hydration scale script
├── daily/
│   ├── components/          # the shared daily puzzle body and the archive day and month lists
│   ├── constants/           # archive start, build date and the derived archive dates and months
│   └── utils/               # UTC date and month labels
├── difficulty/
│   ├── components/          # prev/next difficulty chain, the playable tier board and its live-board island
│   ├── constants/           # difficulty display names, ladder order, difficulty page paths, Infinity corpus facts
│   ├── types/               # RatedDifficultyType, the tiers the rated sample covers
│   └── utils/               # clue count per difficulty, derived from DIFFICULTY_BANDS, and the tier deep link into /play
├── hardest/
│   ├── components/          # famous-puzzle header, board with facts and app and print links, engine walkthrough
│   ├── constants/           # the named record grids, also read by the printables script
│   └── interfaces/          # famous puzzle view model
├── home/
│   └── components/          # the home page body, rendered by the English and the localized home routes
├── i18n/
│   ├── components/          # IslandLocaleProvider and LocaleProvider, the Lingui context for live-board islands
│   ├── locales/             # Lingui catalogs: messages.po plus the compiled messages.ts per locale
│   └── utils/               # activateLocale, the server-side Lingui activation
├── indexing/
│   ├── constants/           # IndexNow env-var name, endpoint and key pattern, llms.txt section names
│   ├── interfaces/          # the indexable page view model
│   └── utils/               # buildIndexablePages (the one URL enumeration), llms.txt builder, IndexNow key helpers
├── rating/
│   ├── components/          # tier-ladder and technique-frequency tables, SE range and tier band renderers
│   ├── constants/           # committed rated puzzle sample and the technique ladder order
│   ├── interfaces/          # rated sample entry, logical solve result and per-tier report view models
│   └── utils/               # solvePuzzleLogically and accessors for the committed tier reports
├── seo/
│   ├── components/          # JsonLd, PageHeader, the compound FAQPage/SoftwareApplication/BreadcrumbList schemas, and the visible Breadcrumbs, UpdatedDate and HowTo renderers
│   ├── constants/           # site identity and schema.org constants
│   ├── interfaces/          # page metadata and shared slot props
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

### Analytics

The site carries cookieless, anonymous analytics; the game carries none, and the published copy says exactly that. Do not widen either claim without changing the other.

`SiteDocument` (`src/chrome/components/site-document/site-document.tsx`), rendered by both root layouts, renders `<Analytics />` only when `VERCEL` is `1`, `<SpeedInsights />` only when `VERCEL_ENV` is `production`, and `<MicrosoftClarity />` only when `VERCEL_ENV` is `production` and `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set. Those variables exist only during a Vercel build, so a local, fork or CI export contains no analytics markup at all — grep `out/index.html` for `clarity` or `vercel` to prove it. Clarity is an inline `next/script` snippet from `buildMicrosoftClarityScript`, which denies both `ad_Storage` and `analytics_Storage` through `consentv2`, so it never sets a cookie. There is no consent banner because nothing is stored.

Funnel events go through `track()` from `@vercel/analytics`, called from client islands that already exist: `island_opened` and `walkthrough_started` from the technique board island, `solver_used` from the solver workbench, `board_opened` from the difficulty board island, `comfort_scale_set` from the comfort control. Never add a `'use client'` boundary just to fire an event, and never send anything a reader typed — the technique name, the difficulty tier, the solver outcome kind and the comfort step id are the whole payload vocabulary.

`TechniquePlayableBoard` takes the technique's name as a plain `techniqueName` string resolved by its server parent, because value-importing `SolutionTechniqueEnum` inside that island drags the whole `@suuudokuuu/techniques` package into every technique page's script list. Keep the enum a type-only import there; the dynamic `TechniqueLiveBoard` chunk already carries the package and may read `TECHNIQUE_NAMES` directly.

### Comfort scale

`--landing-scale` (defined in `:root`, default `1`) is the one control point for reader-driven text and board sizing. `html { font-size: calc(100% * var(--landing-scale, 1)); }` scales every `rem`-based size site-wide, and `--landing-cell-size` folds the same variable into its `clamp()` so the board grows with it too. `ComfortControl` (`src/chrome/components/comfort-control/comfort-control.tsx`) is the client-island stepper in `SiteHeader` that writes the chosen step's scale to that custom property via `element.style.setProperty` and persists the step id to `localStorage` under `COMFORT_SCALE_STORAGE_KEY` (`src/chrome/constants/comfort-scale.constant.ts`). `buildComfortScaleInitScript` (`src/chrome/utils/build-comfort-scale-init-script.util.ts`) renders the same steps into a small inline `<script>` placed as the first child of `<body>` in the root layout, so a repeat visitor's saved scale applies before the rest of the page paints, with no flash and no server dependency. Without JavaScript the control renders as inert static buttons and every size falls back to the `1` default, so the exported HTML never changes.

## Hard Rules

### 1. One static route file per SEO page

Every SEO page lives at its own `src/app/(en)/<route>/page.tsx`. Never collapse content pages into a dynamic `src/app/[slug]/page.tsx`. The `[locale]` segment only selects the language of a route that also exists in English, see Localization below. The daily sudoku archive is the other exception, because its URL set is a function of the build date: `daily-sudoku/[date]` and `daily-sudoku/archive/[month]` enumerate `DAILY_ARCHIVE_DATES` and `DAILY_ARCHIVE_MONTHS` through `generateStaticParams` with `dynamicParams = false`, render one shared body, and build their sidecars with a function in the sibling `metadata.ts`. See The daily sudoku below. Adding a page means adding a route folder; deleting a page means deleting that folder. `sitemap.ts` and future listing pages are the only legitimate enumeration endpoints.

### 2. Copy stays in the page file

Per-page visible copy — section headings, prose, bullets, FAQ questions and answers, CTA text, legal text — is written inline as JSX in the route `page.tsx`. A reader must be able to grep a visible sentence and land on the route that renders it. A localized page is the exception: its copy is written once with `<Trans>` in a page component under `src/<domain>/components/<page>`, which both the English and the `[locale]` route render, so the grep lands on that component.

The `<h1>` is the one exception: it lives in the sidecar as `headline` and is rendered by `PageHeader`. On articles it is also the `Article` schema headline. The home route renders a plain `<h1>` using `resolvePageHeadline(homePageMetadata)` so the hero has no updated-date line. Other routes use `PageHeader`.

Do not move body copy into registries, keyed content objects, string arrays, slug dispatchers, or prop bags. Do not build fixed JSX lists by mapping over arrays of strings just to shorten a file.

### 3. Registries hold metadata only

`src/seo/registries/*.registry.ts` aggregates page-owned metadata sidecars for `sitemap.ts` and listing pages. Allowed fields are stable metadata and relationships only: `path`, `title`, `metaTitle`, `metaDescription`, `publishedAt`, `updatedAt`, `changeFrequency`, `priority`, image descriptors, and relationship slugs.

Never allowed in a registry: FAQ bodies, hero bullets, section prose, comparison rows, benefit cards, CTA copy.

A route page never re-discovers itself with `.find(...)` against a registry. It imports its sibling `./metadata` directly.

### 4. Metadata sidecars are required and carry dates

Every `page.tsx` has a sibling `metadata.ts` exporting a `PageMetadataInterface` object. `publishedAt` and `updatedAt` are required by the type, so TypeScript guarantees every page carries a freshness signal into `sitemap.ts`, into the `Article` schema, into the visible `<time>` line and into the Open Graph date tags. There are no fallback dates and no central last-modified map.

`title` is the short name used by breadcrumbs, prev/next chains and `llms.txt`. `headline` is the rendered `<h1>`, optional and falling back to `title`. `PageHeader` renders the `<h1>` and article routes render `ArticleSchema` explicitly with the same resolved value. Home and collection hubs omit `ArticleSchema`, so a page never states its own name twice. See `docs/seo-pages.md` §2.2.

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

### 12. A localized page is published only when it is fully translated

There is no English fallback under a locale URL. See Localization below.

## Localization

English is served from the site root. Every other locale is served under `/<locale>`, where the segment is the lowercase BCP 47 tag and the hreflang value is the tag itself: `es` is `/es`, `pt-BR` is `/pt-br`. The codes follow the app's thirteen languages: `uk`, `ar`, `bn`, `zh`, `en`, `fr`, `de`, `hi`, `id`, `pt-BR` (the app's `pt` catalog), `es`, `sv` and `ur`.

- `SUPPORTED_LOCALES` in `site.constant.ts` lists only the locales that have a landing catalog. Adding a locale means appending its code there and to `LOCALE_NAMES`, running `i18n:sync`, and translating its `messages.po`.
- A page is published in a locale when its sidecar has a `translations.<locale>` entry carrying the translated `title`, `headline`, `metaTitle` and `metaDescription`. `getPageLocales` turns that into the page's locale list, which drives `generateStaticParams` in the `[locale]` route, the hreflang alternates, the sitemap, `llms.txt`, IndexNow and the header's `LanguageSwitcher`. Sidecars stay plain strings, because scripts and Playwright specs import them without the Lingui macro transform.
- Body copy goes through Lingui macros. `lingui compile --strict` (run by `i18n:sync`, so by `pnpm i18n:check` in CI) fails on any untranslated message, and `lingui/no-unlocalized-strings` lints the localized modules listed in the root `.oxlintrc.json`; add a page's component folder there when localizing it. One catalog per locale means every catalog locale translates every macro message; split the catalog per page once two localized pages need different locale sets.
- `SiteDocument` renders `<html lang dir>`, with `dir="rtl"` for `RIGHT_TO_LEFT_LOCALES` (`ar`, `ur`), and activates the locale for server components through `activateLocale`. A localized page component calls `activateLocale` too, because Next renders layouts and pages independently. `extractNodeText` resolves `<Trans>` children through the active locale, so FAQ and feature JSON-LD stay in the page's language.
- Strings are resolved on the server wherever a client component can take them as props (header controls, the board's play button). Only the live boards translate on the client: their strings live in the files listed as `CLIENT_MESSAGE_SOURCES` in `lingui.config.ts`, which compile into a separate `client/messages` catalog, and `IslandLocaleProvider` wraps each live-board island with just that catalog. Pages without a live board ship no Lingui runtime and no messages.
- `pnpm --filter @suuudokuuu/landing check:hreflang` reads `out/` after a build and fails unless every page lists itself and an `x-default` that points to its English URL, every alternate exists in the export and declares the same cluster, and `sitemap.xml` carries exactly the same clusters. The web E2E workflow and the production deploy run it after the landing build.
- Not localized yet: Open Graph images (a localized page reuses the English image), the technique and solver step narration, and the store badge artwork.

## Adding a page

1. Create `src/app/(en)/<route>/page.tsx` and its sibling `metadata.ts`.
2. Export `metadata` from the page with `buildPageMetadata(<page>Metadata)`.
3. Register the sidecar in `src/seo/registries/page-metadata.registry.ts`.
4. Write the body copy inline in the page.
5. Add JSON-LD with the compound schema components where it applies.
6. Run `pnpm --filter @suuudokuuu/landing ts` and `pnpm --filter @suuudokuuu/landing lint`, then the root validation sequence.

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
4. Pass the page’s `SolutionTechniqueEnum` member as the `technique` prop to `TechniqueNavigation`. Its previous and next links derive from `TECHNIQUE_PAGE_LADDER`; never hand-wire neighbouring sidecars. The optional `previous` and `next` props remain temporarily for the seven route files protected by open PR #531 and must be removed when those callers migrate.
5. Write 600 to 900 words of copy inline. Use typographic apostrophes; `react/no-unescaped-entities` rejects raw `'` in JSX text.
6. Keep the `max-lines-per-function` disable on the page component. Long-form copy in a route file is the reason it is there.

## The playable-board island

`TechniqueWorkedExample` (server) renders `TechniqueExampleBoard` inside `TechniquePlayableBoard` (client). The prerendered table is the baseline and the SEO artefact; the live board is an opt-in island.

- The static `<table class="sudoku-board">`, its candidate grid, and the `solver-output` list are always in the exported HTML, inside the static panel of an ARIA tablist. The panel stays in the DOM after the island mounts, and switching tabs only changes its visibility. View-source is the crawlability contract; never move the table behind a client-only render.
- The island mounts on user intent, not on visibility. `TechniquePlayableBoard` ships the tablist and its view/loading state; the engine arrives through `next/dynamic(..., { ssr: false })` when the reader presses “Try it on a live board”. On-visible gating would charge every scrolling reader the full `field-core` + `field-dom` + `techniques` + `generator` payload for a widget most readers never touch, so intent gating is the rule here. The island chunk must never appear in the page's script or preload list.
- `TechniqueLiveBoard` owns the engine: `new FieldEngine({ sudokuString: board, difficulty, showAutoCandidates: true })`, `getGivenCellKeys(board)`, and `findStepScript(engine.Sudoku, createTechniqueStrategies().filter(...))` narrowed to the page's technique — the same narrowing `buildTechniqueExample` uses, which is why the walkthrough reproduces the static solver output exactly.
- `field-dom` ships no strings. `FIELD_LABELS` in `src/techniques/constants/field-labels.constant.ts` supplies every control label, and `renderTechniqueNarration` turns the structured `{ technique, cells, values }` payload into prose generically for all 31 pages. Do not hand-write per-technique narration.
- Theming happens by overriding `--field-*` custom properties on `.technique-embed__live` in `global.css`. The packaged stylesheet is wrapped in `@layer field-dom`, so the unlayered landing rules win. Map every colour to the existing `--landing-*` token so the live board matches the static table.

## The difficulty board island

Every `/sudoku/<tier>` lander and the home page render `DifficultyBoard difficulty=` directly under their heading, with the caption copy as children. It is the same intent-gated pattern as the technique island, sized for a first screen on mobile.

- `DifficultyBoard` (server) calls `forgeSerializablePuzzle(difficulty, seed)` from `@suuudokuuu/puzzle-forge` during static generation, the exact call the app makes, so a tier's board comes from that tier's band or, for Hell and Infinity, from the same corpus. The fixed seed keeps every export identical. The static `PuzzleBoard` table is in the exported HTML, so the board costs no layout shift and no script.
- `DifficultyPlayableBoard` (client) ships only the play button. Pressing it loads `DifficultyLiveBoard` through `next/dynamic(..., { ssr: false })`, which builds a `FieldEngine` from the same puzzle and solution; the static table stays in the DOM and is hidden by CSS once `.field-game` mounts. `New <tier> puzzle` dynamic-imports `@suuudokuuu/puzzle-forge` on click, so neither the engine nor the forge and its corpora ever enter a page's script list.
- Every play link for a tier goes through `buildDifficultyPlayUrl(difficulty)`, which appends `?difficulty=<DifficultyEnum value>` to `SITE_PLAY_URL`. The app's `/play` route validates that parameter with `DifficultySchema` and stores it as the selected difficulty without starting or replacing a run.

## The daily sudoku

`/daily-sudoku` shows the build day's puzzle and `/daily-sudoku/<YYYY-MM-DD>` keeps every day from `DAILY_ARCHIVE_START_DATE` (`src/daily/constants/daily-archive.constant.ts`) up to the build date, paginated by `/daily-sudoku/archive/<YYYY-MM>`. Every board comes from `forgeSerializablePuzzle(getDailyDifficulty(date), getDailyPuzzleSeed(date))`, the exact call the app's daily challenge makes, so the page and the app show the same grid for a UTC date. The archive is derived, never stored: a past day renders the same board on every build.

The build date is `LANDING_BUILD_DATE` when it is a `YYYY-MM-DD` string, else today in UTC. The production workflow sets it and turbo hashes it, so a cached landing build is never replayed on a later day, and a daily `schedule` trigger on `main.yml` rebuilds and deploys without a release. Each day page runs one `SolvePathBuilder` solve at build time; the month and recent-day lists read only the date and the tier.

## Guide pages and the generated solve data

The guides under `src/app/guides` publish measured numbers, never hand-written ones. `TierLadderTable` and `TechniqueFrequencyTable` call `getTierTechniqueReports()` during static generation; the reports are committed in `tier-technique-reports.constant.ts` and both guides read that same data.

`RATING_SAMPLE_PUZZLES` in `src/rating/constants/rating-sample.constant.ts` is a committed, fixed sample of `RATING_SAMPLE_SIZE` rated puzzles per difficulty, each entry a `{ puzzle, rating, isRatingCeiling }` record. Sourcing is random and the Hell corpus is large, so the sample is frozen in source to keep every build deterministic and every published number reproducible. The file is written by `scripts/generate-rating-sample.ts` (`pnpm --filter @suuudokuuu/landing generate:rating-sample`): the five generated tiers come from `forgePuzzle(difficulty)` in `@suuudokuuu/puzzle-forge`, retried until the board is in band so the sample proves the tier contract; the Hell entries are spread evenly across `@suuudokuuu/hell-corpus`, which carry a verified rating. The same script writes the derived reports, and `check:tier-reports` checks them against the fixed sample. Regenerating the sample changes every number on both guides, the six rated difficulty landers and their printable booklets, so treat it as data, not as code to tidy.

The sample, the tier reports and both guide tables cover the six tiers in `RATED_DIFFICULTY_LADDER`, typed `RatedDifficultyType`; `DIFFICULTY_LADDER`, `DIFFICULTY_NAMES` and `DIFFICULTY_PAGE_PATHS` cover every `DifficultyEnum` member. Infinity is deliberately outside the rated sample: its puzzles carry the SE ratings independent raters publish, above `SE_RATING_CEILING`, and our technique ladder cannot finish any of them, so they would put unmeasured numbers into tables that promise measured ones. The Infinity lander and booklet read their facts from `src/difficulty/constants/infinity-corpus.constant.ts`, which derives the rating and clue ranges from `@suuudokuuu/hell-corpus`, and the booklet prints the first `PRINTABLE_BOOKLET_SIZE` records of that corpus unchanged. Keep each entry on one line: the generator emits tier arrays at top level precisely so a full entry fits inside the 140-column print width and the file stays under the `max-lines` limit.

Clue counts come from `DIFFICULTY_BANDS` in `@suuudokuuu/puzzle-forge` via `getDifficultyClueCount`. Never read `defaultSudokuConfig.difficultyBlankCells` for a published number: that table is frozen legacy inference for pre-band shared links and no longer describes generated puzzles.

`solvePuzzleLogically` is a thin adapter over `TechniqueManager.solveLogically()` from `@suuudokuuu/techniques`, which threads one `CandidateContext` through the whole solve. The shared driver reports `solved`, `stuck` or `contradiction` and stops; the landing wraps it so it can enumerate every technique a board uses: it applies the placements the shared driver found, and when the outcome is not `solved` it fills one cell from the solution and runs the shared driver again from there. Anything that needed such a fill is reported as past the technique ladder. Guides must never present that outcome as proof a puzzle needs guessing — it means the required technique is not implemented yet.

Prose on these pages reads its numbers from `getTierTechniqueReport(difficulty)` rather than repeating literals, so copy cannot drift from the tables. `formatSeRatingRange(report)` returns a report’s measured SE spread as plain text; call it directly in JSX so FAQ JSON-LD can extract its numbers. `TierBandRequirement` renders the band contract the forge enforces; use them instead of writing a rating or a band into copy by hand. `HowTo` renders the visible step list only; it never emits HowTo JSON-LD.

## Knip

Next.js route files and the SEO primitives are declared as entry points for this workspace in the root `knip.json`. Add new reserved App Router file names there if Next introduces them; do not silence real dead code by widening the globs.
