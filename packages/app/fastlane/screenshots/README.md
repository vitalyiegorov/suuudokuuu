# Store screenshots

`ios/<locale>/` holds the store-ready screenshots that `fastlane ios_screenshots`
uploads. They are committed to the repo on purpose: store media changes rarely,
so it is versioned and reviewed like any other asset instead of being rebuilt on
every release.

`raw/` is the Maestro capture output and is gitignored — it is the intermediate
input for curation, not a deliverable.

## Current set

English only, captured from the flows in `tests/app-tests/flows/screenshots`:

| Prefix | Device | Resolution | App Store slot |
| ------ | ------ | ---------- | -------------- |
| `01`-`08` | iPhone 17 | 1206x2622 | iPhone 6.3" |
| `21`-`28` | iPad Pro 13" landscape | 2752x2064 | iPad 13" |

`deliver` assigns each image to a device slot by its resolution, so iPhone and
iPad screenshots share one locale folder. Filenames sort into upload order, and
the first three carry the most weight in both stores.

## Refreshing them

1. Capture (see `tests/app-tests/flows/screenshots/README.md`). For the iPhone
   6.9" slot (1320x2868) capture on an iPhone 17 Pro Max simulator; the current
   set was captured on an iPhone 17, which fills the 6.3" slot instead.
2. Optionally frame and caption with `fastlane frameit` using
   `screenshots/design/` — this needs ImageMagick (`brew install imagemagick`),
   which is why the committed set is currently unframed.
3. Copy the curated result into `ios/<locale>/` and commit it.
4. Upload by dispatching "Build and Publish to Stores" with
   "Also upload the committed store screenshots" checked, or run
   `fastlane ios_screenshots` locally.

## Gaps

- Only `en-US` is committed. Other locales capture fine; they were not curated
  into the repo yet.
- No Android screenshots yet: `supply` expects them under
  `metadata/android/<locale>/images/phoneScreenshots/`, and no Android emulator
  capture has been run.
