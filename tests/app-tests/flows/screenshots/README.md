# Store screenshot capture

Use `scripts/capture-store-screenshots.ts` for the seeded direct-link scene matrix. Read [the capture guide](../../docs/store-screenshot-capture.md) for device preparation, commands, and verification.

Only `05.win.flow.yaml` and `11.pause.flow.yaml` need Maestro. The runner seeds language and appearance before starting these flows; they preserve the seeded state. Screenshot flows are excluded from the regular suite by its non-recursive glob.

The pinned mobile-ci store-screenshots workflow uses the direct scene manifest in `.github/store-screenshots.config.json`. Its three deep-link scenes do not consume these flow files.
