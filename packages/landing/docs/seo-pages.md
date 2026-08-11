# SEO Content Page Architecture

Read this before authoring or editing any route under `src/app`, any primitive under `src/seo`, any content module under `src/{techniques,rating,printable,puzzle,difficulty,solver,chrome}`, or `sitemap.ts` / `robots.ts` / `manifest.ts`.

`packages/landing/AGENTS.md` stays the rules-of-record summary. This document is the long form: why each rule exists, which primitive answers which concern, and the checklist for adding a page.

The site is a fully static Next.js App Router export (`output: 'export'`). Every route renders at build time with no request context, so every rule below is written for build-time-knowable content.

---

## 1. Page anatomy

A content page is always the same five parts. Nothing else is a page.

```text
src/app/<route>/
  metadata.ts   the sidecar: path, titles, dates, changeFrequency, priority
  page.tsx      the route: metadata export, JSON-LD, breadcrumbs, all body copy
```

1. **Route file** — `src/app/<route>/page.tsx`, one per URL, exporting `metadata` and a default component.
2. **Metadata sidecar** — `src/app/<route>/metadata.ts`, one exported `PageMetadataInterface` object.
3. **Registry entry** — the sidecar is imported into `src/seo/registries/page-metadata.registry.ts` so `sitemap.ts` sees it.
4. **Breadcrumbs** — `Breadcrumbs` with `BreadcrumbListItem` children, which emits the visible trail and the `BreadcrumbList` JSON-LD from the same children.
5. **Schema and cross-links** — the compound schema primitives the page needs, plus in-prose `<Link>`s to sibling pages, always resolved through the neighbour’s sidecar (`href={xWingPageMetadata.path}`), never through a hardcoded string.

`src/app/techniques/x-wing/page.tsx` is the reference technique page, `src/app/sudoku/hard/page.tsx` the reference difficulty lander, `src/app/printable/hard/page.tsx` the reference article-schema page, and `src/app/solver/page.tsx` the reference tool page.

---

## 2. Rules

### 2.1 One static route file per SEO page

Every page lives at its own `src/app/<route>/page.tsx`. Never collapse content pages into a dynamic `src/app/[slug]/page.tsx`, and never generate a family of pages from a slug-keyed content map. Adding a page means adding a folder; deleting a page means deleting that folder.

The reason is not aesthetic. A dynamic route makes the content invisible to `grep`, hides which URLs actually exist behind a `generateStaticParams` array, and pushes per-page copy into a registry — which then has to grow a shape wide enough for every page in the family, and every page pays for every other page’s fields.

`sitemap.ts`, the technique hub, the difficulty hub, and the printable hub are the only legitimate enumeration surfaces. They enumerate metadata, never body copy.

### 2.2 The metadata sidecar is mandatory and carries dates

Every `page.tsx` has a sibling `metadata.ts` exporting one `PageMetadataInterface`:

```ts
export const xWingPageMetadata: PageMetadataInterface = {
    path: '/techniques/x-wing',
    title: 'X-Wing',
    metaTitle: 'X-Wing Sudoku Technique — How to Spot and Use It',
    metaDescription:
        'An X-Wing traps a digit in the same two lines across two rows or columns, letting it be erased everywhere else those lines cross.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-11T00:00:00.000Z',
    changeFrequency: 'monthly',
    priority: 0.7
};
```

`publishedAt` and `updatedAt` are non-optional in `PageMetadataInterface` on purpose. TypeScript, not review discipline, guarantees that every page carries a freshness signal into `sitemap.ts`, into `ArticleSchema`, and into the `article:published_time` / `article:modified_time` Open Graph tags. There is no fallback date anywhere and no central last-modified map — a map like that goes stale silently, because nothing fails when an author forgets to touch it.

The page then reads the sidecar directly:

```tsx
export const metadata: Metadata = buildPageMetadata(xWingPageMetadata);
```

Rules that follow from this:

- A page never hand-assembles a `Metadata` object. `buildPageMetadata` owns canonical, hreflang, Open Graph, Twitter, and the date tags, so a new metadata field is added once instead of 49 times.
- A page never rediscovers itself with `PAGE_METADATA_REGISTRY.find(...)`. It imports `./metadata`.
- A page links to its neighbours through their sidecars, so a path rename is a one-line change that TypeScript propagates.

### 2.3 Registries hold metadata only

`src/seo/registries/page-metadata.registry.ts` imports every sidecar and exports `PAGE_METADATA_REGISTRY`. That is its whole job: enumeration for `sitemap.ts` and, later, listing pages.

Allowed in a registry: `path`, `title`, `metaTitle`, `metaDescription`, `publishedAt`, `updatedAt`, `changeFrequency`, `priority`, image descriptors, and relationship references between pages.

Never allowed in a registry: FAQ questions or answers, how-to steps, hero bullets, section prose, comparison rows, feature lists, CTA copy, or anything else a reader sees. If it renders, it belongs in the page.

### 2.4 Body copy lives in the page that renders it

Headings, prose, list items, FAQ entries, how-to steps, captions, and CTA text are written inline as JSX in the route file. A reader must be able to grep a visible sentence and land on the route that renders it.

Do not move copy into constants, keyed content objects, string arrays, or prop bags, and do not build a fixed list by mapping over an array of strings just to shorten a file. Long content pages are expected to be long; that is why the technique pages carry a narrow `max-lines-per-function` disable with a justification.

Iteration over data is fine and unrelated: `TierLadderTable` maps over solver-generated reports, `PuzzleBoard` maps over parsed grid rows, and hub pages map over nothing at all. The line is authored prose versus computed data.

Values that must not drift from generated output are the exception that proves the rule: guide prose reads its numbers from `getTierTechniqueReport(difficulty)` and difficulty landers read clue counts from `getDifficultyClueCount(difficulty)`, so a regenerated sample updates the sentence and the table together.

### 2.5 Compound children: one source for the schema and the visible copy

This is the core pattern of `src/seo`, and the reason the package has a slot toolkit at all.

Multi-entry authored content — FAQ entries, how-to steps, feature bullets, breadcrumb items — is expressed as **sentinel children the parent walks by type**, never as a string-array prop or an object-array prop:

```tsx
<FaqPage>
    <Faq>
        <FaqQuestion>Does an X-Wing place a digit directly?</FaqQuestion>
        <FaqAnswer>No. It only proves that a digit cannot appear in certain cells.</FaqAnswer>
    </Faq>
</FaqPage>
```

The mechanics live in four small utilities:

- `createSlot()` (`src/seo/utils/create-slot.util.ts`) returns a component that renders `null`. Sentinels are pure data carriers; they never produce DOM themselves.
- `SlotComponentType<Props>` (`src/seo/types/slot-component.type.ts`) types them, and `SlotChildrenPropsInterface` types the children-only ones.
- `findSlots(children, Slot)` and `findSlot(children, Slot)` (`src/seo/utils/find-slots.util.ts`, `find-slot.util.ts`) filter `Children.toArray(children)` by `child.type === Slot` and hand back typed elements.
- `extractNodeText(node)` (`src/seo/utils/extract-node-text.util.ts`) walks a node tree down to strings and numbers, collapses whitespace, and returns a plain string.

The parent then does both jobs from the same children:

- For JSON-LD it turns each child’s nodes into a string with `extractNodeText` and feeds `JsonLd`.
- For visible output it renders the child’s nodes **directly**, so the markup keeps its links and emphasis.

That is what makes the schema and the visible copy structurally incapable of drifting: there is one set of children, and both outputs are derived from it. A rendered FAQ that is also passed to a schema builder as an array is the anti-pattern this replaces — the two copies stay in sync only until someone edits one of them.

**Which primitives are compound today:**

| Primitive                   | Slot children                      | Emits JSON-LD                                     | Emits visible output         |
| --------------------------- | ---------------------------------- | ------------------------------------------------- | ---------------------------- |
| `FaqPage`                   | `Faq` → `FaqQuestion`, `FaqAnswer` | `FAQPage`                                         | yes, a `<details>` accordion |
| `HowTo`                     | `HowToStep name=`                  | `HowTo` (through `HowToSchema`)                   | yes, an ordered list         |
| `HowToSchema`               | `HowToStep name=`                  | `HowTo`                                           | no, schema only              |
| `SoftwareApplicationSchema` | `SoftwareApplicationFeature`       | `SoftwareApplication` with `featureList`          | yes, a feature `<ul>`        |
| `Breadcrumbs`               | `BreadcrumbListItem path=`         | `BreadcrumbList` (through `BreadcrumbListSchema`) | yes, a `<nav><ol>` trail     |
| `BreadcrumbListSchema`      | `BreadcrumbListItem path=`         | `BreadcrumbList`                                  | no, schema only              |

`ArticleSchema` is the deliberate exception: its `headline`, `description`, `datePublished`, and `dateModified` are single values, and their one source of truth is the metadata sidecar, so it takes plain props and pages pass sidecar fields rather than retyping strings.

Prefer the renderer over the bare schema. Reach for `HowToSchema` or `BreadcrumbListSchema` directly only when the page genuinely renders that content itself in a different shape; if you find yourself writing a visible `<ol>` next to a `HowToSchema` with the same steps, use `HowTo` instead.

**When not to use slots.** Compound children are for authored content. Data that is computed, generated, or enumerated at build time stays a prop the component maps over — `TierLadderTable` reading `getTierTechniqueReports()`, `PuzzleBoard` parsing a givens string, `TechniqueExampleBoard` rendering a `TechniqueExampleInterface`. Hand-listing generated rows as JSX children would be worse, not better.

**Adding a new compound primitive.** Create the sentinel with `createSlot()` in its own folder, create the parent in its own folder, walk children with `findSlots`, and render both outputs. Never bolt an array prop onto an existing primitive to avoid writing the sentinel.

### 2.6 Composition shells provide chrome only; children beat prop bags

A shell may own layout, header, footer, breadcrumb placement, JSON-LD placement, and spacing. It accepts explicit metadata and JSX `children`.

A shell must never branch on slug, look content up from a registry, pick a page variant from a map, or take a prop bag holding page-specific copy. If the content differs by route, the route composes it.

The same rule applies one level down, to every primitive:

- Primary content is `children`. `TechniqueSummary`, `TechniqueWorkedExample`, `PuzzleBoard`, `TierLadderTable`, and `TechniqueFrequencyTable` all take their caption or body as `children`, not as a `caption`/`title`/`content` node prop.
- Named `ReactNode` props and `render*` props are not used here. If a component needs two distinct content regions, it needs two sentinel slots or two components — not two node props.
- Boolean props do not accumulate. Two or more independent booleans on one component means the variants should be separate components. Prefer an explicit variant component over `isCompact` plus `hasFooter` plus `showTitle`.
- Prefer `Pick<PageMetadataInterface, 'path' | 'title'>` over the full interface when a component only needs those fields — `TechniqueNavigation` and `DifficultyNavigation` do this, which keeps them usable with any sidecar without depending on the whole shape.

### 2.7 Primitives own their own context; pages never thread configuration

A page never passes site identity down. Site name, origin, tagline, description, locales, and theme colors live once in `src/seo/constants/site.constant.ts`, and every primitive that needs them imports them itself.

- `ArticleSchema` and `SoftwareApplicationSchema` resolve their `url` through `buildLocaleUrl(DEFAULT_LOCALE, path)` and their publisher through `SITE_NAME` internally. Callers pass `path`, not an origin.
- `buildPageMetadata` resolves canonical and hreflang through `buildAlternates` internally. Callers pass a sidecar, not a canonical URL.
- `TechniquePageHeader` builds its own `Home > Sudoku techniques > <title>` trail from the two hub sidecars. Callers pass a title, not a breadcrumb array.
- `SiteHeader` and `SiteFooter` resolve every destination through the target page’s sidecar. Neither takes props.

Never pass `siteName`, `origin`, `locale`, or a prebuilt canonical URL into a primitive. If a primitive needs a shared constant, it imports it; that is the only way one change to the brand constants reaches every surface.

### 2.8 JSON-LD only through `JsonLd`

Never hand-write `<script type="application/ld+json">`. `JsonLd` (`src/seo/components/json-ld/json-ld.tsx`) serializes the payload and rewrites every opening angle bracket to its escaped JSON form, so no amount of schema text can terminate the script element.

If a page needs a `@type` no primitive covers, build the object at module scope in the page and render `<JsonLd data={schema} />` — the home page does this for its `WebSite` schema. If a second page needs the same `@type`, that is the signal to extract a primitive.

### 2.9 Static-export constraints

`output: 'export'` forbids `headers()`, `cookies()`, `searchParams`-driven branching, route handlers, middleware, and server actions. Everything rendered must be knowable at build time.

`sitemap.ts`, `robots.ts`, and `manifest.ts` compile to route handlers and each must export `export const dynamic = 'force-static';`. The build fails without it.

Interactive widgets are client islands mounted inside server primitives, gated on user intent rather than visibility — `TechniquePlayableBoard` ships a button and a flag, and pulls the engine through `next/dynamic(..., { ssr: false })` only when the reader asks for it. `"use client"` never appears on a page file or on a schema primitive.

### 2.10 Style conventions that apply to every file here

These are the root `AGENTS.md` rules, restated where they bite hardest on content pages:

- One component per folder, the file named after the folder.
- Props are declared inline as `interface Props` in the component file. Never `type Props`. A shared `*PropsInterface` is only for a shape several components genuinely share.
- Utilities carry the `.util.ts` suffix and live in the owning module’s `utils` folder. Constants live in `constants`, interfaces in `interfaces`, types in `types`.
- No explanatory code comments. Name things so the comment is unnecessary. The only comments in this package are lint disables with a stated reason.
- Typographic apostrophes (`’`) in prose. `react/no-unescaped-entities` rejects a raw `'` in JSX text.
- Keep page files under 300 lines and JSX nesting at six levels or shallower. A page past either limit is usually one that should have split a section into a primitive, or one that is carrying copy that belongs in a sibling page.
- Extract ternaries and boolean chains to named variables before the JSX, and use spread syntax for optional props: `...(isPositiveNumber(value) && { value })`.

---

## 3. Concern → primitive reference

Check this table before writing a new component. Most concerns already have one.

| Concern                                   | Primitive or utility                                                                | Shape                                                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Page metadata object                      | `buildPageMetadata(pageMetadata)` — `src/seo/utils/build-page-metadata.util.ts`     | takes a `PageMetadataInterface`; returns title, description, alternates, Open Graph, Twitter, and date tags    |
| Canonical plus hreflang                   | `buildAlternates(path)`, `buildLanguageAlternates(path)`                            | called inside `buildPageMetadata`; call directly only outside a page                                           |
| Absolute URL for a path                   | `buildLocaleUrl(locale, path)`                                                      | the only way to build a site URL; never concatenate `SITE_ORIGIN` by hand                                      |
| Any JSON-LD payload                       | `JsonLd data=`                                                                      | escapes angle brackets; every schema primitive renders through it                                              |
| FAQ, schema and visible together          | `FaqPage` + `Faq` → `FaqQuestion` / `FaqAnswer`                                     | emits `FAQPage` JSON-LD and a `<details>` accordion from one set of children                                   |
| How-to steps, schema and visible together | `HowTo name=` + `HowToStep name=`                                                   | emits `HowTo` JSON-LD and an ordered list from one set of children                                             |
| How-to steps, schema only                 | `HowToSchema name= description=` + `HowToStep name=`                                | use only when the page renders the steps itself in a different shape                                           |
| Breadcrumbs, schema and visible together  | `Breadcrumbs` + `BreadcrumbListItem path=`                                          | omit `path` on the last item; it renders as the current page                                                   |
| Breadcrumbs, schema only                  | `BreadcrumbListSchema` + `BreadcrumbListItem path=`                                 | used internally by `Breadcrumbs`                                                                               |
| Technique page header                     | `TechniquePageHeader title=`                                                        | the `Home > Sudoku techniques > <title>` trail plus the `<h1>`                                                 |
| Article dates and byline schema           | `ArticleSchema path= headline= description= datePublished= dateModified=`           | pass sidecar fields; never retype the headline or description                                                  |
| App or feature list                       | `SoftwareApplicationSchema path= name= description=` + `SoftwareApplicationFeature` | emits `SoftwareApplication` JSON-LD with `featureList` and a visible feature list                              |
| Worked technique example                  | `TechniqueWorkedExample board= technique=` + caption children                       | the only worked-example entry point; drives the static table and the live board from one board string          |
| Static example board                      | `TechniqueExampleBoard example=` + caption children                                 | rendered by `TechniqueWorkedExample`; takes the built example view model                                       |
| Playable board embed                      | `TechniquePlayableBoard board= technique=` + children                               | client island, intent-gated; wraps the static table                                                            |
| Live engine board                         | `TechniqueLiveBoard board= technique=`                                              | mounted by the island through `next/dynamic`; owns `FieldEngine`                                               |
| Live board labels                         | `FIELD_LABELS` — `src/techniques/constants/field-labels.constant.ts`                | `field-dom` ships no strings; every control label comes from here                                              |
| Step narration text                       | `renderTechniqueNarration`                                                          | turns the structured step payload into prose for all technique pages; never hand-write per-technique narration |
| Plain puzzle grid                         | `PuzzleBoard givens=` + caption children                                            | parses an 81-character string with `parsePuzzleGivens`; no candidates, no highlighting                         |
| TL;DR summary box                         | `TechniqueSummary` + children                                                       | the labelled aside above the long-form sections                                                                |
| Prev / next technique                     | `TechniqueNavigation previous= next=`                                               | takes sidecars; order follows `SolutionTechniqueEnum`                                                          |
| Prev / next difficulty                    | `DifficultyNavigation previous= next=`                                              | takes sidecars; order follows `DIFFICULTY_LADDER`                                                              |
| Link to a technique page                  | `TechniqueLink technique=`                                                          | resolves `TECHNIQUE_PAGE_PATHS` and `TECHNIQUE_NAMES` for a `SolutionTechniqueEnum`                            |
| Clue count for a tier                     | `getDifficultyClueCount(difficulty)`                                                | the number every difficulty and printable page quotes                                                          |
| Measured tier facts                       | `getTierTechniqueReport(difficulty)`, `getTierTechniqueReports()`                   | memoised per build; prose must read numbers from here, not repeat literals                                     |
| Generated difficulty tables               | `TierLadderTable`, `TechniqueFrequencyTable` + caption children                     | render `getTierTechniqueReports()`; caption is `children`                                                      |
| Printable download block                  | `PrintableDownloadCard title= fileName= pageCount= puzzleCount= hasSolutions=`      | resolves the file size itself from the built PDF                                                               |
| Printable page counts                     | `getPrintableBookletPageCount(...)`, `getPrintableFileSizeLabel(fileName)`          | keeps quoted page counts and file sizes derived, never typed                                                   |
| Solver workbench                          | `SolverWorkbench`                                                                   | the client island for the step-by-step solver page                                                             |
| Site chrome                               | `SiteHeader`, `SiteFooter`                                                          | rendered by the root layout; no props, links resolved through sidecars                                         |
| Brand constants                           | `src/seo/constants/site.constant.ts`                                                | `SITE_NAME`, `SITE_ORIGIN`, `SITE_PLAY_URL`, `SITE_TAGLINE`, `SITE_DESCRIPTION`, locales, theme colors         |
| Slot toolkit                              | `createSlot`, `findSlot`, `findSlots`, `extractNodeText`                            | the machinery behind every compound primitive                                                                  |

---

## 4. Indexing, sitemap, and submission rules

These rules apply to `sitemap.ts`, `robots.ts`, and any future submission tooling — they are the operating constraints for issue #301 (AI-search layer, IndexNow, and indexing operations). They come from a production incident on a sibling multi-domain site and are cheap to honour up front.

### 4.1 Submission URLs derive from the sitemap function, never from a content registry

Whatever submits URLs — an IndexNow call, an indexing script, a test, an admin tool — must obtain its URL list from the same function the `sitemap.ts` route uses to produce that sitemap. Never rebuild a list by walking `PAGE_METADATA_REGISTRY` (or any content registry) in the submitting code.

Rebuilding looks equivalent and is not. Two enumerations drift the moment one gains a filter, a locale, or a conditional entry the other lacks, and the submitted set silently stops matching the crawlable set. On a multi-host build it is worse: registry-derived lists submit URLs that do not belong to the host being submitted for, which corrupts ownership signals in the search consoles.

The canonical flow is: resolve the target host or configuration, pass it to the sitemap helper, submit or assert exactly the URLs it returns.

Keep a regression test asserting that the submitted list is the sitemap-derived list and contains no URL outside the target host.

### 4.2 Host- or locale-dependent metadata routes are `force-dynamic`, never time-`revalidate`

Any metadata route whose output depends on the request host or locale must opt out of cross-request reuse with `export const dynamic = 'force-dynamic'`. Never give such a route a time-based `revalidate`.

A time-based `revalidate` on a host-dependent `sitemap.ts` or `robots.ts` lets the platform serve one host’s cached output for another host. The observed symptom was every domain reporting an identical indexed page count after sitemap submission, which is exactly what a shared cache entry looks like. Identical counts alone are not proof — verify by comparing response bodies and hashes per host, not counts.

This landing package is single-host and fully static today, so both metadata routes correctly export `dynamic = 'force-static'`. The rule matters the moment a locale segment, a white-label host, or a preview domain is introduced: the choice is `force-static` for genuinely host-independent output or `force-dynamic` for host-dependent output. Time-based revalidation is never the right answer for a metadata route.

### 4.3 Verification key files must be served as exact plaintext

If a submission protocol requires a key file at a fixed path, that path must return the exact key as plaintext on every production host, with no redirect and no HTML fallback. Locale routing, trailing-slash rules, and rewrite rules are the usual culprits — a redirect to a locale-prefixed path serves HTML and fails verification. Cover it with a regression test.

### 4.4 Submission is an accelerator, not a substitute

Submit every sitemap under its matching search-console property regardless of what any push protocol reports. Push submission speeds up discovery; it does not replace a clean sitemap, correct canonicals, or accurate `lastModified` values — which, in this package, come straight from each sidecar’s `updatedAt`.

Treat a rejected submission as a configuration question, not a retry loop: recheck the key file, the host, the key location, and whether every submitted URL belongs to that host before sending anything again.

---

## 5. Adding a new content page

1. Create `src/app/<route>/metadata.ts` with a `PageMetadataInterface` object: `path`, `title`, a keyword-first `metaTitle`, a `metaDescription` that reads as a sentence, `publishedAt`, `updatedAt`, `changeFrequency`, `priority`.
2. Create `src/app/<route>/page.tsx` and export `const metadata: Metadata = buildPageMetadata(<page>Metadata);`.
3. Register the sidecar in `src/seo/registries/page-metadata.registry.ts`, placed in the reading order of the site, not alphabetically.
4. Open with `Breadcrumbs` and `BreadcrumbListItem` children, then the `<h1>`, then a definition-first opening paragraph that answers the query in the first sentence.
5. Write the body copy inline. Reach for the concern → primitive table before writing any new component.
6. Add the schema the page earns: `ArticleSchema` for long-form guides, `SoftwareApplicationSchema` for product surfaces, `HowTo` for procedures, `FaqPage` for questions. Feed each one children or sidecar fields — never a duplicated string.
7. Link outward through neighbouring sidecars, and add the inbound link from at least one hub page so the new URL is reachable.
8. Add prev / next navigation if the page belongs to a chain.
9. Run `yarn workspace @suuudokuuu/landing ts` and `yarn workspace @suuudokuuu/landing lint`, then the root validation sequence: `yarn format && yarn ts && yarn lint && yarn deadcode && yarn cpd`.
10. Confirm the new URL appears in the built `sitemap.xml`, and that the exported HTML contains the visible copy and the JSON-LD without JavaScript.
