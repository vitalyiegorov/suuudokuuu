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
├── game-state-binary-codec/    # v2 and v3 bit-packed game-state codec features
│   └── classes/
├── game-state-serializer/      # Public v3 encode, v3, v2, and legacy decode API feature
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
4. Emit new shareable game-state payloads with the `_`-prefixed v3 base64url format.
5. Keep v2 and legacy LZ-string decode support for older payloads.
6. Use `@thi.ng/bitstream` for bit packing and unpacking. Do not replace binary logic with ad hoc string slicing.
7. Validate cell indexes and values at decode boundaries with the existing utility functions.
8. Be deliberate about failure behavior: some decoders return empty/default state for invalid input, while full game-state decode throws. Preserve that API unless callers and tests change together.

## v3 Game-State Format

Emitted by `GameStateBinaryCodecV3` and selected on decode by the 4-bit version nibble of the first byte.

- Prefix: `_`.
- Alphabet: base64url characters from `constants/base64url.constant.ts`.
- Header: 4-bit version (`3`), 2-bit payload kind, 1-bit tag-stream flag, 1-bit challenge-run flag, and 8-bit max-mistakes value.
- Payload kinds: `Puzzle`, `Handoff`, and `Challenge` from `enums/shared-payload-kind.enum.ts`.
- Field: 81-bit givens mask plus base-9 packed values, with cell timeline events removed from the shared field.
- Timeline events: 10-bit count, optional tag stream, adaptive cell indexes, base-9 packed values, and varint timestamp deltas. `Puzzle` payloads omit the event section entirely.
- Handoff extras: varint score, 7-bit candidate-entry count, per-entry 7-bit cell index and 9-bit candidate mask, plus a 32-bit anchor for challenge runs. Only `Handoff` payloads carry them.

### Trailers

Trailers are optional, appended in a fixed order, and each one is skipped when the producer has no value for it. Every trailer reader first checks that enough bits remain and then that its version tag matches, so an absent trailer and trailing zero padding both decode as the "unknown" default instead of throwing. Adding a trailer therefore does not need a codec version bump.

1. Aggregate trailer: 4-bit version (`1`), varint pencil count, varint screenshot count. Written for non-`Puzzle` payloads only, and only when both counts are known. Absent decodes as `pencilCount: null` and `screenshotCount: null`.
2. Difficulty trailer: 4-bit version (`1`) followed by a 3-bit difficulty code. Written for every payload kind whenever a code in `0..DIFFICULTY_CODE_MAX` is supplied. Absent, unrecognised-version, and reserved codes above `DIFFICULTY_CODE_MAX` all decode as `difficulty: null`, which lets callers fall back to their own inference for pre-trailer payloads.

Base64url decoding leaves at most seven trailing zero-padding bits and a zero version tag never matches, so padding alone can never be mistaken for a trailer.

## v2 Game-State Format

- Prefix: `_`.
- Header: 4-bit version, 1-bit challenge flag, 3 reserved bits, and 8-bit max-mistakes value.
- Field: 81-bit givens mask plus base-9 packed values.
- Challenge steps: adaptive cell indexes, base-9 packed values, and 8-bit timestamp deltas.
- Non-challenge shares omit steps; app callers should treat them as puzzle links.
- Decoded through `GameStateSerializer.fromTuple`, which reports `null` for every field the v2 format cannot carry.

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
