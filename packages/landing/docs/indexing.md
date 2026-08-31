# Indexing Operations

Read this before touching `src/indexing`, `src/app/sitemap.ts`, `src/app/robots.ts`, `scripts/generate-indexing-files.ts`, `scripts/submit-indexnow.ts`, or any deploy step that publishes `packages/landing/out`.

`docs/seo-pages.md` stays the architecture document; §4 there states the rules this file operates. This file is the runbook: what runs when, what to set up in the search consoles, what to check, and what to do when a submission is rejected.

---

## 1. What the package publishes

| Artefact               | Produced by                                               | Lands at                   |
| ---------------------- | --------------------------------------------------------- | -------------------------- |
| `sitemap.xml`          | `src/app/sitemap.ts`, a static metadata route             | `out/sitemap.xml`          |
| `robots.txt`           | `src/app/robots.ts`, a static metadata route              | `out/robots.txt`           |
| `manifest.webmanifest` | `src/app/manifest.ts`                                     | `out/manifest.webmanifest` |
| `llms.txt`             | `scripts/generate-indexing-files.ts` → `public/llms.txt`  | `out/llms.txt`             |
| IndexNow key file      | `scripts/generate-indexing-files.ts` → `public/<key>.txt` | `out/<key>.txt`            |

All five are byte-identical on every request because the site is a fully static export. There is no server.

---

## 2. Why submission is a CLI script, not an API route

The reference implementation this package borrows from exposes IndexNow as a secret-gated `POST /api/indexnow` route handler. That is not available here.

`next.config.ts` sets `output: 'export'`. A static export has no runtime: no route handlers, no middleware, no server actions, no request context. A submission endpoint would have nothing to run on, and gating it behind a secret would be meaningless because there is no server to hold the secret.

The submission surface is therefore `scripts/submit-indexnow.ts`, a `tsx` CLI in the same shape as `scripts/generate-printables.ts`. It runs from CI **after** the export is deployed, or from a maintainer's machine. The secret gate is replaced by the only gate a CLI has: whoever runs it must already hold `INDEXNOW_KEY`.

Everything else about the design is unchanged from the route version, in particular the URL-derivation rule below.

---

## 3. The two hard rules

These come from `docs/seo-pages.md` §4 and from a production indexing incident on a sibling multi-domain site. They are not style preferences.

### 3.1 Submitted URLs come from the sitemap function, never from a content registry

`src/indexing/utils/build-indexable-pages.util.ts` is the single enumeration of every indexable URL. `src/app/sitemap.ts` maps over it to produce `sitemap.xml`. `buildLlmsTxt` groups it into `llms.txt`. `scripts/submit-indexnow.ts` submits it.

Nothing else may walk `PAGE_METADATA_REGISTRY` to build a URL list. Two enumerations look equivalent until one grows a filter, a locale or a conditional entry the other lacks; from that moment the submitted set silently stops matching the crawlable set, and on a multi-host build it submits URLs that do not belong to the host being submitted for, which corrupts ownership signals in the search consoles.

`scripts/submit-indexnow.ts` additionally refuses to send any URL whose host is not the `SITE_ORIGIN` host, and fails loudly rather than filtering them out.

### 3.2 Host- or locale-dependent metadata routes are `force-dynamic`, never time-`revalidate`

`sitemap.ts`, `robots.ts` and `manifest.ts` each export `dynamic = 'force-static'` today, which is correct for a single-host static export. The moment any of them starts depending on the request host or locale — a white-label domain, a preview domain, a locale segment — it must become `force-dynamic`. A time-based `revalidate` on a host-dependent metadata route lets the platform serve one host's cached output for another host. The observed symptom was every domain reporting an identical indexed page count after sitemap submission. Identical counts alone are not proof; compare response bodies and hashes per host.

---

## 4. `llms.txt`

`out/llms.txt` is the agent-readable index of the site, in the `llmstxt.org` shape: an `# <site>` heading, a `>` summary line, an orientation paragraph, then `## <section>` lists of `- [Title](url): description` entries.

It is generated, never authored. Its links are `buildIndexablePages()` in registry order, grouped by `resolveLlmsSection`, whose fallback section catches any page whose path does not match a known family — so a newly added route appears in `llms.txt` on the next build without anyone remembering to list it. The one thing to keep true when adding a page family is the section mapping in `src/indexing/utils/resolve-llms-section.util.ts`; forgetting it costs a page its section, not its listing.

The only URL in `llms.txt` that is not a page URL is the `sitemap.xml` reference in the orientation paragraph, and it is deliberately plain text rather than a list entry so that the link list and the sitemap stay exactly equal.

---

## 5. IndexNow setup

### 5.1 The key

The key is a shared secret in the weak sense: it is published at a public URL, but whoever holds it can submit URLs on behalf of the domain. It is **not** committed to this repository. `scripts/generate-indexing-files.ts` and `scripts/submit-indexnow.ts` both read it from the `INDEXNOW_KEY` environment variable.

Generate one:

```bash
openssl rand -hex 16
```

IndexNow accepts 8 to 128 characters of `a-z`, `A-Z`, `0-9` and `-`; `resolveIndexNowKey` enforces exactly that and throws on a malformed value rather than publishing a key file that can never verify.

Store it as `INDEXNOW_KEY`:

- in the CI provider's secret store, exposed to both the build job and the post-deploy submission job;
- locally in a shell profile or a `.env` file you load yourself, only when you need to run the scripts from your machine.

Never print it, never paste it into a PR, an issue or a commit. Check for presence by name only:

```bash
[ -n "$INDEXNOW_KEY" ] && echo "INDEXNOW_KEY is set"
```

### 5.2 Running the scripts

```bash
INDEXNOW_KEY=<key> yarn workspace @suuudokuuu/landing build      # writes public/<key>.txt into the export
yarn workspace @suuudokuuu/landing submit:indexnow --dry-run     # prints the URL list, submits nothing
INDEXNOW_KEY=<key> yarn workspace @suuudokuuu/landing submit:indexnow
```

Both scripts no-op with an explanatory message when `INDEXNOW_KEY` is absent, and exit `0`. That is deliberate: forks, contributors and preview builds must be able to run the full build and the full validation sequence without the secret. A build without the key produces a complete site minus the key file, and `generate-indexing-files.ts` removes a stale key file left behind by an earlier keyed build so an export can never advertise a key the environment no longer holds.

`--dry-run` needs no key at all, which makes it usable as a CI assertion that the submitted list is the sitemap list.

### 5.3 Deploy order

The key file must already be live when the submission runs, otherwise IndexNow answers `403`.

1. Build with `INDEXNOW_KEY` set.
2. Deploy `packages/landing/out`.
3. Verify `https://www.suuudokuuu.com/<key>.txt` returns the key as plaintext.
4. Run `submit:indexnow`.

### 5.4 Key rotation

1. Generate a new key.
2. Update `INDEXNOW_KEY` in the CI secret store.
3. Rebuild and redeploy. The new key file appears; the previous one is removed by the stale-file cleanup.
4. Verify the new key file over HTTP before submitting again.

Do not rotate between a build and a submission — the running script would advertise a `keyLocation` the deployed site no longer serves.

---

## 6. Verification checklist

Before submitting:

```bash
curl -sL https://www.suuudokuuu.com/$INDEXNOW_KEY.txt | xxd | tail -2
curl -s https://www.suuudokuuu.com/sitemap.xml | grep -c '<loc>'
curl -sI https://www.suuudokuuu.com/robots.txt
curl -s https://www.suuudokuuu.com/llms.txt | head -5
```

- The key file body is exactly the key, served as `text/plain`, with **no redirect** and no HTML fallback. A redirect to a locale-prefixed path is the classic failure: it serves HTML and IndexNow rejects it. If a CDN, proxy or locale rule is ever added in front of this site, the key path must bypass it.
- `sitemap.xml` returns `200`, every `<loc>` is on `www.suuudokuuu.com`, and the count equals the `--dry-run` count.
- `robots.txt` still names `https://www.suuudokuuu.com/sitemap.xml`.

After submitting:

- `200 OK` and `202 Accepted` are both success.
- `403` almost always means the key file is wrong, missing or redirected.
- `400` means a malformed payload — usually a URL outside the host.
- `422` means the URLs do not belong to the host or the key does not match.

Do not retry blindly. Recheck the key file, the host, the `keyLocation` and URL ownership first; a rejected submission is a configuration question, not a rate-limit question.

---

## 7. Search console setup

### 7.1 Google Search Console

1. Add `https://www.suuudokuuu.com` as a **URL-prefix** property (a Domain property is fine too if DNS TXT is available; prefer it, since it covers the apex and every subdomain).
2. Verify. The static export can serve an HTML verification file from `public/`, but DNS verification is preferable — it survives a hosting change.
3. Submit `https://www.suuudokuuu.com/sitemap.xml` under Sitemaps.
4. Check Pages → indexing report a few days later. Expect "Discovered — currently not indexed" on freshly published pages; it resolves on its own for pages with inbound internal links.
5. Use URL Inspection → Request indexing sparingly, for genuinely new or genuinely changed pages only.
6. Prefer "Validate fix" over removal requests for canonical, redirect and sitemap coverage issues. Request removals only when a bad URL is actually indexed and urgent.

### 7.2 Bing Webmaster Tools

1. Add the same site. Importing from Google Search Console carries the verification and the sitemap across in one step.
2. Submit the same sitemap URL explicitly even after an import.
3. Confirm IndexNow shows as connected under the IndexNow section once the key file is live and a submission has been accepted.

### 7.3 Submission is an accelerator, not a substitute

Submit the sitemap under its matching property regardless of what IndexNow reports. A push protocol speeds discovery up; it does not replace a clean sitemap, correct canonicals or accurate `lastModified` values — which here come straight from each page sidecar's `updatedAt`. A page whose `updatedAt` never moves will keep reporting itself as unchanged no matter how often it is pushed.

---

## 8. What to monitor

Weekly, in Search Console and Bing Webmaster Tools:

- **Indexed page count** against the `--dry-run` URL count. A persistent gap points at a specific coverage reason, not at submission volume.
- **Coverage reasons**: "Crawled — currently not indexed" and "Duplicate without user-selected canonical" are the two that matter here; both point at content or canonical problems, never at IndexNow.
- **Rich results**: FAQ, HowTo, BreadcrumbList and Article enhancements. A drop usually means a schema primitive changed shape, not that Google changed its mind.
- **Queries by page family**: technique guides, difficulty landers and printable pages behave differently and should be read separately.
- **`llms.txt` and key file reachability** after any hosting, CDN or redirect change. Both are root-level `.txt` files and both are exactly what a new proxy rule tends to break.

Most of that list is answered automatically by the weekly SEO report below; the reachability checks stay manual.

---

## 9. Weekly SEO report

`.github/workflows/seo-report.yml` runs `scripts/seo-report.ts` every Monday at 06:00 UTC, and on `workflow_dispatch`. The script pulls the last 28 days of Search Console data against the prior 28 days, the top 20 queries, the top 20 pages, the sitemap submission status, and the CrUX field Core Web Vitals for the origin. It appends a markdown table to the run summary and commits the raw JSON to `reports/seo/<YYYY-MM-DD>.json` on `main`, so the history is greppable from a checkout instead of living in a dashboard.

Run it locally with `yarn workspace @suuudokuuu/landing seo:report`. Without the secrets it prints which sections it is skipping, writes nothing and exits `0`, exactly like `submit:indexnow`. With secrets present it prints the same markdown to stdout when `GITHUB_STEP_SUMMARY` is unset.

### 9.1 `GCP_SA_KEY` — Search Console access

1. In Google Cloud, create (or reuse) a project and enable the **Google Search Console API**.
2. Create a service account with no project roles; Search Console permissions are granted on the property, not in IAM.
3. Create a JSON key for it and download the file.
4. In Search Console → Settings → Users and permissions, add the service account's `client_email` as a **Restricted** user of the `https://www.suuudokuuu.com/` property. Restricted is enough for read-only reporting.
5. Store the whole JSON key file as the `GCP_SA_KEY` repository secret. The script signs an RS256 JWT with `node:crypto` and exchanges it at `https://oauth2.googleapis.com/token` for a `webmasters.readonly` token, so there is no client library and no refresh token to rotate.

The property string the script queries is `SITE_ORIGIN` plus a trailing slash. A Domain property (`sc-domain:suuudokuuu.com`) is a different key and will answer `403`; grant access on the URL-prefix property that §7.1 sets up.

### 9.2 `CRUX_API_KEY` — field Core Web Vitals

1. In the same Google Cloud project, enable the **Chrome UX Report API**.
2. Create an API key under Credentials and restrict it to that API.
3. Store it as the `CRUX_API_KEY` repository secret.

CrUX only answers for origins with enough real-user traffic. A `404` from the API means the origin has no dataset yet, not that the key is wrong.

### 9.3 Failure modes

- A malformed `GCP_SA_KEY` fails with a single explanatory line and exit `1`; it never prints the key or a stack trace.
- A `403` from Search Console means the service account is not a user on the property.
- Either secret may be absent on its own. The matching section is skipped with a message and the report still commits the section that did run; only when both are absent is nothing written.
