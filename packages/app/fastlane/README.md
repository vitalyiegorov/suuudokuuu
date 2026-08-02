# Fastlane store metadata

This directory holds the App Store and Google Play listing metadata pushed by
fastlane, plus the automation that keeps the English release notes current on
every release.

## Layout

```text
fastlane/
├── Appfile              # app_identifier, package_name, team_id, credentials
├── Fastfile              # ios_metadata and android_metadata lanes
└── metadata/
    ├── ios/<locale>/
    │   ├── name.txt
    │   ├── subtitle.txt
    │   ├── promotional_text.txt
    │   ├── description.txt
    │   ├── keywords.txt
    │   └── release_notes.txt
    └── android/<locale>/
        ├── title.txt
        ├── short_description.txt
        ├── full_description.txt
        └── changelogs/default.txt
```

Locale copy (name, subtitle, description, keywords, promotional text, and
translated release notes / changelogs) is owned and maintained separately from
this automation. Only the generated `en-US` release notes and changelog files
are written by the script below.

## Locale mapping

| App locale | iOS metadata folder | Android metadata folder |
| ---------- | -------------------- | ------------------------ |
| `ar`       | `ar-SA`               | `ar`                      |
| `bn`       | not supported by Apple | `bn-BD`                 |
| `de`       | `de-DE`               | `de-DE`                   |
| `en`       | `en-US`               | `en-US`                   |
| `es`       | `es-ES`               | `es-ES`                   |
| `fr`       | `fr-FR`               | `fr-FR`                   |
| `hi`       | `hi`                  | `hi-IN`                   |
| `id`       | `id`                  | `id`                      |
| `pt`       | `pt-BR`               | `pt-BR`                   |
| `sv`       | `sv`                  | `sv-SE`                   |
| `uk`       | `uk`                  | `uk`                      |
| `ur`       | not supported by Apple | `ur`                     |
| `zh`       | `zh-Hans`             | `zh-CN`                   |

## Character limits

| Field                    | App Store | Play Store |
| ------------------------- | --------- | ---------- |
| Name / title               | 30        | 30         |
| Subtitle / short description | 30 / n/a | n/a / 80  |
| Promotional text           | 170       | n/a        |
| Description                | 4000      | 4000       |
| Keywords                   | 100       | n/a        |
| Release notes / changelog  | 4000      | 500        |

## Release notes workflow (local-first)

Release notes are generated **locally, never in CI**, and the committed files
are the source of truth. The flow:

1. When a PR finishes a user-facing task, run
   `yarn workspace @suuudokuuu/app store:notes` locally (or hand-edit the
   `release_notes.txt`/`default.txt` files) and commit the result with the PR.
   Notes accumulate PR by PR until the next store publish.
2. The script writes `metadata/release-notes-state.json` recording the base
   tag and the commit it generated from. This is how the publish workflow
   knows what the committed notes cover.
3. The "Build and Publish to Stores" workflow runs
   `generate-store-release-notes.ts --check` before pushing metadata: it
   compares the state file against `HEAD` and emits a workflow warning when
   user-facing commits landed after the last generation, listing them.
   It never blocks the publish.

`packages/app/scripts/generate-store-release-notes.ts` always starts the
same way:

1. Picks the commit range: everything since the latest tag when `HEAD` has
   moved past it (the normal pending-release case), or the latest release's
   range when `HEAD` is exactly on the tag.
2. Keeps only user-facing commits: types `feat`, `fix`, `perf`, `i18n` with no
   scope, or with scope `app`/`ui`.
3. Dedupes and sentence-cases the remaining subjects into a cleaned commit
   list.

From there it picks one of two paths.

### LLM path (default when `ANTHROPIC_API_KEY` is set)

When `ANTHROPIC_API_KEY` is available in your local shell, the script sends the
cleaned commit list and the release version to Claude (`claude-opus-5` by
default, overridable via `STORE_NOTES_MODEL`) in a single structured-output
request and asks it to write release notes in suuudokuuu's house style —
confident, playful, benefit-led — for **all 13 app locales** (`ar`, `bn`,
`de`, `en`, `es`, `fr`, `hi`, `id`, `pt`, `sv`, `uk`, `ur`, `zh`), each with
an App Store variant and a Google Play variant. It:

1. Requests the completion via the streaming Messages API with a JSON schema
   response so there is no fragile text parsing.
2. Validates every locale's length in code (App Store ≤ 3900 codepoints,
   Google Play ≤ 490 codepoints). If any locale is too long, it makes one
   retry request asking Claude to shorten only the violating fields.
3. If a locale is still too long after the retry, hard-truncates it at a
   line boundary, the same way the fallback path does.
4. Writes `metadata/ios/<locale>/release_notes.txt` for the 11 locales Apple
   supports (all but `bn` and `ur`) and
   `metadata/android/<locale>/changelogs/default.txt` for all 13 locales, and
   prints a summary of every file written.

If `ANTHROPIC_API_KEY` is absent, or the API call throws for any reason
(refusal, network error, invalid response), the script logs a warning and
falls back to the plain English path below.

### Fallback path (English only)

1. Renders a plain "What's new" bullet list from the cleaned commit list,
   deduped and sentence-cased (or a generic "Stability and quality
   improvements" line when there are no user-facing commits).
2. Writes it to `metadata/ios/en-US/release_notes.txt` (trimmed to 4000
   characters) and `metadata/android/en-US/changelogs/default.txt` (trimmed to
   500 characters at a line boundary).
3. Never touches non-`en-US` locale files, and prints a warning listing
   locale files that are now older than the refreshed `en-US` copy so
   translators know what to revisit.

Run it locally with:

```bash
yarn workspace @suuudokuuu/app store:notes
```

Check freshness (the same check the publish workflow runs):

```bash
node packages/app/scripts/generate-store-release-notes.ts --check
```

No CI secret is needed for release notes — `ANTHROPIC_API_KEY` only has to
exist in the developer's local environment for the localized LLM path.

## Pushing metadata to the stores

`.github/workflows/native-publish.yml` runs the fastlane lanes right after
each store submission, on the same self-hosted macOS runner used to build and
submit the app:

- iOS: after "Submit iOS app", `fastlane ios_metadata` runs `deliver` with
  `skip_binary_upload`/`skip_screenshots` so it only pushes text metadata,
  authenticated with the same App Store Connect API key used by `eas submit`.
- Android: after "Submit Android app", `fastlane android_metadata` runs
  `supply` with the upload flags skipped, authenticated with the same Google
  Play service account JSON used by `eas submit`.

Both lanes can also be run locally from `packages/app` once the relevant
credentials are exported:

```bash
EXPO_ASC_KEY_ID=... EXPO_ASC_ISSUER_ID=... EXPO_ASC_API_KEY_PATH=... fastlane ios_metadata
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=... fastlane android_metadata
```

## Screenshot pipeline (manual, committed to the repo)

Store media is generated **manually, on demand** — never in CI — because it
changes rarely. The final framed assets are committed to the repo and only
uploaded when explicitly requested.

1. Capture raw frames (only when the UI meaningfully changed): run
   `APP_ID=com.vitalyiegorov.suuudokuuu yarn workspace @suuudokuuu/app-tests screenshots:capture`
   on an iPhone 17 Pro Max simulator (the 6.9" 1320×2868 store slot, the
   default `DEVICE_CLASS=iphone`). For the 13" iPad slot (2064×2752), boot an
   "iPad Pro 13-inch (M4)" simulator (or closest available) and run the same
   command with `DEVICE_CLASS=ipad` and that simulator's UDID:

   ```bash
   APP_ID=com.vitalyiegorov.suuudokuuu SIMULATOR_UDID=<iphone-udid> \
       yarn workspace @suuudokuuu/app-tests screenshots:capture
   DEVICE_CLASS=ipad APP_ID=com.vitalyiegorov.suuudokuuu SIMULATOR_UDID=<ipad-udid> \
       yarn workspace @suuudokuuu/app-tests screenshots:capture
   ```

   Pass `SIMULATOR_UDID` explicitly whenever more than one simulator may be
   booted. Raw captures land in `fastlane/screenshots/raw/<platform>/
   <device-class>/<locale>/<appearance>/` for iOS (gitignored; Android has no
   device-class segment). See `tests/app-tests/flows/screenshots/README.md`
   for the full device matrix and scene list.
2. Frame + caption with fastlane `frameit` using the config and per-locale
   captions in `fastlane/screenshots/design/` (see its README for the exact
   commands).
3. Commit the final framed assets:
   - iOS: `fastlane/screenshots/ios/<ios-locale>/*.png` (read by the
     `ios_screenshots` lane via `deliver`'s `screenshots_path`).
   - Android: `fastlane/metadata/android/<locale>/images/phoneScreenshots/`
     plus `images/featureGraphic.png` (the standard `supply` layout, read by
     the `android_screenshots` lane).
4. Upload happens only on request: check "Also upload the committed store
   screenshots" when dispatching the "Build and Publish to Stores" workflow,
   or run the lanes locally:

```bash
EXPO_ASC_KEY_ID=... EXPO_ASC_ISSUER_ID=... EXPO_ASC_API_KEY_PATH=... fastlane ios_screenshots
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=... fastlane android_screenshots
```

Target asset specs:

- iOS: 6.9" primary screenshot set at 1320×2868, plus a 13" iPad set at
  2064×2752.
- Play Store: phone screenshots at 1080×1920, plus one 1024×500 feature
  graphic.
- App Preview video: 886×1920, H.264, 15-30 seconds.
- Animated GIFs are not accepted by either store and must not be used.
