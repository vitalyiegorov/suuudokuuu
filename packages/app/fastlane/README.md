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

## Release notes automation

`packages/app/scripts/generate-store-release-notes.mjs` runs after every
`yarn release` on `main` (see `.github/workflows/main.yml`, job `release`,
step "Sync store release notes"). It:

1. Reads the latest and previous git tags and the conventional-commit
   subjects between them.
2. Keeps only user-facing commits: types `feat`, `fix`, `perf`, `i18n` with no
   scope, or with scope `app`/`ui`.
3. Renders a "What's new" bullet list, deduped and sentence-cased.
4. Writes it to `metadata/ios/en-US/release_notes.txt` (trimmed to 4000
   characters) and `metadata/android/en-US/changelogs/default.txt` (trimmed to
   500 characters at a line boundary).
5. Never touches non-`en-US` locale files, and prints a warning listing
   locale files that are now older than the refreshed `en-US` copy so
   translators know what to revisit.

Run it locally with:

```bash
yarn workspace @suuudokuuu/app store:notes
```

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

## Screenshot pipeline (planned)

Screenshots and preview videos are not generated yet; the plan is:

1. Capture raw frames on-device with Maestro's `takeScreenshot` command,
   driving the same flows as `tests/app-tests`.
2. Frame and localize the raw captures with fastlane `frameit`.
3. Feed the framed output straight into the `deliver`/`supply` metadata
   directories so the existing `ios_metadata`/`android_metadata` lanes upload
   them alongside text metadata.

Target asset specs:

- iOS: 6.9" primary screenshot set at 1320×2868.
- Play Store: phone screenshots at 1080×1920, plus one 1024×500 feature
  graphic.
- App Preview video: 886×1920, H.264, 15-30 seconds.
- Animated GIFs are not accepted by either store and must not be used.
