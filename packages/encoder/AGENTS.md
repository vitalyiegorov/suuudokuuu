# Encoder Package

Pure TypeScript package for compact binary encoding and decoding of Sudoku puzzle strings, solution steps, and shareable game-state payloads.

## Commands

```bash
yarn build
yarn build:esm
yarn ts
yarn lint
yarn test
yarn test:coverage
```

## Structure

```text
src/
├── @generic/                   # Shared constants, interfaces, and utilities
├── game-state-binary-codec/    # v2 bit-packed game-state codec feature
│   └── classes/
├── game-state-serializer/      # Public v2 encode, v2 and legacy decode API feature
│   └── classes/
├── solution/                   # Timed solution-step encoding feature
│   └── classes/
└── sudoku-string-encoder/      # 81-cell clue encoding feature
    └── classes/
```

## Binary Format Rules

1. Treat bit widths in `constants/bit-encoding.constant.ts` as format contracts.
2. Treat grid constants in `constants/grid.constant.ts` as app and generator contracts.
3. Preserve backward compatibility for shared URLs unless the change includes an explicit migration story.
4. Emit new shareable game-state payloads with the `_`-prefixed v2 base64url format.
5. Keep legacy LZ-string decode support for payloads that do not use the `_` prefix.
6. Use `@thi.ng/bitstream` for bit packing and unpacking. Do not replace binary logic with ad hoc string slicing.
7. Validate cell indexes and values at decode boundaries with the existing utility functions.
8. Be deliberate about failure behavior: some decoders return empty/default state for invalid input, while full game-state decode throws. Preserve that API unless callers and tests change together.

## v2 Game-State Format

- Prefix: `_`.
- Alphabet: base64url characters from `constants/base64url.constant.ts`.
- Header: 4-bit version, 1-bit challenge flag, 3 reserved bits, and 8-bit max-mistakes value.
- Field: 81-bit givens mask plus base-9 packed values.
- Challenge steps: adaptive cell indexes, base-9 packed values, and 8-bit timestamp deltas.
- Non-challenge shares omit steps; app callers should treat them as puzzle links.

## File Organization

1. Classes live one folder per class.
2. Interfaces stay in `src/interfaces` and use the `*Interface` suffix.
3. Utilities stay in `src/util` and use the `.util.ts` suffix.
4. Constants stay in `src/constants` and use the `.constant.ts` suffix.
5. Re-export public API directly from `src/index.ts`.
6. Tests stay colocated with source files using `.spec.ts`.

## Testing

1. Add round-trip tests for every format change.
2. Cover corrupt, truncated, empty, and boundary-value payloads.
3. Cover timestamp capping when changing solution-step behavior.
4. After encoder changes, run:

```bash
yarn test && yarn ts && yarn lint && yarn build
```

Run the root validation sequence before finishing.
