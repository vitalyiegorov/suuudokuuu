# Store listing experiments plan

Plan for #478: Apple Product Page Optimization (PPO) and Google Play store listing experiments. **Apple draft created; treatment configuration incomplete and not running. Google Play queued.** Console evidence is required before recording a launch date. Variants follow the user-approved [store-media design](../.agents/skills/store-media/SKILL.md); custom pages are covered in [store-custom-pages.md](store-custom-pages.md).

## Current prerequisites

As of 2026-10-11, #469 is closed and its screenshots merged through #502 at `397d9564`. Authenticated App Store Connect shows live version 2.12.1 and editable version 2.23.1. The live screenshot baseline remains unverified; a merged screenshot set is not proof of what users see. The approved 12 headers and 12 search-results assets are uploaded to Apple's Asset Library; placement and review are pending. The Apple draft still inherits unchanged assets; no distinct first-frame treatment has been configured. Google Play access remains unauthenticated.

## Store limits

Verified 2026-10-11 against [Apple PPO](https://developer.apple.com/app-store/product-page-optimization/) and the current [Play experiments guide](https://support.google.com/googleplay/android-developer/answer/12053285?hl=en). The previous Google help URL (`6227309`) is obsolete.

|             | Apple PPO                                                          | Google Play                                                               |
| ----------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Variants    | Up to 3 treatments plus the original                               | Up to 2 variants plus the current listing                                 |
| Concurrency | One test at a time                                                 | One default-graphics experiment, or up to 5 localized experiments         |
| Testable    | App icon, screenshots, app previews, header, search-results assets | Icon, feature graphic, screenshots; descriptions in localized experiments |
| Length      | Up to 90 days                                                      | Automatically stops after 6 months                                        |
| Confidence  | Better/worse labels at 90% or higher                               | Selectable confidence level                                               |

Header and search-results testing is **confirmed supported for this app**: the authenticated treatment editor exposed both Header and Search Results tabs with Browse Assets and Upload controls on 2026-10-11. This matches Apple's [treatment configuration guide](https://developer.apple.com/help/app-store-connect/create-product-page-optimization-tests/configure-test-treatments), although the primary PPO page still lists only icons, screenshots, and previews. Neither placement has a configured treatment yet.

## Rules for every test

- Change one asset per test. For test 1, change only frame 1, including its composition and caption. Freeze every other screenshot, icon, preview, description, and creative asset.
- Apple primary metric: the Console's estimated PPO conversion rate. Apple's [metric definition](https://developer.apple.com/help/app-store-connect-analytics/reference/metrics-definitions) is total downloads plus pre-orders divided by unique device impressions; use the experiment estimate, not a product-page-view denominator. Its [PPO results guide](https://developer.apple.com/help/app-store-connect-analytics/acquisition/product-page-optimization) distinguishes relative lift from conversion rate.
- Play primary metric: **Unique user install clicks**. Open clicks and pre-registration clicks are other available target metrics; do not substitute a retained-installer metric.
- Start with en-US localization. This does not mean US-only geographic targeting. Record the actual eligible language audience and any Console geographic controls separately. A Play default-graphics experiment excludes languages with localized graphics; use an en-US localized experiment if that better matches the verified listing configuration.
- Apple and Play may run independently. Roll a winner into other locales only after recomposing their approved captions and verifying each listing.
- Review retention separately where available; do not claim experiment-level retention attribution without supporting data.

## Duration, traffic and stop rules

- Use one treatment/variant with **50% treatment traffic and 50% live control** on each store. Confirm the Console allocation before launch.
- Record the hypothesis, chosen improvement/MDE, confidence, sample estimate, estimated duration, and planned stop rule before starting. Console estimates are planning inputs, not guaranteed completion dates.
- Run at least 14 days to cover two weekly cycles. After that, Apple requires a Performing Better label at 90% or higher before applying a winner; Play requires its selected-metric result and confidence interval to support the decision at the recorded confidence and MDE.
- At the 90-day Apple cap or six-month Play cap, keep the control if there is no supported winner. Record **inconclusive**, or **draw** only if the Console declares a draw; insufficient evidence does not prove no difference.
- If the estimate exceeds the platform cap, leave the test queued and revise the single-asset contrast or eligible audience before launch.
- Freeze the listing during the test. Record and invalidate a comparison affected by an asset, copy, or app-version change rather than treating the interrupted result as a winner.
- Report relative lift as `(variant rate / control rate - 1) × 100`; report percentage-point change as `variant rate - control rate`. A move from 20% to 22% is +10% relative lift and +2 percentage points.

## Test backlog

| #   | Test                                          | Variable                                     | Hypothesis                                                                       | Status                                                                                    |
| --- | --------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | First screenshot                              | Frame 1 composition and caption              | The #469 first frame improves acquisition compared with the previous first frame | Apple draft created: baseline and treatment incomplete; estimate exceeds cap. Play queued |
| 2   | Header / search-results; Play feature graphic | One creative placement per test              | Clearer value messaging improves acquisition                                     | Queued: Apple editor support confirmed; headers/search uploaded; Play upload pending      |
| 3   | Icon                                          | App icon                                     | A higher-contrast icon improves acquisition                                      | Queued: no alternate icon selected                                                        |
| 4   | Description                                   | Opening paragraph, Play localized experiment | A benefit-led opening improves acquisition                                       | Queued: no variant selected                                                               |

### Test 1 launch checklist

1. Inspect the authenticated store listings and public pages. Record live app version, listing language, screenshot order, device slots, appearance, date, and evidence links. Confirm Apple distribution eligibility and Play experiment eligibility. Inspect existing experiments to avoid conflicting traffic.
2. Freeze the **entire live control set**, with filenames and SHA-256 hashes. Keep iPad/tablet sets and all other assets unchanged. Do not infer the baseline from the deployed-variant file or the merged commit.
3. Select two distinct first frames. If the live control still predates #469, use the #469 first frame as treatment. If #469 is already live, keep it as control and use the prior first frame from Git before `397d9564` as the treatment; record that the comparison direction is reversed. The archived iPhone source is `397d9564^:packages/app/fastlane/screenshots/variants/dark/ios/en-US/01_iphone_hero-board.png` (use the matching light path only if the live set is light). Verify appearance, dimensions, and bytes against the live control. Do not assume this iOS archive supplies a valid Play frame; locate and validate the matching Play source separately or leave Play queued. Never configure identical control and treatment.
4. Build each treatment from the frozen live set, replacing **only frame 1**. #502 also changed later screenshots; uploading its entire gallery would confound this test. Preserve the approved design, ordering, slot coverage, and frames 2 onward byte-for-byte.
5. In Apple PPO, choose one treatment, en-US localization, and 50% treatment traffic. Enter the desired improvement in [Estimate Your Test Duration](https://developer.apple.com/help/app-store-connect/create-product-page-optimization-tests/create-a-test); record required impressions and duration. Upload only the changed iPhone first frame and inspect the complete treatment preview. Leave iPad unchanged. Complete required review before starting, following [Run a test](https://developer.apple.com/help/app-store-connect/create-product-page-optimization-tests/run-a-test).
6. In Play Console, select the verified listing and experiment type, one variant, 50% experimental audience, and Unique user install clicks. Record the displayed MDE, confidence, expected acquisitions, and duration; inspect all variant screenshots before saving and submitting for review.
7. Complete the setup record below with Console evidence. Start only when the distinct assets, eligibility, review, estimates, and unchanged remainder are verified. Change status to Running and enter the actual start time only after a fresh Console view confirms it.

## Setup record

Authenticated Apple evidence was recorded on 2026-10-11. Draft **First screenshot — core loop — en-US** is created with one treatment, en-US only, and 50% treatment traffic. Assets remain inherited and unchanged, so the treatment is not ready. **Do not start:** the estimate below exceeds the 90-day cap. Google remains queued without authenticated Console access.

Unfilled cells are deliberately unverified, not default settings or scheduled dates.

| Field                                           | Apple                                                                                                                                                                          | Google Play                |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| Status                                          | Draft created; configuration incomplete; not running                                                                                                                           | Queued; unauthenticated    |
| Console test ID / evidence                      | [fd4613c9-42e1-4ff0-8b39-3d8f3d629b80](https://appstoreconnect.apple.com/apps/6449440933/distribution/optimization/fd4613c9-42e1-4ff0-8b39-3d8f3d629b80), inspected 2026-10-11 |                            |
| Live version / listing evidence                 | Live 2.12.1; editable 2.23.1; screenshot baseline unverified                                                                                                                   |                            |
| Eligible localization / geography               | en-US selected; no US-only geographic targeting established                                                                                                                    |                            |
| Control and treatment sources / hashes          | Inherited unchanged assets; distinct treatment and hashes pending                                                                                                              |                            |
| Hypothesis direction (new vs prior or reversed) |                                                                                                                                                                                |                            |
| Confirmed control / treatment allocation        | 50% / 50%; one treatment                                                                                                                                                       |                            |
| Target metric                                   | Estimated PPO conversion rate                                                                                                                                                  | Unique user install clicks |
| Desired improvement / MDE (value and unit)      | 10% desired relative conversion improvement                                                                                                                                    |                            |
| Selected confidence                             | Estimate at 90%                                                                                                                                                                |                            |
| Required sample (metric and count)              | 314,796 impressions; last-week estimate inputs: 438 impressions, 2.28% conversion                                                                                              |                            |
| Estimated duration / estimate date              | 719 weeks, 2026-10-11; exceeds 90-day cap                                                                                                                                      |                            |
| Review / readiness evidence                     | Not ready: unchanged treatment; estimate exceeds cap; review pending configuration                                                                                             |                            |
| Actual start / planned earliest decision / cap  | Not started; no launch date; 90-day cap                                                                                                                                        |                            |

## Results log

Copy the Console's metric names and units. Keep store results separate; do not combine unlike denominators. Attach result evidence and record sample counts, uncertainty, and any interruptions with the decision.

| Test               | Store       | Locale / audience | Actual start | End | Control metric / sample | Variant metric / sample | Relative lift | Percentage-point change | Confidence / interval | Decision / evidence |
| ------------------ | ----------- | ----------------- | ------------ | --- | ----------------------- | ----------------------- | ------------- | ----------------------- | --------------------- | ------------------- |
| 1 First screenshot | Apple       | Unverified        |              |     |                         |                         |               |                         |                       |                     |
| 1 First screenshot | Google Play | Unverified        |              |     |                         |                         |               |                         |                       |                     |
