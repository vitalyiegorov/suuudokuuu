# Store listing experiments plan

Plan for Apple Product Page Optimization (PPO) and Google Play store listing experiments. It makes no store change: nothing here is configured in App Store Connect or Play Console. Variants are produced with the [store-media skill](../.agents/skills/store-media/SKILL.md); custom pages are covered in [store-custom-pages.md](store-custom-pages.md).

## Store limits

Verified 2026-10-08 against [Apple PPO](https://developer.apple.com/app-store/product-page-optimization/) and [Play experiments](https://support.google.com/googleplay/android-developer/answer/6227309).

|             | Apple PPO                            | Google Play                                                                    |
| ----------- | ------------------------------------ | ------------------------------------------------------------------------------ |
| Variants    | Up to 3 treatments plus the original | Up to 2 variants plus the current listing                                      |
| Concurrency | One test at a time                   | One default-graphics experiment, or up to 5 localized experiments              |
| Testable    | App icon, screenshots, app previews  | Icon, feature graphic, screenshots; descriptions only in localized experiments |
| Length      | Up to 90 days, or stopped manually   | Stops automatically after 6 months                                             |
| Confidence  | Estimate targets at least 90%        | Selectable confidence level                                                    |
| Edits       | A started test cannot be changed     | Not stated on the page (unconfirmed)                                           |

Header and search-results asset in PPO: **unconfirmed, and not listed by Apple.** Apple's PPO page names only icons, screenshots and app previews. The WWDC26 session 205 only says to use PPO "to test different visuals ... whether it's your app's logo, core value or a new feature" and never ties PPO to the header or search-results assets ([session](https://developer.apple.com/videos/play/wwdc2026/205/)). Only third-party ASO summaries claim header support. Treat the header/search-results test as unsupported until PPO in App Store Connect offers those assets as a treatment; check when the Asset Library is live for our app.

## Rules for every test

- One variable per test; record hypothesis, metric and start date in the log before starting.
- Primary metric: conversion rate (Apple App Analytics product page views to downloads; Play store listing visitors to first-time installers). Watch retention as a guardrail, not as a stop rule.
- Run en-US first (default-graphics test on Play, PPO on the US storefront). Roll a winner out to other locales by recomposing with their `design/<locale>/{title,subtitle}.strings`, then confirm in a localized Play experiment where traffic allows.
- Run Apple and Play tests in parallel; they do not interact.

## Duration, traffic and stop rules

- Minimum 14 days (two full weekly cycles) even if a result looks clear early.
- Apple: let the 90-day cap decide for low traffic. Apply a treatment only when App Store Connect declares it better than the original at 90% or more. If no treatment is declared by day 90, record "no difference" and keep the original.
- Play: stop when the Console reports a clear winner at the chosen confidence, or at 6 months with no winner. Keep the default confidence unless a decision needs a stricter one.
- Sample size: the store's own estimate is authoritative. If the estimated duration exceeds the cap, test a bigger change instead of a subtle one; do not stack variables.
- Never edit assets, copy or the app version's listing mid-test.

## Test backlog

| #   | Test                          | Variable                                           | Hypothesis                                                                   | Status                                                                                   |
| --- | ----------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | First screenshot              | Frame 1 composition and caption                    | The new core-loop first frame from #469 converts better than the current one | Scheduled after #469 ships                                                               |
| 2   | Header / search-results asset | Creative asset                                     | A clearer value proposition raises search conversion                         | Blocked: PPO support unconfirmed; Play runs the feature graphic (#472) as its equivalent |
| 3   | Icon                          | App icon                                           | A higher-contrast icon raises tap-through                                    | Not scheduled                                                                            |
| 4   | Description                   | Opening paragraph (Play localized experiment only) | Benefit-led opening raises installs                                          | Not scheduled; Apple PPO cannot test text                                                |

### Test 1 configuration

Prerequisite: #469 merged, released and live in the stores.

- Control: the live frame 1 from the current default set.
- Variant: the new #469 frame 1 only; frames 2 and later stay identical to control. Same device sizes and dark/light variant as control.
- Apple: one treatment, with the new first screenshot, on the en-US iPhone set (iPad set unchanged).
- Play: default-graphics experiment, one variant, phone screenshots with the new first image.
- Success: conversion rate up at 90% confidence on Apple; Play reports a winner.

## Results log

| Test               | Store       | Locale | Start | End | Control CVR | Variant CVR | Confidence | Decision |
| ------------------ | ----------- | ------ | ----- | --- | ----------- | ----------- | ---------- | -------- |
| 1 First screenshot | Apple       | en-US  |       |     |             |             |            |          |
| 1 First screenshot | Google Play | en-US  |       |     |             |             |            |          |
