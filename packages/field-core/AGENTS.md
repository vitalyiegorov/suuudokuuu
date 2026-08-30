# Field Core Package

Headless, framework-agnostic sudoku field engine. Owns every piece of interactive field state that used to be split across the `Sudoku` instance, the app Redux game slice, and screen-local selection. Consumed by the React Native app, by `field-dom`, and by the landing technique embeds. Dependency chain stays acyclic: `field-core → techniques → generator`.

## Commands

```bash
yarn build              # Build ESM + CommonJS
yarn build:esm         # TypeScript -> ESM /dist/esm
yarn build:cjs         # TypeScript -> CommonJS /dist/cjs
yarn lint              # ESLint fix
yarn test              # Jest tests
yarn test:coverage     # With coverage report
yarn ts                # TypeScript check
```

## Ownership Boundary

The engine owns interactive field state:

- The `Sudoku` instance as the grid of record, plus selection and cell navigation.
- Candidates/notes keyed by `` `${y}-${x}` ``, input mode (`normal` | `candidate`), and the auto-candidates flag.
- Move application and validation, mistake counting, completion detection.
- Undo/redo of user actions (value placements and note edits). Givens are immutable.
- Step-script playback state.

The consuming app owns everything the engine deliberately does not know about:

- Scoring, the timeline event log, challenge/replay payloads, and persistence.
- Haptics, animation, routing, sound, and every rendering decision.
- Lingui text. The engine emits structured narration payloads, never prose.
- Timers and pacing. Script playback is pure state; consumers drive it.

## Structure

```text
src/
├── @generic/
│   ├── classes/typed-event-emitter.ts   # Map-typed on/emit, no `any`
│   ├── types/unsubscribe.type.ts
│   └── utils/                           # getCellKey, cloneFieldCells
├── field-engine/
│   ├── classes/
│   │   ├── field-store.ts               # subscribe/getSnapshot/on + snapshot cache
│   │   ├── field-history.ts             # undo/redo cursor over history entries
│   │   └── field-engine.ts              # Public engine API
│   ├── interfaces/                      # Snapshot, options, serialized state, events
│   ├── types/                           # Input mode, direction, candidates map
│   └── utils/                           # pruneCandidates, getNeighbourCell
├── step-script/
│   ├── enums/step-script-step-kind.enum.ts
│   ├── interfaces/                      # Step union members, narration, state
│   ├── types/step-script-step.type.ts
│   └── utils/                           # findStepScript, techniqueResultToStepScript, buildStepScriptState
└── react/use-field-snapshot.hook.ts     # `@suuudokuuu/field-core/react` subpath
```

## Key Concepts

### Headless store

`FieldEngine` extends `FieldStore`, which implements the `useSyncExternalStore` contract:

```typescript
readonly subscribe: (listener: () => void) => () => void;
readonly getSnapshot: () => FieldSnapshotInterface;
on<K extends keyof FieldEventMapInterface>(event: K, handler: (payload: FieldEventMapInterface[K]) => void): () => void;
```

`subscribe` and `getSnapshot` are bound instance fields so their identity is stable across renders. The snapshot is rebuilt only when state changes, so `getSnapshot()` returns the same reference between mutations — never build a snapshot lazily per call. Mutating methods must end with `this.publish()`.

### Events

`moveApplied`, `mistake`, `completed`. Events exist so the app can drive scoring, the timeline, and haptics without the engine knowing they exist. Do not add engine state for anything an event can report.

### Serialization

`serialize()` returns `SerializedFieldStateInterface`, which is directly accepted by the `FieldEngine` constructor. The grid uses the existing `Sudoku.toString()` format and must never change shape — app persistence, sharing, and replay all depend on it. Engine-only state (candidates, eliminated auto-candidates, input mode, auto-candidates, mistakes) lives beside the grid string, not inside it. Undo history is session-only: it is never serialized, so a rehydrated engine starts with `canUndo` false.

Undo rebuilds the `Sudoku` instance from the stored grid string, so `engine.Sudoku` is not a stable reference. Read the board through the snapshot or re-read `engine.Sudoku` after every mutation.

### StepScript

A technique-agnostic, ordered list of primitive steps: `RevealCandidates`, `StrikeCandidates`, `PlaceValue`. Every step carries a `narration` payload of `{ technique, cells, values, placement? }` — a structured slot the consumer renders into localized text. Never put prose in this package.

`techniqueResultToStepScript` maps a `TechniqueResultInterface` into a script. Placement results map to `[RevealCandidates, PlaceValue]` and elimination results to `[RevealCandidates, StrikeCandidates]`; a placement result that also carries eliminations maps to `[RevealCandidates, StrikeCandidates, PlaceValue]`. The reveal step highlights `patternCells` (the technique's reason cells) but reveals candidates per cell: a placement script reveals the placement value only on the target cell, so a hidden single never paints its digit into cells where it cannot go; an elimination script reveals the pattern values on every pattern cell. `placement` on the narration payload marks placement scripts for consumers that need to phrase them differently. `findStepScript(sudoku, strategies?)` runs `TechniqueManager` and maps its result, accepting a narrowed registry so a technique page can demand one specific technique.

Script playback is engine state: `startStepScript`, `stepScriptNext`, `stepScriptBack`, `stepScriptReset`, `applyStepScript` and `stopStepScript`. Starting a script clears the stale selection so old same-value and area highlights cannot compete with the walkthrough. The running script and its `stepIndex` are published on the snapshot, so every consumer renders the same position without holding a player of its own. `applyStepScript` commits the eliminations first and the placement last, so the placement's `moveApplied` event is the final thing a consumer sees.

`buildStepScriptState(stepScript, stepIndex)` is the one shared fold consumers use to render a script's played prefix: it walks steps `0..stepIndex` into `patternCellKeys`, `targetCellKey`, `revealedCandidates`, `eliminatedCandidates`, and `placedValues` (a `StepScriptStateInterface`). Both `field-dom`'s `FieldBoard` and the app's `Field` call this instead of keeping their own copy of the fold.

## Rules

- Zero runtime dependencies beyond `@rnw-community/shared`, `@suuudokuuu/generator`, and `@suuudokuuu/techniques`.
- React is an optional peer dependency reachable only through the `./react` subpath. Never import `react`, `react-dom`, or `react-native` from the main entry.
- Candidate semantics must stay byte-identical to the app slice they replaced: notes append in input order, a placement clears the placed cell and intersects every blank peer's notes with the recomputed possible values.
- When auto-candidates are enabled, `getCellCandidates` returns the row/column/box-computed set minus `eliminatedCandidates` for that cell; `removeCandidate` records into `eliminatedCandidates` instead of the (unused, in that mode) notes store. This is what lets an applied step script's eliminations actually disappear from the auto-candidate display instead of only clearing the walkthrough overlay.
- The engine never throws for ordinary user input. Wrong values become mistakes, filled cells reject the move with `null`.

## Testing

- Tests colocated with source files (`.spec.ts` suffix), realistic boards through `Sudoku.fromStrings`.
- Step-script mapping is verified against real `TechniqueManager` output, not fixtures — narrow the registry with `createTechniqueStrategies().filter(...)` to reach a specific technique.
- Coverage thresholds: statements 99%, branches 94%, lines 99%, functions 100%.

## Exports

```typescript
export { FieldEngine, StepScriptStepKindEnum, buildStepScriptState, findStepScript, getCellKey };
export type {
    FieldSnapshotInterface,
    FieldMoveResultInterface,
    StepScriptInterface,
    StepScriptStateInterface /* ... */
};
```

`@suuudokuuu/field-core/react` exports `useFieldSnapshot`.
