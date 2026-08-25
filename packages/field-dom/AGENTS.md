# Field DOM Package

Lightweight React DOM components that render a `@suuudokuuu/field-core` `FieldEngine`. This is the board the landing embeds and any future web surface uses. No Redux, no react-native, no styling system, no icon library: React plus plain CSS themed through custom properties.

## Commands

```bash
yarn build              # Build ESM + CommonJS + copy the stylesheet
yarn build:esm         # TypeScript -> /dist/esm
yarn build:cjs         # TypeScript -> /dist/cjs
yarn build:styles      # Copy src/styles/field-dom.css -> dist/field-dom.css
yarn lint              # ESLint fix
yarn test              # Jest tests
yarn test:coverage     # With coverage report
yarn ts                # TypeScript check
```

## Ownership Boundary

This package owns markup, cell state vocabulary, keyboard/pointer interaction, and CSS class/data-attribute contracts. It owns no prose, no state, and no timing.

- Engine state is read through `useFieldSnapshot(engine)` from `@suuudokuuu/field-core/react`. Never read `engine.Sudoku`: undo rebuilds it, so the reference is not stable.
- Mutations go through engine methods only (`selectCell`, `moveSelection`, `inputValue`, `toggleInputMode`, `undo`, `redo`, `stepScriptNext`, `stepScriptBack`, `stepScriptReset`, `applyStepScript`).
- All user-visible text comes from the consumer through required `labels` props and a required `narrationRenderer`. The package ships no strings and no i18n dependency, so Lingui stays in the app and the landing keeps its own copy.
- Appearance is owned by CSS. Components only emit `data-*` state attributes; they never compute colors, sizes, or inline styles.

## Structure

```text
src/
├── components/
│   ├── field-board/           # role="grid" 9x9 board, keyboard + pointer input
│   ├── field-cell/            # role="gridcell" button, value or candidates
│   ├── field-cell-candidates/ # 3x3 candidate mini grid
│   ├── field-number-pad/      # digits with remaining counts, mode/undo/redo
│   ├── field-step-player/     # step controls, progress dots, aria-live narration
│   └── field-game/            # composition shell over the four pieces
├── constants/field-grid.constant.ts
├── hooks/use-field-mistake-cell.hook.ts
├── interfaces/                # Label contracts, cell view model, step state
├── styles/field-dom.css       # Single stylesheet, exported as ./styles.css
├── types/
├── utils/                     # Pure view-model and input mapping helpers
└── index.ts
```

## Key Concepts

### Cell view model

`buildFieldCellView(cell, candidates, context)` — an internal helper, fed by `engine.getCellCandidates(cell)` — maps a snapshot cell into `FieldCellViewInterface`. It keeps the landing's static-board vocabulary — `candidates`, `eliminatedCandidates`, `placedValue`, `isPatternCell`, `isTargetCell` — so the prerendered technique tables and the live board describe cells the same way. Interactive state adds `isSelected`, `isHighlighted`, `isSameValue`, `isWrong`, `isGiven`.

`FieldCell` renders every flag as a `data-*` attribute (`data-selected`, `data-highlighted`, `data-same-value`, `data-wrong`, `data-given`, `data-pattern`, `data-target`, plus `data-placed` on the value span). CSS owns what each state looks like.

### Givens

The snapshot carries no given/user distinction, so the consumer supplies `givenCellKeys`. Build it once from the starting puzzle string with `getGivenCellKeys(sudokuString)`. Without it no cell is marked given.

### Step scripts

`@suuudokuuu/field-core`'s `buildStepScriptState(stepScript, stepIndex)` folds steps `0..stepIndex` into pattern cells, revealed candidates, struck candidates, and placed values; `FieldBoard` passes the result as `context.stepState`. `FieldStepPlayer` renders nothing when `snapshot.stepScript` is `null`. Narration is structured, never prose: `narrationRenderer(step)` receives the whole step (kind plus `{ technique, cells, values }`) and returns the consumer's localized node.

### Keyboard model

`FieldBoard` uses a roving tabindex. Only the selected cell (or `0-0` when nothing is selected) is tabbable; the board moves DOM focus after keyboard-driven selection changes and never steals focus on mount or pointer selection.

| Key        | Action                                                           |
| ---------- | ---------------------------------------------------------------- |
| Arrow keys | `engine.moveSelection`                                           |
| `1`–`9`    | `engine.inputValue` (value or note, depending on the input mode) |
| `n` / `N`  | `engine.toggleInputMode`                                         |

`0`, `Backspace`, and `Delete` are deliberately unbound: `FieldEngine` exposes no clear operation, givens and placed values are immutable, and a note is removed by pressing its digit again.

## Rules

- Dependencies stay at `react` (peer), `@suuudokuuu/field-core`, and `@rnw-community/shared`. Bundle discipline is a feature; do not add a styling, icon, or utility library.
- Never import `react-dom`, `react-native`, or any framework router. JSX and React hooks only.
- Every component file starts with `'use client'` so a Next.js App Router consumer can import them from a server component. The entry must not carry the directive: the pure utilities it re-exports have to stay callable during prerender.
- Every interactive element is a real `<button>` and gets its accessible name from the `labels` prop.
- CSS lives in one stylesheet, wrapped in `@layer field-dom` so unlayered consumer rules win. Theme only through `--field-*` custom properties and always ship a default.
- Respect `prefers-reduced-motion`: transitions are disabled under the reduce media query.

## Testing

- Colocated `.spec.ts` files cover the pure view-model and input-mapping utilities. Coverage thresholds: statements 99%, branches 94%, lines 99%, functions 100%.
- Component rendering is not unit tested; there is no jsdom setup in this monorepo. Rendering is covered by the landing E2E specs.

## Exports

```typescript
export { FieldBoard, FieldGame, FieldStepPlayer };
export { getGivenCellKeys };
export type { FieldGameLabelsInterface };
```

`@suuudokuuu/field-dom/styles.css` exports the stylesheet.
