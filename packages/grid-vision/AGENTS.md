# Grid Vision Package

Pure TypeScript recognition of a printed or on-screen sudoku from an RGBA image. `recognizeGrid` finds the grid, rectifies it, and classifies every cell, so the same code runs on Hermes (including a worklet runtime), on the web, and under Node tests.

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

1. `to-grayscale.util.ts` box-averages the image down to a 640 px longest side and converts it to luma.
2. `adaptive-threshold.util.ts` marks ink with integral-image local means.
3. `find-grid-corners.util.ts` proposes grid corners as the extremes of `x + y` and `x - y` over the largest group of similar, square, enclosed background holes (the cells), and over the largest connected ink components, with and without a small dilation that bridges the gaps between separately drawn boxes.
4. `read-grid-glyphs.util.ts` solves a 4-point homography per candidate, warps it to 450 px, flips the board to dark-on-light by the heavier intensity tail around the median, rejects candidates without both inner box lines in both directions or with mostly ink, and keeps the candidate whose ten line positions stand out most from the cell centers. The whole search repeats on the inverted image only when nothing qualifies.
5. `extract-cell-glyph.util.ts` crops each cell, erases rows and columns that are mostly ink near the cell edge, keeps the central components, rejects too little ink as empty, and samples the result into a 28x28 glyph scaled to a 20 px box.
6. `classify-glyph.util.ts` runs the 784-96-9 ReLU MLP over int8 weights from `constants/digit-classifier-weights.constant.ts` and returns the best digit, its softmax probability, and the runner-up.

## Runtime Rules

1. `src/` uses no DOM, Node, WASM, or native APIs: typed arrays and plain math only, within the root TypeScript `lib`.
2. Keep the public API to `recognizeGrid`, `GridRecognitionKindEnum`, and the input and result types.
3. Glyph extraction is shared by recognition and training. Any change to thresholds, cropping, or glyph sampling requires retraining with `pnpm train` and committing the regenerated weights module.

## Training

`pnpm train` renders synthetic photos with `scripts/shared/render-synthetic-photo.ts` (system fonts under `/usr/share/fonts` plus Inter from `@expo-google-fonts/inter`, without hairline and black weights, lined and app-style boxed grids, per-digit scale, offset, rotation within 8 degrees, stroke weight, perspective, lighting, noise, blur, and JPEG artifacts), pushes every photo through `readGridGlyphs`, and trains the MLP with plain SGD. Every fifth font is held out for evaluation. It prints held-out accuracy before and after int8 quantization and rewrites the weights module. The font set depends on the machine, so record the printed accuracy in the PR when the weights change.

## Fixtures

`test/fixtures/manifest.txt` lists every fixture with its expected 81-character puzzle string, or `none` for images without a grid. The Vitest gate requires at least 98% correct cells and at least 80% exactly recognized grids.

- `app-*.jpg`: real screenshots of the web export in every preset theme, light and dark. Serve `packages/app/dist` on port 4173 (see `tests/web-tests/AGENTS.md`) and run `pnpm capture:fixtures`, which reads the expected puzzle from the board cells.
- `printed-photo-*.jpg`, `screen-photo-*.jpg`, `no-grid-*.jpg`: seeded synthetic photos from `pnpm render:fixtures`, using held-out fonts only. Screen photos re-photograph the light app screenshots.
- Keep each fixture a JPEG of at most 800 px and under 150 KB. Real phone photos of printed puzzles belong here too; never add copyrighted images.
