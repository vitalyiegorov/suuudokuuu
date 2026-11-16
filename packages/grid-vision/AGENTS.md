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

`read-grid-glyphs.util.ts` owns steps 1 to 4 with `find-grid-corners.util.ts` for step 2, `fit-grid-corners.util.ts` for the cut-off fallback and `refine-grid-corners.util.ts` for the line fit of step 4, `extract-cell-glyph.util.ts` step 5, `classify-glyph.util.ts` step 6, `read-cell-ink.util.ts` the ink sampling of step 7, `find-closer-region.util.ts` step 8, and `recognize-grid.util.ts` the rest of steps 6 to 8.

1. Convert the image to luma and box-average a copy down to a 640 px longest side for the grid search.
2. Threshold it with integral-image local means (`adaptive-threshold.util.ts`) and label the ink (`label-components.util.ts`), once as is and once after a small dilation that bridges the gaps between separately drawn boxes. The three largest grid-sized components become candidates, with corners at the extremes of `x + y` and `x - y`.
3. Warp each candidate to 450 px through a 4-point homography (`solve-homography.util.ts`), sampling the full-resolution luma so small boards in tall screenshots keep their stroke shapes. Flip it to dark ink on a light board when the ten grid line positions, in both directions, are brighter than the board median; cell fills such as given, highlighted, or selected cells never decide the polarity. A board drawn as tiles separated by gaps lighter than the tiles while its digits are dark is therefore read with the wrong polarity; no preset theme draws its board that way. Threshold it again.
4. Reject candidates whose inner box lines do not stand out from the cell centers in both directions, and keep the candidate whose ten line positions stand out most. The search repeats on the inverted image only when nothing qualifies.
    - When both still find nothing, the board is assumed to be cut off by its surroundings (a screenshot whose card or scroll edge hides part of a row, so the frame fuses with the page around it). The fallback drops ink thicker than a line (`keep-thin-ink.util.ts`) before labeling, then fits the line grid inside each warped candidate: per third of the board it finds the offset and pitch whose ten lines collect the most long ink runs, box lines counting double, and refines them by least squares over the inner lines only, because the outer ones are the unreliable ones. The fitted corners may lie outside the image; ink outside the candidate's bounding box is cleared.
    - A board found by the ordinary search is then fitted to its own lines, because corners taken from the extremes of an ink component drift when the frame touches a photo edge or a rounded card. Per third of the board, every line is sighted within 12 px of where it should be: inner lines by the centroid of their long ink runs, the frame by its outer edge. A projective transform is fitted to all sightings by least squares, sightings more than 2.5 px off the first fit are dropped, and the fit is used only when each direction keeps eight sightings on three lines and no corner moves more than 12 px.
5. Crop each cell, erase rows and columns that are mostly ink near the cell edge, keep the central components and treat too little ink as empty. The glyph is sampled from the warped gray board, not from the ink mask: darkness is scaled between the cell's median level and the darkest tenth of the glyph's own pixels, limited to 2 px around the glyph, and resampled into 28x28 with the glyph scaled to a 20 px box. A binarized glyph closes the holes of 6, 8 and 9 on a blurred photo; the gray one keeps them. A cell whose tallest stroke (pieces closer than 3 px count as one stroke) is under 60% of the board's digit height (the 90th percentile of stroke heights, so a board with more pencil-mark cells than digits still measures a digit) holds pencil marks and is read as empty.
6. Run the convolutional classifier over the int8 weights in `constants/digit-classifier-weights.constant.ts` and return, per cell, the nine digit probabilities (softmax at the temperature fitted on held-out glyphs), the best digit and its probability. The same module lists the layers, so the weights and the network always match; a dense layer is a convolution whose kernel covers its whole input.
7. Split player entries from printed clues by ink. For luma and for chroma, the filled cells are cut into the two classes that maximise the spread between them; the cut counts only when the class means differ by the minimum difference and by four pooled standard deviations, and the lighter or more colored class is the entries. A median plus a fixed offset fails as soon as entries outnumber clues, which a half-solved board does. Ink is sampled from the original RGBA at retained ink pixels through the winning homography, on the stroke core (the inkiest half of those pixels), and a cell's chroma is reduced by how much its background chroma exceeds the board's median background chroma, so a highlighted or selected cell does not turn its clue into an entry while ink on evenly tinted paper keeps its color. No flags below three filled cells.
8. Report `closerRegion`, the board's bounding box with a 12% margin as fractions of the image, when the board is smaller than 540 px and the caller's `sourceScale` says the original holds at least 15% more detail. The caller crops that region from the original and recognizes it again, so a board that is small in a tall screenshot is read at the resolution of the source instead of the thumbnail.

## Runtime Rules

1. `src/` uses no DOM, Node, WASM, or native APIs: typed arrays and plain math only, within the root TypeScript `lib`.
2. Keep the public API to `recognizeGrid`, `GridRecognitionKindEnum`, and the input and result types.
3. The classifier weights decode once when `classify-glyph.util.ts` is evaluated. To run recognition on a worklet runtime, add `@suuudokuuu/grid-vision` to `importForwarding.moduleNames` in `packages/app/babel.config.js` the way `@suuudokuuu/puzzle-forge` is, so the module evaluates inside that runtime. The RGBA buffer crosses runtimes as a cloned typed array. Neither has been verified on a device yet.
4. Glyph extraction is shared by recognition and training. Any change to thresholds, cropping, or glyph sampling requires `pnpm train` and committing the regenerated weights module.

## Training

1. `pnpm train` registers every font under `/usr/share/fonts` whose file name matches the allowlist in `scripts/shared/register-digit-fonts.ts`, plus Inter from `@expo-google-fonts/inter`, skipping hairline and black weights. Every fifth font is held out.
2. Three kinds of seeded images are read, all with training fonts: 1,500 photos from `scripts/shared/render-synthetic-photo.ts` (lined and app-style boxed grids with per-digit scale, offset, rotation within 8 degrees and stroke weight, then perspective, lighting, noise, blur, background clutter and JPEG artifacts), 700 of the same grids left flat and rescaled between 0.7 and 1.6 like a screenshot, and 240 phone screenshots from `scripts/shared/render-phone-screenshot.ts` (a photographed light board with colored player entries, highlighted cells and pencil marks inside a dark page), each read once as the overview and once through its closer region.
3. Every image goes through `readGridGlyphs`. Reads whose empty cells do not line up with the puzzle are dropped as misaligned.
4. Every glyph is shifted by up to 1.6 px, rescaled by up to 12% and given a gamma between 0.7 and 1.4 each time it is shown.
5. The network in `LAYERS` (two strided convolutions and two dense layers) trains with plain SGD for 14 epochs. The script prints held-out accuracy per epoch, quantizes to int8, fits the softmax temperature that minimises held-out loss, and rewrites the weights module with the layer list, the temperature and the weights.

Training and `pnpm render:fixtures` both read the fonts installed on the machine, so the weights and the synthetic fixtures are machine-specific. Record the printed accuracy in the PR whenever the weights change, and regenerate fixtures only together with the manifest.

## Fixtures

`test/fixtures/manifest.txt` lists every fixture with its expected 81-character puzzle string, or `none` for images without a grid. An optional third field is an 81-character handwriting mask (`h` for handwritten, `.` otherwise); handwritten digits remain in the expected puzzle. The Vitest gate requires at least 99.5% correct cells and at least 90% exactly recognized grids on the fixtures as committed. `recognize-grid-stability.test.ts` reads every fixture again after a shift, a rescale to 90% and to 80%, and a JPEG recompression: every app screenshot must still read exactly, and the photographed fixtures must keep 99.5% of their cells and 85% exact grids. A single read is not evidence; a change that only holds on the committed pixels fails here.

- `app-ios-pencil-marks-dark.jpg`: a real iOS screenshot of a dark board with shaded given cells, highlighted row, column and box, green selection cells, and pencil marks; it must read exactly, and the handwriting gate above already forbids flags on it.
- `app-*-390.jpg`, `app-classic-dark-800.jpg`: real screenshots of the web export in every preset theme, light and dark. Serve `packages/app/dist` on port 4173 (see `tests/web-tests/AGENTS.md`) and run `pnpm capture:fixtures`, which reads the expected puzzle from the board cells.
- `handwritten-photo-*.jpg`: six seeded photos with blue pen and pencil-grey entries; require at least 95% filled-cell mask accuracy and zero flags on all other fixtures.
- `printed-photo-*.jpg`, `screen-photo-*.jpg`, `no-grid-*.jpg`: seeded synthetic photos from `pnpm render:fixtures`, using held-out fonts only. Screen photos re-photograph the light app screenshots.
- `recognize-phone-screenshot.test.ts` has no fixture file, because the case needs the full-size source: it renders four seeded 1320x2868 phone screenshots of a photographed light board (player entries in the majority, highlighted cells, pencil marks) and reads each through the overview and its closer region with smooth and aliased resizing at two JPEG qualities. Every digit must match, no clue may be flagged as an entry, and at most two entries may be missed (an entry on the selected cell reads as a clue).
- Keep each fixture a JPEG of at most 800 px and under 150 KB. Real phone photos of printed puzzles belong here too; never add copyrighted images.
