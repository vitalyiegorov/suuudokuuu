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

`read-grid-glyphs.util.ts` owns steps 1 to 4, `extract-cell-glyph.util.ts` step 5, and `recognize-grid.util.ts` step 6.

1. Box-average the image down to a 640 px longest side and convert it to luma.
2. Threshold it with integral-image local means (`adaptive-threshold.util.ts`) and label the ink (`label-components.util.ts`), once as is and once after a small dilation that bridges the gaps between separately drawn boxes. The three largest grid-sized components become candidates, with corners at the extremes of `x + y` and `x - y`.
3. Warp each candidate to 450 px through a 4-point homography (`solve-homography.util.ts`), flip it to dark ink on a light board by the heavier intensity tail around the median, and threshold it again.
4. Reject candidates whose inner box lines do not stand out from the cell centers in both directions, and keep the candidate whose ten line positions stand out most. The search repeats on the inverted image only when nothing qualifies.
5. Crop each cell, erase rows and columns that are mostly ink near the cell edge, keep the central components, treat too little ink as empty, and sample the rest into a 28x28 glyph scaled to a 20 px box.
6. Run the 784-96-9 ReLU MLP over the int8 weights in `constants/digit-classifier-weights.constant.ts` and return the best digit, its softmax probability, and the runner-up.

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

`test/fixtures/manifest.txt` lists every fixture with its expected 81-character puzzle string, or `none` for images without a grid. The Vitest gate requires at least 98% correct cells and at least 80% exactly recognized grids.

- `app-*.jpg`: real screenshots of the web export in every preset theme, light and dark. Serve `packages/app/dist` on port 4173 (see `tests/web-tests/AGENTS.md`) and run `pnpm capture:fixtures`, which reads the expected puzzle from the board cells.
- `printed-photo-*.jpg`, `screen-photo-*.jpg`, `no-grid-*.jpg`: seeded synthetic photos from `pnpm render:fixtures`, using held-out fonts only. Screen photos re-photograph the light app screenshots.
- Keep each fixture a JPEG of at most 800 px and under 150 KB. Real phone photos of printed puzzles belong here too; never add copyrighted images.
