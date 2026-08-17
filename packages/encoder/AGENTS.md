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
├── @generic/
│   ├── constants/               # binary-codec, bit-encoding, base64url, grid, timeline-event-codes
│   ├── enums/                   # SharedPayloadKindEnum, TimelineEventKindEnum
│   ├── interfaces/              # DecodedGameStateInterface, TimelineEventInterface, ...
│   └── utils/                   # givens, varint, aggregate-trailer, metadata-trailer, handoff-extras, timeline-event-stream codecs
├── game-state-binary-codec/     # v2 tuple codec (legacy) and v3 codec (current) feature
│   └── classes/
├── game-state-serializer/       # Public encode/decode API, dispatches by prefix and version nibble
│   └── classes/
├── solution/                    # Timed solution-step encoding feature
│   └── classes/
└── sudoku-string-encoder/       # 81-cell clue encoding feature
    └── classes/
```

## Binary Format Rules

1. Treat bit widths in `@generic/constants/binary-codec.constant.ts` and `@generic/constants/bit-encoding.constant.ts` as format contracts.
2. Treat grid constants in `@generic/constants/grid.constant.ts` as app and generator contracts.
3. Preserve backward compatibility for shared URLs unless the change includes an explicit migration story.
4. Emit new shareable game-state payloads with `GameStateSerializer.encodeState`, which always writes the `_`-prefixed v3 format.
5. Keep the legacy v2 tuple codec (`GameStateSerializer.encode`/`decode`, `GameStateBinaryCodec`) and the pre-binary LZ-string colon-segmented decode path working for old shared links.
6. Use `@thi.ng/bitstream` for bit packing and unpacking. Do not replace binary logic with ad hoc string slicing.
7. Validate cell indexes and values at decode boundaries with the existing utility functions.
8. Be deliberate about failure behavior: structural decode errors (bad version, unknown payload kind, unknown timeline event subcode, out-of-range positions, invalid base64url) throw. Trailers are the one exception — the aggregate trailer silently degrades to `{ pencilCount: null, screenshotCount: null }` and the metadata trailer to `{ rating: 0, isRatingCeiling: false, difficulty: null }` on missing, truncated, or version-mismatched trailer bits instead of throwing. Preserve that split unless callers and tests change together.

## Codec Versioning And Dispatch

`GameStateSerializer.decodeState` is the entry point for the current interface-based format:

- If the string starts with the `_` prefix, decode the body from base64url and read its first byte's top 4 bits (`CODEC_VERSION_BITS`) as the version nibble.
- Version `3` (`CODEC_VERSION_V3`) dispatches to `GameStateBinaryCodecV3.decode`, which returns `DecodedGameStateInterface`.
- Any other version falls back to the legacy tuple decode path (`decode`), which itself checks the `_` prefix for the v2 codec (`CODEC_VERSION = 2`) or falls back further to `lz-string` decompression plus colon-length-prefixed segment parsing for pre-binary shared links. The result is adapted into `DecodedGameStateInterface` via `fromTuple`, with `score`, `candidates`, `anchorSeconds`, `pencilCount`, `screenshotCount`, and `difficulty` defaulted.
- `encodeState`/`decodeState` operate on `EncodableGameStateInterface`/`DecodedGameStateInterface`. `encode`/`decode` operate on the legacy `[field, steps, maxMistakes, isChallenge, elapsedTime]` tuple and only ever produce/consume the v2 or pre-binary formats.

## v3 Game-State Format

- Prefix: `_`. Alphabet: base64url characters from `@generic/constants/base64url.constant.ts`.
- Header: 4-bit version (`3`), 2-bit `SharedPayloadKindEnum`, 1-bit has-tag-stream flag, 1-bit challenge-run flag, 8-bit max-mistakes.
- Field: 81-bit givens mask plus base-9 packed values, same scheme as v2 (`givens-codec.util.ts`).
- `SharedPayloadKindEnum`: `Puzzle = 0` writes only the header, field, and metadata trailer — no timeline events, handoff extras, or aggregate trailer, and always decodes with `elapsedTime: 0` and a null aggregate trailer. `Handoff = 1` and `Challenge = 2` both write timeline events and, when both counts are known, the aggregate trailer; only `Handoff` additionally writes handoff extras between the two.
- Timeline events (`timeline-event-stream-codec.util.ts`): 10-bit event count, then — only when the has-tag-stream flag is set — a 1-bit cell/tagged flag per event plus a 4-bit subcode (`kind - 1`) for tagged events. Cell events (`TimelineEventKindEnum.Cell`) reuse the adaptive empty-cell-position and base-9 packed-value scheme from step encoding. `Pencil` and `Mistake` events additionally carry an absolute 7-bit cell index and a 4-bit value (`value - 1`). All other kinds (`InputMode`, `AutoCandidates`, `Away`, `Return`, `Pause`, `Resume`, `Screenshot`) carry only a timestamp. Every event's timestamp is a delta encoded as a small/large varint (6-bit/16-bit); `elapsedTime` is derived on decode as the sum of those deltas, never stored directly.
- Handoff extras (`handoff-extras-codec.util.ts`, `Handoff` kind only): `score` as a 12-bit/24-bit varint, a 7-bit count of non-empty candidate cells followed by an absolute 7-bit cell index and a 9-bit per-value candidate bitmask for each, and — only when the run is a challenge run — a 32-bit `anchorSeconds`.

### Trailers

Trailers are appended in a fixed order after the payload body. Every trailer reader first checks that enough bits remain and then that its version tag matches, so an absent trailer and trailing zero padding both decode as the "unknown" default instead of throwing. Adding or extending a trailer therefore does not need a codec version bump.

1. Aggregate trailer (`aggregate-trailer-codec.util.ts`, `Handoff`/`Challenge` kinds, written only when both `pencilCount` and `screenshotCount` are non-null): 4-bit trailer version (`1`), then `pencilCount` and `screenshotCount` as 8-bit/16-bit varints. Missing, truncated, or version-mismatched trailer bits decode as `{ pencilCount: null, screenshotCount: null }`, so `null` stays distinguishable from a genuine `0` and older/foreign payloads still decode.
2. Metadata trailer (`metadata-trailer-codec.util.ts`, every payload kind, always written by the current encoder): 4-bit trailer version, then a version-specific body. Version `2` is the only version this codec writes: a 7-bit `rating` (rating × 10; `0` means unknown), a 1-bit `isRatingCeiling` flag, and a 3-bit difficulty code. Version `1` is the difficulty-only trailer shipped by app v2.4.0–v2.4.2 and is still read: a 3-bit difficulty code and nothing else, decoding with an unknown rating. Missing, truncated, or version-mismatched trailer bits decode as `{ rating: 0, isRatingCeiling: false, difficulty: null }` and rewind the stream instead of throwing.
3. Technique trailer (`technique-trailer-codec.util.ts`, written only when the caller supplies `techniques` and the payload holds at least one `Cell` event): 4-bit trailer version (`1`), then one 6-bit technique code per `Cell` event, in event order. Code `63` (`TECHNIQUE_CODE_UNKNOWN`) means "this move was never classified" and decodes as `null`, which keeps an unclassified move distinguishable from a genuine `Guess` (`0`). Codes `0..62` decode verbatim; `SolutionTechniqueEnum` currently tops out at `31`, so the width leaves room for future members. Missing, truncated, or version-mismatched trailer bits decode as `{ techniques: null }` and rewind the stream.

The technique trailer needs no length field: the `Cell` event count is already known from the decoded timeline, so `readTechniqueTrailer` takes it as a parameter and demands exactly `4 + 6 × cellEventCount` bits before it reads anything. A payload without `Cell` events never carries the trailer, which also removes the only case where a stray version tag could match on padding alone.

Difficulty codes are the zero-based ordinal positions of `DifficultyEnum` in the `generator` package (`0 = Newbie` … `5 = Hell`, `6 = Infinity`), kept as plain numbers here because this package does not depend on `generator`. `DIFFICULTY_CODE_MAX` is `6` and the remaining 3-bit value `7` (`DIFFICULTY_CODE_UNKNOWN`) is the "no difficulty" sentinel written by version 2. `DifficultyEnum` is append-only, so codes `0..5` mean exactly what app v2.4.x wrote them to mean. Reserved codes above `DIFFICULTY_CODE_MAX` decode as `difficulty: null`, which lets callers fall back to their own blank-count inference.

### Shared-Link Compatibility

Three generations of v3 links exist in the wild and all three must keep decoding:

| Link generation      | Bits after the aggregate trailer                                                                   | Decode result                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Pre-v2.4.0           | none (zero padding only)                                                                           | `rating: 0`, `isRatingCeiling: false`, `difficulty: null`             |
| v2.4.0–v2.4.2        | version-`1` difficulty trailer (7 bits)                                                            | difficulty from the 3-bit code, `rating: 0`, `isRatingCeiling: false` |
| Current              | version-`2` metadata trailer (15 bits)                                                             | rating, ceiling flag, and difficulty as written                       |
| Current + techniques | version-`2` metadata trailer plus a version-`1` technique trailer (`15 + 4 + 6 × cellEvents` bits) | the above plus one technique code per cell event                      |

`GameStateBinaryCodecV3.readTrailers` snapshots the stream position before the aggregate read and rewinds to it whenever the aggregate read reports unknown counts, because `readAggregateTrailer` consumes its 4-bit version tag before rejecting a foreign tag. The rewind matters because the aggregate trailer's version tag (`1`) shares the same bit position and the same width as the metadata trailer's:

- A v2.4.x link whose producer had no pencil/screenshot counts puts a version-`1` difficulty trailer exactly where the aggregate trailer would start, and `1` collides with `AGGREGATE_TRAILER_VERSION_V1`. It can never be misread as an aggregate trailer, because at that point at most `7 + 7 = 14` bits remain (7 trailer bits plus at most seven zero-padding bits) and `AGGREGATE_TRAILER_MIN_BITS` is `22`, so `readAggregateTrailer` bails on its length guard without consuming anything.
- A current link without an aggregate trailer leaves `15 + 0..7 = 15..22` bits, so the length guard can pass. The version tag then reads `2`, which does not match `AGGREGATE_TRAILER_VERSION_V1`, and the rewind restores the four consumed bits before the metadata trailer is read.

Base64url decoding leaves at most seven trailing zero-padding bits and a zero version tag matches nothing, so padding alone can never be mistaken for a trailer. `game-state-serializer-frozen-payloads.spec.ts` pins byte-for-byte payloads from each shipped generation; do not regenerate those strings.

The technique trailer is the fourth generation and sits after the metadata trailer, which is the only placement that leaves those frozen bytes untouched. Every shipped generation reaches that position with at most seven padding bits, while the smallest technique trailer needs `4 + 6 = 10`, so the length guard rejects all of them before the version tag is read; the frozen spec asserts `techniques: null` for all seven pinned payloads. An older app reading a new link stops after the metadata trailer and ignores the extra bits, so the stream costs old clients nothing but size.

## Legacy v2 Tuple Format

- Prefix: `_`. Header: 4-bit version (`2`), 1-bit challenge flag, 3 reserved bits, 8-bit max-mistakes.
- Field: 81-bit givens mask plus base-9 packed values.
- Challenge steps: adaptive cell indexes, base-9 packed values, and 8-bit timestamp deltas (`GameStateBinaryCodec`).
- Non-challenge shares omit steps; app callers should treat them as puzzle links.
- Pre-binary shares (no `_` prefix) decompress via `lz-string` into colon-length-prefixed segments (`field:steps:maxMistakes:isChallenge`) parsed by `GameStateSerializer`'s legacy segment parser.

## File Organization

1. Classes live one folder per class.
2. Shared interfaces stay in `src/@generic/interfaces` and use the `*Interface` suffix.
3. Shared utilities stay in `src/@generic/utils` and use the `.util.ts` suffix.
4. Shared constants stay in `src/@generic/constants` and use the `.constant.ts` suffix; shared enums stay in `src/@generic/enums`.
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
