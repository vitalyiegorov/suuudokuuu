---
name: store-media
description: Regenerate, extend, or publish Suuudokuuu's App Store / Play Store listing assets - screenshots, metadata, release notes. Use when touching packages/app/fastlane/**, store screenshots, store texts, release notes, or the capture/compose pipelines.
---

# Store media and metadata

Everything store-facing is repo-committed and regenerated manually - CI only
publishes what is committed. Media changes rarely; nothing is generated on
release.

## File map

- `packages/app/fastlane/metadata/{ios,android}/<locale>/` - listing texts.
  11 App Store locales (no bn/ur - unsupported by Apple), 13 Play locales.
  Char limits: name/title 30, subtitle 30, promo 170, description 4000,
  keywords 100, App Store notes 4000, Play changelog 500.
- `packages/app/fastlane/metadata/release-notes-state.json` - records base
  tag + commit of the last release-notes generation; the publish workflow
  warns when user-facing commits landed after it.
- `packages/app/fastlane/screenshots/design/` - compose pipeline:
  `compose-screenshots.sh` (ImageMagick 7), `<locale>/title.strings` +
  `subtitle.strings` (captions), frameit design kit README.
- `packages/app/fastlane/screenshots/raw/` - gitignored Maestro captures.
- `packages/app/fastlane/screenshots/ios/en-US/` - the committed, framed,
  store-ready set uploaded by the `ios_screenshots` lane.
- `packages/app/fastlane/{Fastfile,Appfile}` - lanes: `ios_metadata`,
  `android_metadata`, `ios_screenshots`, `android_screenshots`.
- `tests/app-tests/flows/screenshots/` - capture flows (13+ scenes),
  `tests/app-tests/scripts/capture-store-screenshots.ts` - runner,
  `bake-landscape-screenshot.ts` - physical rotation bake.
- `.github/workflows/native-publish.yml` - store publish; metadata pushes
  after each `eas submit`; screenshots upload only with the
  `push_screenshots` checkbox; release-notes freshness check runs
  `node scripts/generate-store-release-notes.ts --check`.

## Workflows

Release notes (local-first, never CI): run
`yarn workspace @suuudokuuu/app store:notes` in a PR that finishes
user-facing work, commit the result. With `ANTHROPIC_API_KEY` in the shell it
writes Claude-authored notes for all 13 locales (model `claude-opus-5`,
override `STORE_NOTES_MODEL`); without it, plain English fallback.

Screenshots, end to end:
1. Capture: `APP_ID=<bundle-id> SIMULATOR_UDID=<udid> yarn workspace
   @suuudokuuu/app-tests screenshots:capture --locales=en --scenes=...`
   (add `DEVICE_CLASS=ipad ORIENTATION=landscape` for iPad landscape; the
   runner recycles the XCUITest driver, retries failures once, and bakes
   landscape pixels to 2752x2064 without EXIF).
2. Compose: `bash packages/app/fastlane/screenshots/design/compose-screenshots.sh en-US`
   - frames captures in real fastlane frameit device frames, applies
   two-tier captions, writes the final set.
3. Review visually (downscale with sips and look), commit the final set.
4. Upload: dispatch "Build and Publish to Stores" with the screenshots
   checkbox, or run the fastlane lanes locally.

## Design system (user-approved decisions - do not regress)

- Two-tier captions: dominant Inter Black headline + smaller descriptor at
  ~0.75 opacity; copy lives in `title.strings`/`subtitle.strings`.
- Flat near-flat background (#F7F7F7->#F1F1F1). No gradients - they fight
  the minimalist black/white/red brand.
- No accent underline/flag bar - was tried, user rejected as not premium.
  Uniform #0A0A0A text; typography carries hierarchy.
- Real frameit frames (Apple iPhone 17 Black is a pixel-perfect 1206x2622
  cutout; iPad uses the 12.9" 4th-gen frame scaled 0.7%). Soft drop shadow.
- Tight caption-device gap (1.6% canvas height), text within 90% width.
- Two alternating layouts (text-top / device-top); the challenge pair
  (accept + live) intentionally shares one layout to read as a story.
- Output dims must EXACTLY match capture dims - deliver assigns App Store
  slots by resolution.
- Set curation (user decisions): NO win/confetti shot; hero = airy
  fresh Nightmare board with pencil marks (not a nearly-solved board);
  challenge = two-shot story with anticheat + technique + live wording;
  themes + languages merged into one two-device combo (EN editor + UK
  themes); replay uses the redesigned screen; one closing dark shot.

## Environment gotchas (hard-won, verified)

- Metro file watching is broken in t3 worktrees: after ANY app-source edit,
  kill the port-8081 process and cold-start Metro, or the app serves stale
  code. Fast Refresh never fires.
- The DerivedData "Debug" prebuild app has EAS Updates enabled and silently
  runs the PUBLISHED bundle instead of Metro. Build a real dev client with
  `yarn ios` for local iteration; connect via
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
  (reproducible after sim erase; suspected hidden hardware-keyboard
  listener in-app). Known open issue.
- Final iPhone 6.9" store slot (1320x2868) needs an iPhone 17 Pro Max
  simulator; the current committed set is 1206x2622 (iPhone 17 = 6.3" slot).

## Current state / open items

- en-US framed set committed (7 iPhone + 5 iPad). Other 12 locales: raw
  captures possible via the same pipeline; captions exist for 11 iOS
  locales in design/<locale>/title.strings (subtitles en-US only so far).
- Android/Play screenshots not captured yet (needs an emulator; supply
  expects metadata/android/<locale>/images/phoneScreenshots/).
- 6.9" iPhone recapture pending (Pro Max sim).
- App Preview video (886x1920 H.264 15-30s) not produced; GIFs are not
  accepted by either store.
