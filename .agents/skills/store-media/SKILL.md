---
name: store-media
description: Regenerate, extend, or publish Suuudokuuu's App Store and Google Play listings - screenshots, creative assets, metadata, keywords, In-App Events, custom pages, experiments, promotional content, release notes, and image-generation briefs. Use when touching packages/app/fastlane/**, store screenshots, store texts, ASO issues (epic #465), release notes, or the capture/compose pipelines.
---

# Store media and metadata

Everything store-facing is repo-committed and regenerated manually; CI only
publishes what is committed. Nothing is generated on release. ASO work is
tracked under epic #465 as native sub-issues (see `AGENTS.md`, "Issue
Tracking"); store-facing issues carry `area:aso`, `area:app-store`,
`area:google-play`, `area:media`.

Capture mechanics live in `tests/app-tests/docs/store-screenshot-capture.md`,
the canonical reference for the seeded-state fast path, per-platform commands,
the seed fixture, and the verification checklist. Read it before capturing.
This skill owns listing texts, captions, design decisions, 2026 store
features, asset specs, and publishing.

Sources (dated 2026-10-07 research): Apple creative assets
<https://developer.apple.com/help/app-store-connect/manage-app-information/manage-your-app-store-assets>,
specs
<https://developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications>,
WWDC26 session 205 <https://developer.apple.com/videos/play/wwdc2026/205/>,
Apple asset rules <https://developer.apple.com/app-store/asset-best-practices/>,
Google Play custom listings
<https://support.google.com/googleplay/android-developer/answer/9867158>,
experiments <https://support.google.com/googleplay/android-developer/answer/6227309>,
promotional content
<https://support.google.com/googleplay/android-developer/answer/12932541>,
metadata policy
<https://support.google.com/googleplay/android-developer/answer/9898842>,
<https://support.google.com/googleplay/android-developer/answer/9866151>,
<https://support.google.com/googleplay/android-developer/answer/1078870>.
Items marked "unconfirmed" were not verified on the vendor page; re-check
before relying on them.

## File map

- `packages/app/fastlane/metadata/ios/<locale>/` - 11 App Store locales: ar-SA,
  de-DE, en-US, es-ES, fr-FR, hi, id, pt-BR, sv, uk, zh-Hans (no bn/ur, Apple
  does not support them). Files: name, subtitle, keywords, promotional_text,
  description, release_notes, support_url (+ root `copyright.txt`). No
  marketing_url, privacy_url, categories, or age-rating config yet.
- `packages/app/fastlane/metadata/android/<locale>/` - 13 Play locales: ar,
  bn-BD, de-DE, en-US, es-ES, fr-FR, hi-IN, id, pt-BR, sv-SE, uk, ur, zh-CN.
  Files: title, short_description, full_description, changelogs, and
  `images/phoneScreenshots/`. No feature graphic, icon asset, tablet sets, or
  video yet.
- `packages/app/fastlane/metadata/release-notes-state.json` - base tag +
  commit of the last release-notes generation; the publish workflow warns when
  user-facing commits landed after it.
- `packages/app/fastlane/screenshots/design/` - compose pipeline:
  `compose-screenshots.sh` (ImageMagick 7), `<locale>/title.strings` +
  `subtitle.strings` (captions, every iOS locale plus bn-BD and ur), frameit
  `Framefile.json`, README.
- `packages/app/fastlane/screenshots/raw/{ios,android}/` - gitignored captures.
- `packages/app/fastlane/screenshots/variants/{dark,light}/ios/<locale>/` -
  committed, framed, store-ready sets: 9 iPhone (1320x2868) + 6 iPad
  (2752x2064) per locale. One full mirrored set per appearance variant (same
  scenes/order/layouts; only the closing shot flips to the opposite
  appearance).
- `packages/app/fastlane/metadata/android/<locale>/images/phoneScreenshots/` -
  committed, framed Play set: 8 shots at 1080x1920 per locale, written by the
  same compose script. One set (no light/dark pair), mirroring the deployed
  dark App Store story. Stale until #448 lands.
- `packages/app/fastlane/screenshots/deployed-variant.json` - variant the
  `ios_screenshots` lane uploads (currently `dark`; dark-first is a user
  decision). `SCREENSHOT_VARIANT=light|dark` overrides it.
- `packages/app/fastlane/{Fastfile,Appfile}` - lanes `store_preflight`,
  `ios_metadata`, `android_metadata`, `ios_screenshots`, `android_screenshots`
  (address as `fastlane <platform> <lane>`; bare names resolve against
  `default_platform(:ios)`). Lane bodies run from `fastlane/` while actions run
  from `packages/app/`, so plain-Ruby paths anchor on `FASTLANE_DIR`/`APP_DIR`,
  never the working directory. `store_preflight` needs no credentials and gates
  both publish jobs. Android lanes read the track from
  `submit.production.android.track` in `eas.json` and resolve the version code
  with `google_play_track_version_codes` (supply cannot infer one when it
  uploads no binary). No lanes exist for previews, video, In-App Events, custom
  pages, experiments, promotional content, or creative assets.
- `tests/app-tests/flows/screenshots/` - capture flows (15 scenes),
  `tests/app-tests/scripts/capture-store-screenshots.ts` - runner,
  `bake-landscape-screenshot.ts` - physical rotation bake.
- `.github/workflows/native-publish.yml` - store publish; `fastlane
  store_preflight` gates both jobs; metadata pushes after each `eas submit`;
  screenshots upload only with the `push_screenshots` checkbox; the
  release-notes freshness check runs `node scripts/generate-store-release-notes.ts --check`.

## Workflows

Release notes (local-first, never CI): run
`pnpm --filter @suuudokuuu/app store:notes` in a PR that finishes user-facing
work, commit the result. With `ANTHROPIC_API_KEY` set it writes model-authored
notes for all 13 locales (model `claude-opus-5`, override `STORE_NOTES_MODEL`);
without it, plain English fallback.

Screenshots, end to end:

1. Capture: `APP_ID=<bundle-id> SIMULATOR_UDID=<udid> pnpm --filter
   @suuudokuuu/app-tests screenshots:capture --locales=en --scenes=...` (add
   `DEVICE_CLASS=ipad ORIENTATION=landscape` for iPad landscape; the runner
   recycles the XCUITest driver, retries failures once, and bakes landscape
   pixels to 2752x2064 without EXIF). Android: create an AVD from a
   `google_apis` image, boot it, `adb shell wm size 1080x2340` and `adb shell wm
   density 440` (matches the Pixel 5 frame cutout), install the app, then
   `... screenshots:capture --platform=android --serial=<adb-serial>
   --locales=en`. The progress label prints `[iphone/...]` on Android; cosmetic,
   output goes to `raw/android/`.
2. Compose: `bash packages/app/fastlane/screenshots/design/compose-screenshots.sh en-US all`.
   It frames captures with real frameit device frames, applies two-tier
   captions, composes into a temp staging dir, and swaps the committed set in
   only once every scene of that variant succeeded (the old clear-then-compose
   order once ate de-DE/light's iPad shots; never reintroduce an up-front
   `rm -f "$OUT_DIR"/*.png`). Second arg: `light|dark|all|android` (`android`
   composes only the Play set, for when iOS raws are missing). Scene manifests
   are `SCENES_LIGHT`/`SCENES_DARK`; palettes live in `set_variant_palette`.
   Keep the manifests mirrored.
3. Review visually (downscale with sips and look), commit both sets.
4. Upload: dispatch "Build and Publish to Stores" with the screenshots
   checkbox, or run the lanes locally.

### Fast capture path (default `--capture-mode=fast`)

Scenes with a deep link are captured directly, without Maestro; scenes without
one (`05.win`, `11.pause`) fall back to their Maestro flow. Measured: a full
locale (8 scenes x dark+light) takes 1 min 37 s instead of 40 min. Three steps
per directly captured scene, no accessibility tree:

1. `scripts/seed-app-state.ts` writes the legacy redux-persist blob into the
   app's SQLite storage; the app's boot-time legacy import moves it into the
   progress database on next launch. Terminate the app first (a running app
   holds the WAL and overwrites the seed).
2. `xcrun simctl launch <udid> <app> -AppleLanguages "(<lang>)" -AppleLocale <id>`
   (Android: `adb shell cmd locale set-app-locales <pkg> --locales <lang>` then
   `am start -n <pkg>/.MainActivity`).
3. `simctl openurl` the scene deep link, then `simctl io screenshot` (Android:
   `adb exec-out screencap -p`).

Verified facts: the app language comes from persisted `settings.language`, not
the OS (so every locale works, including those below the language sheet's
fold); Android needs a rootable `google_apis` emulator for the state write
(`adb root` is refused on `google_apis_playstore`); the runner overrides the
status bar (9:41, full bars, 100% battery; `--status-bar=real` restores the
clock); `fixtures/screenshot-seed-state.json` holds the real
`historyByDifficulty` for all difficulties plus `sceneStates` (`hero`,
`challengeLive`); scenes carry their own `deepLink`, `sceneState`,
`seedDifficulty` in `AllScenes`, and a scene without `deepLink` falls back to
its Maestro flow (`05.win` has no seedable route). Regeneration recipe for the
fixture is in the capture doc.

Do not use fastlane `snapshot`: it needs an XCUITest target, but
`packages/app/ios` and `android` are gitignored (continuous native
generation), so any target is destroyed on every `expo prebuild`.

## Design system (user-approved decisions - do not regress)

- Two-tier captions: dominant Inter Black headline + smaller descriptor at
  ~0.75 opacity; copy lives in `title.strings`/`subtitle.strings`.
- Flat near-flat background, mirrored per variant (light #F7F7F7->#F1F1F1,
  dark #141414->#0E0E0E). No gradients - they fight the minimalist
  black/white/red brand.
- No accent underline/flag bar - was tried, user rejected as not premium.
  Uniform variant text color (#0A0A0A light / #F5F5F5 dark); typography
  carries hierarchy.
- Real frameit frames (Apple iPhone 16 Pro Max Black Titanium is a
  pixel-perfect 1320x2868 cutout at +75+66, the 6.9" slot, and stays black
  because Apple ships no black 17 Pro Max; iPad uses the 12.9" 4th-gen frame
  scaled 0.7%). Soft drop shadow.
- Tight caption-device gap (1.6% canvas height), text within 90% width.
- Two alternating layouts (text-top / device-top); the challenge pair
  (accept + live) intentionally shares one layout to read as a story.
- Output dims must EXACTLY match capture dims - deliver assigns App Store
  slots by resolution.
- Set curation (user decisions): NO win/confetti shot; hero = airy
  fresh Nightmare board with pencil marks (not a nearly-solved board);
  challenge = two-shot story with anticheat + technique + live wording;
  themes + languages merged into one two-device combo (EN editor + UK
  themes); replay uses the redesigned screen; one closing opposite-mode
  shot per variant (dark closer in the light set, light closer in the dark
  set - caption keys `01-hero-board-dark`/`01-hero-board-light`).
- Captures are clipped to the frame's enclosed screen cutout (flood-fill
  mask in `frame_capture`) - the cutout bounding box overlaps the frame's
  transparent outer corners, so an unmasked square capture pokes past the
  bezel at all four corners.

## Store requirements (learned the hard way, all verified live)

- **The App Store version must exceed the released one.** `packages/app/package.json`
  is the only version that matters: `app.config.js` stamps the binary from it and
  the fastlane lanes pass it to `deliver`. It silently diverged once - the store
  went live on 2.0.0 while the repo kept building 1.74.x - so every metadata push
  created a version _below_ the released one, which Apple will never accept. Before
  publishing, check the repo version against the live one (`itunes.apple.com/lookup?id=6449440933`
  needs no credentials) and bump `packages/app/package.json` plus `lerna.json` if
  the store is ahead.
- **A wrong version cannot be deleted.** App Store Connect refuses with "Only the
  first version of any platform can be deleted" and "A version cannot be deleted if
  any build has been uploaded for the platform". The only correction is to fix
  `package.json` and re-run the lane: `deliver`'s `ensure_version!` renames the
  editable version in place.
- **Copyright must carry the current year** or precheck fails. `store_preflight`
  guards it, so a January rollover fails in seconds instead of at review time.
- **Support URL is per locale.** Setting only `en-US` leaves every other locale
  empty and precheck flags each one. Every field under `metadata/ios/<locale>/`
  must exist for all 11 App Store locales.
- **Screenshot slots are assigned by resolution, not by filename or order.** A set
  captured at the wrong size uploads into its own slot and leaves the current store
  images untouched - the listing looks unchanged. `store_preflight` prints the slot
  each committed screenshot maps to, fails on any size Apple does not recognise, and
  warns when the primary iPhone 6.9" (1320x2868) set is missing. iPad 13" is
  2064x2752 portrait / 2752x2064 landscape.
- **The screenshot lane needs `metadata_path` even with `skip_metadata: true`.**
  `deliver` validates the metadata root's subdirectories as locale names
  regardless, and the default `./fastlane/metadata` holds `ios/` and `android/`,
  so it aborts with "Unsupported directory name(s) for screenshots/metadata".
  Both iOS lanes therefore pass `metadata_path: IOS_METADATA_PATH`.
- **1320x2868 uploads land in `APP_IPHONE_67`**, Apple's largest iPhone slot -
  there is no separate 6.9" set. With `overwrite_screenshots: true` the upload
  also clears the legacy `APP_IPHONE_65` set, so the listing ends up with one
  iPhone set instead of three stale ones.
- **`deliver` can leave duplicate screenshots behind.** Its post-upload
  verification sometimes reports a freshly uploaded file as "missing on App
  Store Connect", retries it, and both copies survive. Check the set count
  after uploading and delete extras by `file_name`.
- **Screenshots lock the moment the version is submitted for review.** Once the
  editable version enters the review queue (a manual "Submit for Review" in App
  Store Connect is enough - `eas submit` only uploads the binary), the ASC API
  refuses screenshot deletion with "Can't Delete Screenshot After Submit for
  review", so `ios_screenshots`' `overwrite_screenshots: true` fails after
  retries. Metadata pushes still go through; Google Play has no such lock.
  Push screenshots before submitting the version for review, or after approval
  to the next editable version; the only same-version escape is cancelling the
  review submission.
- **precheck only warns.** It runs at the end of `ios_metadata` and never fails the
  lane, so read its output - it is the only place these problems surface before a
  human review rejection.
- **Nothing reaches the public listing until the version is submitted and approved.**
  Metadata pushes land on the editable version page; the live listing is unchanged.
  Screenshots are opt-in: the publish workflow only uploads them when the
  `push_screenshots` checkbox is ticked at dispatch.

## Environment gotchas (hard-won, verified)

- Before ANY capture session, verify the installed app version matches the
  repo: `xcrun simctl listapps <udid> | grep -A2 <bundle-id>` (or launch and
  check Settings) against `packages/app/package.json`. An entire 10-locale
  iOS set was once captured on a stale 2.1.0 build while the repo was at
  2.5.1 — every shot showed untranslated pre-release UI and the SE-rating
  fixtures could not seed, and the whole set had to be recaptured. A stale
  build is invisible in the screenshots themselves until a native speaker or
  a missing feature exposes it.
- Store copy must use the app's own translated terms. Audit listing text
  against `packages/app/src/i18n/locales/<locale>/messages.po` for difficulty
  names (Infinity is translated per locale), technique labels (X-Wing and
  Swordfish stay Latin everywhere; Naked Pair et al. are translated), theme
  names, and the statistics vocabulary ("Hardest solve", "Your arsenal").
  A first-pass translation left "arsenal" untranslated in ur/hi/bn, invented
  "salto de rana"/"Schwertfisch" for Swordfish, and inverted "the grids the
  community made famous" in 10 locales — audit per locale against the
  catalogs, never trust a bulk pass.
- SE values always render with a dot (`formatSeRatingValue` uses `toFixed`),
  so store copy must write `SE 6.6`, never a locale decimal comma.
- fastlane overwrites `fastlane/README.md` with its generated lane docs after
  every local lane run, destroying the hand-written doc. The Fastfile calls
  `skip_docs` to prevent that; do not remove it.
- Metro file watching is broken in t3 worktrees: after ANY app-source edit,
  kill the port-8081 process and cold-start Metro, or the app serves stale
  code. Fast Refresh never fires.
- The DerivedData "Debug" prebuild app has EAS Updates enabled and silently
  runs the PUBLISHED bundle instead of Metro. Build a real dev client with
  `pnpm ios` for local iteration; connect via
  `xcrun simctl openurl <udid> "<bundle-id>://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"`.
- Do not reboot simulators mid-pipeline: the dev client loses its Metro
  connection and lands on the launcher, failing every flow.
- Maestro XCUITest driver wedges (instant connection-refused): run
  `tests/app-tests/scripts/recycle-ios-driver.sh <udid>`; the runner now
  does this automatically. If it persists, uninstall
  `dev.mobile.maestro-driver-iosUITests.xctrunner` from the sim.
- Maestro on iPad wide layout: ~19s per interaction, so gameplay-fixture
  scenes (win/replay/stats/pause/history) are iPhone-only.
- Parent-`.Root` testIDs may never register in the iOS accessibility
  snapshot while child testIDs do - assert on a child element.
- ImageMagick here has ZERO registered fonts: always pass
  `-font <abs path>` (Inter Black at repo-root
  `node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf`).
- ImageMagick silently degrades composites to grayscale when a flat
  neutral layer is involved: force `-define png:color-type=2|6` on writes.
- Maestro writes landscape screenshots in the portrait framebuffer with a
  PNG eXIf orientation-6 hint; stores need baked pixels - the runner's
  bake handles it.
- iPad GameScreen captures show a stray iPadOS predictive-text toolbar
  (suspected hidden hardware-keyboard listener in-app). Still unfixed, and
  present in every committed iPad shot - verified byte-for-byte identical
  framing against the pre-6.9" set, so it is not a capture regression.
- Prime iOS's "Open in <app>?" custom-scheme dialog once on every fresh
  simulator - iPhone and iPad - before capturing, or every scene strands on
  the dialog. A single tap on "Open" via a UI driver (`npx serve-sim tap`) or
  one run of `flows/setup/prime-deep-links.flow.yaml` primes it; on iOS 26.2
  the iPhone 17 Pro Max needed this exactly like the iPad. The iPad also
  queues the dialog across relaunch, so `simctl erase` it and reinstall before
  priming.
- The iPhone set must be captured on an iPhone 17 Pro Max simulator for the
  6.9" store slot (1320x2868). This machine ships zero simulators by default -
  create one with `xcrun simctl create`. Capture needs a real installed build,
  so `expo run:ios --configuration Release` with `APP_VARIANT=production` has
  to finish first; there is no prebuilt app to reuse.

## App Store 2026 features

Live in App Store Connect since 2026-10-05, shown on iOS/iPadOS 27+. Older OS
versions keep the classic product page, so screenshots stay the baseline.

### Creative assets and the Asset Library

- Version page > Product Page Information has two tabs: "App Previews and
  Screenshots" and "Header and Search Results". The new app-level Asset Library
  holds "creative assets".
- Header asset: the first visual above the icon and screenshots, 21:9. Search-
  results asset: 3:2, replaces the default screenshots in organic search. For
  a universal asset, use the toggle "Use header asset in search results".
- Review: attach to a version, or submit standalone from the Asset Library
  (no build needed). Once approved, an asset is reusable in header, search
  results, custom product pages, PPO, and In-App Events.
- Apple's templates and the new Preview tool show per-device crops; keep the
  focal point centred.
- Content rules (asset best practices): 4+ safe imagery even if the app is
  rated higher; no prices, discounts, URLs, unverified awards, Apple badges, or
  other platforms' logos; short localized text; alpha is rejected (screenshots
  since 2026-07-08).
- Screenshots: first three show in search and carry the core loop plus the
  strongest benefit; more than 50% of each set must show the real app UI
  (guideline 2.3.3). Caption OCR ranking is unconfirmed; write captions for
  conversion.

### In-App Events

Name 30, short description 50, long description 120; up to 10 live, each at
most 31 days, promotable up to 14 days ahead. Badges: Challenge, Competition,
Live Event, Major Update, New Season, Premiere, Special Event. Events are
indexed in search and appear on the product page and in search.
Media: card 16:9, detail 9:16 (sizes in the table). Plan a
monthly cadence (#476) with artwork from the kit (#473).

### Custom Product Pages, PPO, keywords

- Custom Product Pages: up to 70, each with its own screenshots, previews,
  promotional text, and deep link. Since 2025-07-30 a CPP can also be matched
  to organic keywords, so map pages to search intents (#477).
- Product Page Optimization: up to 3 treatments against the original, one test
  at a time, up to 90 days, 90% confidence. Header testing is mentioned at
  WWDC26 but unconfirmed on Apple's PPO page. One variable per test; record
  hypothesis, metric, and duration before starting (#478).
- Field budget: Name 30, Subtitle 30, Keywords 100 bytes (no repeated
  name/subtitle words, no plurals, no "app"/"game", no competitor names),
  Promotional text 170 (not indexed, changeable without review), Description
  4000 (not indexed), What's New 4000. Screenshots up to 10 per device;
  previews up to 3 per size and locale, 15-30 s.
- Cross-localization: each storefront indexes extra localizations (US: en-US
  plus es-MX, ru, zh-Hans, ar, fr, pt-BR, zh-Hant, vi, ko), so the other
  locales' name/subtitle/keywords add indexed bytes. Do not repeat a word
  across locales that index together; spend each field on new terms
  (<https://www.apptweak.com/en/aso-blog/how-to-benefit-from-cross-localization-on-the-app-store>).
  Sweep tracked in #467.
- Categories: Games primary plus up to 2 subcategories (the primary is
  indexed). App Store Tags are generated automatically; review and deselect
  wrong ones. Age rating: the new questionnaire (4+/9+/13+/16+/18+) was due
  2026-01-31; keep answers current (#481).
- iPhone Duo (foldable) screenshots are required for submissions from April
  2027: 1398x2034 and 2007x2853 (#482). `deliver` has no display type for them
  yet.
- Known stale copy: en-US keywords still carry `17clue` (Hell is no longer a
  17-clue tier); fix in #467.

## Google Play 2026 features

- Limits: title 30, short description 80, full description 4000 (indexed).
  Ask Play and Gemini Q&A draw on the top of the full description, so lead with
  what the game is, who it is for, and the key differentiators in plain
  sentences.
- Custom store listings: up to 50, targeted by country, keyword, Ads traffic,
  or URL parameter `&listing=`. Gemini can generate a keyword-tailored custom
  listing in one click (Google I/O 2026); multi-language listings can be
  imported from CSV/Sheet (June 2026). Tracked in #477.
- Store listing experiments: control plus up to 2 variants (older docs say 3,
  unconfirmed); one default-graphics experiment or up to 5 localized ones at a
  time; testable: icon, feature graphic, screenshots, descriptions. One
  variable per test (#478).
- Promotional content (formerly LiveOps): offer, time-limited event, or major
  update. Needs tagline, description, main image, square image, optional
  video; runs up to 4 weeks; submit up to 60 days ahead; approval takes up to 4
  days; featuring requests need 14+ days lead time (#476).
- Tablets and large screens: 7" and 10" sets (at least 4 shots each, 16:9 or
  9:16, 1080-7680 px) earn the large-screen badge and form-factor detail pages
  (since Q2 2026). Tracked in #479.
- Level Up program (games), from 2026-09-30 in AU/EEA/JP/UK/US: needs Play
  Games Services v2 (sign-in, achievements, cloud save), large-screen and PC
  support, 60 fps; benefits are You-tab visibility and reduced fees. Eligibility
  check in #484.
- Video: YouTube link, first 30 s autoplay, at least 80% gameplay; alt text for
  screenshots is supported.
- Metadata policy: no emoji, ALL CAPS, or repeated special characters in the
  title; no "Best", "#1", "Top", "New", "Sale", "Free", ranking, price, or
  download calls to action; no keyword lists; screenshot captions at most 20%
  of the image area; no device frames; no third-party logos. Our framed Play
  set must be re-checked against the frames and 20% rules when recaptured
  (#448).

## Asset size table

| Store | Asset | Spec |
| --- | --- | --- |
| App Store | iPhone 6.9" screenshot | 1320x2868 portrait (lands in `APP_IPHONE_67`), <=10, no alpha |
| App Store | iPad 13" screenshot | 2064x2752 portrait / 2752x2064 landscape, <=10, no alpha |
| App Store | iPhone Duo screenshot (Apr 2027) | 1398x2034 and 2007x2853 |
| App Store | App preview | up to 3 per size/locale, 15-30 s, H.264, 886x1920 for 6.9" iPhone portrait; GIF rejected |
| App Store | Header creative | image 21:9 3840x1646 JPG/PNG (or 16:9 5244x2950 PNG); video 21:9 3840x1646, 30/60 fps, 5-30 s, loops muted |
| App Store | Search-results creative | image 3:2 1920x1280 to 3840x2560 (or 16:9 5244x2950); video 3:2, 5-30 s |
| App Store | In-App Event card | 16:9 1920x1080 to 3840x2160 (video 15-30 s) |
| App Store | In-App Event detail | 9:16 1080x1920 to 2160x3840 |
| App Store | App icon | 1024x1024, no alpha |
| Google Play | Icon | 512x512 PNG, <=1 MB |
| Google Play | Feature graphic | 1024x500, no alpha, focal point centred |
| Google Play | Phone screenshots | 8 max, 320-3840 px, aspect <=2:1; games need >=3 at 1080x1920 (or 1920x1080); ours 8 at 1080x1920 |
| Google Play | 7" / 10" tablet and Chromebook | >=4 each, 1080-7680 px, 16:9 or 9:16 |
| Google Play | Promotional content | main image, square image, optional video (per Play Console form) |
| Google Play | Video | YouTube URL, >=80% gameplay |

Always confirm exact numbers on Apple's creative-assets specifications page
before producing artwork; the header/search/event rows come from it.

## Image-generation brief template

Artwork (header, search-results, feature graphic, event cards) is generated
from a brief; captions and any text are never generated, they are overlaid by
our compose pipeline from `design/<locale>/{title,subtitle}.strings`. Generated
art leaves clean space for the caption and contains no text, UI chrome, logos,
prices, or badges. Issues needing artwork carry `needs:image-generation` and the
issue body is the brief. Every brief states:

1. Spec: store, asset name, pixel size, aspect ratio, format, alpha allowed
   (never for the App Store), file size limit.
2. Placement: where it appears (above the icon, search result card, Play
   listing top, event card), which regions are cropped per device, and the
   caption safe area to keep empty.
3. Constraints: no text, no real device frames unless specified, no
   third-party logos, 4+ safe imagery, no prices/URLs/awards/badges, centred
   focal point, locale-neutral (the same art serves all locales).
4. Brand notes: minimalist black/white/red, flat near-flat backgrounds, no
   gradients, Inter Black typography is applied later; Sudoku grid motif.
5. Ready-to-use prompt: one self-contained prompt that restates the size,
   style, composition, and the "no text" rule.
6. Variants: 2-3 labelled alternatives (for PPO or experiments), differing in
   one variable only.
7. Acceptance: pixel size exact, no alpha, no text artifacts, focal point
   survives the listed crops, passes the content rules above, committed under
   the path named in the issue.

## Publishing tooling gap

fastlane `deliver` and `supply` (fastlane 2.240.1) support none of the 2026
additions: creative assets and the Asset Library, In-App Events, custom
product pages, PPO, iPhone Duo display types, Play custom listings,
experiments, promotional content, tablet sets, or feature graphics beyond what
`supply` already reads from `images/`. `deliver` has uploaded app previews
since March 2026. Use the App Store Connect API (creative assets and Asset
Library are exposed; exact endpoint names unconfirmed) via a small script, or
upload manually; the plan is #474. Play Console features are manual unless the
Play Developer API covers them.

## Current state / open items

- Framed sets are committed in both variants (9 iPhone at 1320x2868 + 6 iPad
  at 2752x2064) for en-US, uk, de-DE, es-ES, fr-FR, pt-BR, sv, id, and the other
  iOS locales under `screenshots/variants/{dark,light}/ios/`; dark is deployed.
  ar-SA recapture is owed after the RTL fix (#447); the Hell scene recapture is
  owed (#445).
- Play phone sets (8 at 1080x1920) are captured per locale but predate the
  redesigns (#448). Missing: 1024x500 feature graphic (design artwork, not a
  capture), 7"/10" tablet sets, App Preview video (886x1920 H.264 15-30 s; GIFs
  rejected by both stores).
- Non-Latin captions: `set_caption_engine` sends ar-SA, ur, hi, bn-BD, and
  zh-Hans through `rsvg-convert` (needs `brew install librsvg`) instead of
  ImageMagick's glyph-less freetype path; Latin and Cyrillic keep freetype.
- Home strings follow the saved app language; keep seeding `-AppleLanguages`
  alongside `settings.language` so system alerts match.
- The store capture should become an E2E smoke run (#483). There is no in-app
  rating prompt yet (#475).
