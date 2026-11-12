# Grid Vision Package

Pure TypeScript recognition of a printed or on-screen sudoku from an RGBA image. `recognizeGrid` finds the grid, rectifies it, and classifies every cell, so the same code runs on Hermes, on the web, and under Node tests.

## Commands

```bash
pnpm build
pnpm ts
pnpm test
pnpm test:coverage
pnpm train
pnpm render:fixtures
pnpm capture:fixtures
```

## Pipeline

`read-grid-glyphs.util.ts` owns steps 1 to 4 with `find-grid-corners.util.ts` for step 2 and `fit-grid-corners.util.ts` for the cut-off fallback of step 4, `extract-cell-glyph.util.ts` step 5, `read-cell-ink.util.ts` the ink color sampling of step 6, and `recognize-grid.util.ts` the rest of step 6.

1. Convert the image to luma and box-average a copy down to a 640 px longest side for the grid search.
2. Threshold it with integral-image local means (`adaptive-threshold.util.ts`) and label the ink (`label-components.util.ts`), once as is and once after a small dilation that bridges the gaps between separately drawn boxes. The three largest grid-sized components become candidates, with corners at the extremes of `x + y` and `x - y`.
3. Warp each candidate to 450 px through a 4-point homography (`solve-homography.util.ts`), sampling the full-resolution luma so small boards in tall screenshots keep their stroke shapes. Flip it to dark ink on a light board when the ten grid line positions, in both directions, are brighter than the board median; cell fills such as given, highlighted, or selected cells never decide the polarity. A board drawn as tiles separated by gaps lighter than the tiles while its digits are dark is therefore read with the wrong polarity; no preset theme draws its board that way. Threshold it again.
4. Reject candidates whose inner box lines do not stand out from the cell centers in both directions, and keep the candidate whose ten line positions stand out most. The search repeats on the inverted image only when nothing qualifies.
    - When both still find nothing, the board is assumed to be cut off by its surroundings (a screenshot whose card or scroll edge hides part of a row, so the frame fuses with the page around it). The fallback drops ink thicker than a line (`keep-thin-ink.util.ts`) before labeling, then fits the line grid inside each warped candidate: per third of the board it finds the offset and pitch whose ten lines collect the most long ink runs, box lines counting double, and refines them by least squares over the inner lines only, because the outer ones are the unreliable ones. The fitted corners may lie outside the image; ink outside the candidate's bounding box is cleared.
5. Crop each cell, erase rows and columns that are mostly ink near the cell edge, keep the central components, treat too little ink as empty, and sample the rest into a 28x28 glyph scaled to a 20 px box. A cell whose tallest stroke (pieces closer than 3 px count as one stroke) is under 60% of the board's digit height (the 90th percentile of stroke heights, so a board with more pencil-mark cells than digits still measures a digit) holds pencil marks and is read as empty.
6. Run the 784-96-9 ReLU MLP over the int8 weights in `constants/digit-classifier-weights.constant.ts` and return the best digit, its softmax probability, the runner-up, and an 81-cell handwriting mask: sample original RGBA at retained ink pixels through the winning homography and compare the luma and chroma of the stroke core (the inkiest half of those pixels) against the filled-cell medians, with the chroma of light ink on a dark board reduced by the cell background's median chroma so a colored cell fill bleeding into white digits through JPEG chroma subsampling is not read as colored ink (no flags below three filled cells).

## Runtime Rules

1. `src/` uses no DOM, Node, WASM, or native APIs: typed arrays and plain math only, within the root TypeScript `lib`.
2. Keep the public API to `recognizeGrid`, `GridRecognitionKindEnum`, and the input and result types.
3. The classifier weights decode once when `recognize-grid.util.ts` is evaluated. To run recognition on a worklet runtime, add `@suuudokuuu/grid-vision` to `importForwarding.moduleNames` in `packages/app/babel.config.js` the way `@suuudokuuu/puzzle-forge` is, so the module evaluates inside that runtime. The RGBA buffer crosses runtimes as a cloned typed array. Neither has been verified on a device yet.
4. Glyph extraction is shared by recognition and training. Any change to thresholds, cropping, or glyph sampling requires `pnpm train` and committing the regenerated weights module.

## Training

1. `pnpm train` registers every font under `/usr/share/fonts` whose file name matches the allowlist in `scripts/shared/register-digit-fonts.ts`, plus Inter from `@expo-google-fonts/inter`, skipping hairline and black weights. Every fifth font is held out.
2. `scripts/shared/render-synthetic-photo.ts` renders 1,500 seeded photos of lined and app-style boxed grids with per-digit scale, offset, rotation within 8 degrees, and stroke weight, then perspective, lighting, noise, blur, background clutter, and JPEG artifacts.
3. Every photo goes through `readGridGlyphs`. Photos whose empty cells do not line up with the puzzle are dropped as misaligned.
4. A 784-96-9 MLP trains with plain SGD for 14 epochs. The script prints held-out accuracy per epoch and after int8 quantization, then rewrites the weights module.

Training and `pnpm render:fixtures` both read the fonts installed on the machine, so the weights and the synthetic fixtures are machine-specific. Record the printed accuracy in the PR whenever the weights change, and regenerate fixtures only together with the manifest.

## Fixtures

`test/fixtures/manifest.txt` lists every fixture with its expected 81-character puzzle string, or `none` for images without a grid. An optional third field is an 81-character handwriting mask (`h` for handwritten, `.` otherwise); handwritten digits remain in the expected puzzle. The Vitest gate requires at least 98% correct cells and at least 80% exactly recognized grids.

- `app-ios-pencil-marks-dark.jpg`: a real iOS screenshot of a dark board with shaded given cells, highlighted row, column and box, green selection cells, and pencil marks; it must read exactly, and the handwriting gate above already forbids flags on it.
- `app-*-390.jpg`, `app-classic-dark-800.jpg`: real screenshots of the web export in every preset theme, light and dark. Serve `packages/app/dist` on port 4173 (see `tests/web-tests/AGENTS.md`) and run `pnpm capture:fixtures`, which reads the expected puzzle from the board cells.
- `handwritten-photo-*.jpg`: six seeded photos with blue pen and pencil-grey entries; require at least 95% filled-cell mask accuracy and zero flags on all other fixtures.
- `printed-photo-*.jpg`, `screen-photo-*.jpg`, `no-grid-*.jpg`: seeded synthetic photos from `pnpm render:fixtures`, using held-out fonts only. Screen photos re-photograph the light app screenshots.
- Keep each fixture a JPEG of at most 800 px and under 150 KB. Real phone photos of printed puzzles belong here too; never add copyrighted images.
