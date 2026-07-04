# CLAUDE.md

Suuudokuuu is an open-source Sudoku game built with React Native/Expo. Monorepo with 3 core packages: app (React Native), generator (puzzle engine), and encoder (binary encoding for sharing).

## Commands

```bash
# Setup
yarn install                              # Always run first

# Build
yarn build                                # Build all packages
yarn build:force                          # Build without cache

# Validation (run in this order before committing)
yarn format                               # Prettier (run first - may modify files)
yarn ts                                   # TypeScript check
yarn lint                                 # ESLint
yarn deadcode                             # Knip dead code detection
yarn cpd                                  # Code duplication check
yarn test                                 # Jest tests

# IMPORTANT: After completing any task, ALWAYS run:
yarn format && yarn ts && yarn lint && yarn deadcode && yarn cpd

# Utilities
yarn deps:check                           # Check dependency versions
yarn deps:dedupe                          # Deduplicate dependencies
```

## Structure

```
packages/
├── app/                # React Native (Expo 54) - main Sudoku game UI
├── generator/          # Sudoku puzzle generation & solving (DLX algorithm)
└── encoder/            # Binary encoding/decoding for puzzle sharing
```

## Critical Rules

1. **No `any` type** - Everything properly typed
2. **No type assertions** - Never use `as Type`, `@ts-ignore`, `@ts-expect-error` (`as const` is allowed — it's a const assertion, not a type assertion)
3. **No comments** - Self-documenting code with clear names
4. **Never disable ESLint without approval** - NEVER add `eslint-disable` comments without explicit user approval
5. **Single const declarations** - Each variable gets its own `const` declaration
6. **Use `emptyFn` for no-op callbacks** - Use `emptyFn` from `@rnw-community/shared` instead of `() => void 0`
7. **No IIFEs** - Use `.catch(handleError)` or `.then(onSuccess, onError)` instead of `void (async () => {})()`
8. **Use `getErrorMessage`** - Use `getErrorMessage(e)` from `@rnw-community/shared` instead of `e instanceof Error ? e.message : String(e)`
9. **One component per folder** - Each component file lives in its own folder
10. **Constants in `/constant` folder** - Constant files go in the module's `constant/` folder, not alongside components. This includes Zod schemas and their inferred types used by forms.
11. **Use `t` macro for string props** - Use `t\`text\`` from `@lingui/react/macro` for string props (like `content={t\`Cancel\`}`), `<Trans>` only for direct JSX text children
12. **No abbreviated variable names** - Use full descriptive names (`category` not `cat`, `transaction` not `tx`, `account` not `acc`)
13. **No complex logic in JSX props** - Extract ternaries/logical operators to variables before JSX
14. **Utility functions in `/utils` folder** - Extract reusable functions to module's `utils/` folder with `.util.ts` suffix
15. **Pick minimal interface properties** - Use `Pick<EntityInterface, 'prop'>` when only specific properties are needed
16. **No redundant wrapper functions** - Don't create functions that only delegate to another function without adding logic. If a lint rule prevents inline callbacks, the wrapper is acceptable
17. **Spread syntax for optional params** - Use `...(isPositiveNumber(x) && { x })` instead of `x: isPositiveNumber(x) ? x : undefined` with eslint-disable
18. **Interfaces in separate files** - Interfaces go in `/interface` folder, not inline in class files
19. **Type guards in separate files** - Type guards go in `/type-guard` folder with `.type-guard.ts` suffix
20. **Group useWatch calls together** - In React components, keep all `useWatch` calls together near other hooks, not scattered throughout the component
21. **One utility per file** - Each utility function should be in its own file with `.util.ts` suffix, don't combine multiple utilities
22. **Re-export from package index** - Don't create intermediate export files, re-export directly from `index.ts`
23. **Class method ordering** - Public methods come before private methods in class definitions

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Interface | `*Interface` suffix | `AccountFilterInterface` |
| Enum | `*Enum` suffix | `AccountTypeEnum` |
| Function | module prefix | `exchangeRatesFetchApi` |
| Class | PascalCase | `AccountRepository` |
| File | kebab-case + type suffix | `account.service.ts` |

### Type Guards and Validation

**Prefer `@rnw-community/shared` type guards over manual checks:**
- `isDefined(x)` instead of `x !== null && x !== undefined` or `x !== null`
- `isNumber(x)` instead of `typeof x === 'number'`
- `isNotEmptyArray(x)` instead of `Array.isArray(x) && x.length > 0`
- `isEmptyArray(x)` instead of `x.length === 0`
- `isNotEmptyString(x)` instead of `typeof x === 'string' && x.length > 0`
- `isPositiveNumber(x)` instead of `typeof x === 'number' && x > 0` or `x > 0`

**Use `isDefined` for ref checks too:**
```typescript
// Good
if (isDefined(timerRef.current)) { clearTimeout(timerRef.current); }

// Bad
if (timerRef.current !== null) { clearTimeout(timerRef.current); }
```

**Prefer `.filter(isDefined)` over manual type guard filters:**
```typescript
// Good
items.map(transform).filter(isDefined)

// Bad
items.map(transform).filter((item): item is ItemType => item !== null)
```

**Only use `.filter(isDefined)` when nulls are possible:**
```typescript
// Good - when transform can return null
items.map(item => item.optionalField).filter(isDefined)

// Bad - unnecessary filter when array type doesn't allow null
const numbers: number[] = [1, 2, 3];
numbers.filter(isDefined)  // Unnecessary, array can't have nulls
```

**Prefer Zod for complex object validation:**
```typescript
// Good - Zod schema
const ItemSchema = z.object({ id: z.number(), name: z.string() });
const result = ItemSchema.safeParse(data);
if (result.success) { /* use result.data */ }

// Bad - manual type guard
const isItem = (x: unknown): x is Item =>
    typeof x === 'object' && x !== null && 'id' in x && typeof x.id === 'number';
```

**Form schemas belong in `/constant` folder:**
```typescript
// Good - schema in constant file
// src/transaction/constant/convert-to-transfer-schema.constant.ts
export const ConvertToTransferSchema = z.object({
    accountId: z.number().positive()
});
export type ConvertToTransferFormValues = z.infer<typeof ConvertToTransferSchema>;

// Then import in component
import { ConvertToTransferFormValues, ConvertToTransferSchema } from '../../constant/convert-to-transfer-schema.constant';

// Bad - schema defined inline in component
const ConvertToTransferSchema = z.object({ accountId: z.number().positive() });
type ConvertToTransferFormValues = z.infer<typeof ConvertToTransferSchema>;
```

For simple null/undefined checks on functions, prefer optional chaining: `callback?.(value)`

**Check object property values, not just object existence:**
```typescript
// Good - check if date range has actual values before using
const hasDateRange = isDefined(filters.date) && (isDefined(filters.date.from) || isDefined(filters.date.to));
if (hasDateRange) {
    conditions.push(this.buildDateCondition(filters.date));
}

// Bad - object exists but may have all null properties
if (isDefined(filters.date)) {
    conditions.push(this.buildDateCondition(filters.date)); // Returns undefined if both from/to are null!
}
```

**Optional params with spread syntax:**
```typescript
// Good - spread syntax (no eslint-disable needed)
const params = {
    type,
    accountId,
    ...(isPositiveNumber(amount) && { amount }),
    ...(isPositiveNumber(categoryId) && { categoryId })
};

// Bad - ternary with undefined requires eslint-disable
const params = {
    type,
    accountId,
    amount: isPositiveNumber(amount) ? amount : undefined, // eslint-disable-line no-undefined
    categoryId: isPositiveNumber(categoryId) ? categoryId : undefined // eslint-disable-line no-undefined
};
```

### i18n (Lingui) Usage

**Use `t` macro for string props, `<Trans>` for JSX text children:**

```typescript
// Good - t macro for string props
<Button content={t`Cancel`} />
<PageHeader title={t`Edit Expense`} />
<Toast text1={t`Conversion failed`} />

// Good - Trans for direct JSX text children
<Text><Trans>Select the destination account</Trans></Text>
<FormSheetHeader><Trans>Convert to Transfer</Trans></FormSheetHeader>

// Bad - Trans for string props (renders ReactNode, not string)
<Button content={<Trans>Cancel</Trans>} />  // Wrong!
```

**Conditional i18n text:**
```typescript
// Good - extract to variable first
const accountLabel = isExpense ? t`Select destination account` : t`Select source account`;
<SimpleHorizontalCell title={accountLabel} />

// Good - conditional Trans in JSX children
<Text>
    {isExpense ? (
        <Trans>Select the destination account for this transfer.</Trans>
    ) : (
        <Trans>Select the source account for this transfer.</Trans>
    )}
</Text>
```

**i18n file structure:**
Both `.po` (source) and `.ts` (compiled) files are required and must be committed:
- `.po` files - source translations, editable by translators
- `.ts` files - compiled messages, generated by `yarn i18n:sync`, required at runtime

After modifying user-facing text, run `yarn i18n:sync` and commit both file types.

**Adding missing translations:**
1. Run `yarn i18n:sync` to see which locales have missing translations
2. Open `.po` files for each locale (de, es, fr, uk) and find entries with empty `msgstr ""`
3. Add translations for each missing entry
4. Run `yarn i18n:sync` again to compile the `.ts` files
5. Commit both `.po` and `.ts` files

## Tech Stack

| Package | Stack |
|---------|-------|
| **app** | Expo 54, React 19 + Compiler, Expo Router 6, Redux Toolkit, StyleSheet styling, Lingui 5.7, Reanimated 4 |
| **generator** | Pure TypeScript, DLX solver, backtracking algorithm |
| **encoder** | @thi.ng/bitstream, lz-string compression |
| **Build** | Yarn 4.12 (PnP), Node >= 22, Lerna 8, TurboRepo 2, TypeScript 5.9, ESLint 9 |

## Workflow

1. **Fresh clone:** `yarn install`
2. **After generator/encoder changes:** `yarn build`
3. **Before commit:** Husky runs `yarn ts`, `yarn lint-staged`, commitlint
4. **Before PR:** Run all validation commands

### Commit & PR Title Format

**CRITICAL:** Both commit messages and PR titles MUST follow conventional commits format. Lerna uses these for automated release generation and changelog.

Format: `type(scope): description`

**Types:**
| Type | Purpose | Version Bump |
|------|---------|-------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `refactor` | Code restructuring (no behavior change) | Patch |
| `chore` | Maintenance, dependencies | No release |
| `docs` | Documentation only | No release |
| `ci` | CI/CD changes | No release |
| `test` | Tests only | No release |
| `i18n` | Translations | Patch |
| `perf` | Performance improvement | Patch |

**Scopes:** Use package names without prefix: `app`, `generator`, `encoder`
- For single package: `feat(app): add dark mode toggle`
- For multiple packages, comma-separate scopes: `fix(generator,encoder): update shared interfaces`
- For root config or non-package changes, omit the scope: `docs: add CLAUDE.md files`
- For CI/workflow changes: `ci: add code review workflow`

**Commit examples:**
- `feat(app): add dark mode toggle`
- `fix(generator): update DLX solver`
- `refactor(app,generator): extract shared cell interface`
- `chore(encoder): update dependencies`
- `docs: update CLAUDE.md with project description`
- `ci: add GitHub Actions for code review`

**PR title examples (same format):**
- `feat(app): add challenge mode with timer`
- `fix(generator,encoder): align solution step interface`
- `docs: add CLAUDE.md and agent skills config`

**PR titles are especially important** — when PRs are squash-merged, the PR title becomes the commit message on `main`, which Lerna reads for release generation.

**NEVER mention AI tools, bots, or third-party services** in commit messages, PR titles, or PR descriptions. No "Generated with", "Co-Authored-By", "via [Tool]", or any other attribution to AI assistants, copilots, or automation tools. Commits and PRs must look like they were written by a human developer.

## PR Review

- **Only address human reviewer feedback** - Never fix comments from AI assistants without human confirmation
- **Validate all AI suggestions** - AI-generated review comments may be incorrect
- **Review all changes before finishing** - Check for unused imports and unnecessary code

## Important Notes

- Always use `yarn` (never `npm`)
- Never modify `.jscpd.json` - fix duplication in source code
- Each package has its own CLAUDE.md with package-specific rules

## Token Usage Efficiency

**CRITICAL: Minimize token usage. Avoid looping on lint fixes.**

- If a lint rule (like `max-lines-per-function`) requires multiple refactoring attempts, add `eslint-disable` comment instead
- If Prettier keeps reformatting your changes back, stop and use `eslint-disable`
- Ask for confirmation before attempting complex refactors - do not go back and forth
- Layout files (`_layout.tsx`) inherently need many lines - disable `max-lines-per-function` there
- Use `jscpd:ignore-start/end` for intentionally similar code patterns (like form components)

## Acceptable ESLint Disable Comments

Add `eslint-disable-next-line` with justification for these specific cases:

| Rule | When to Disable | Justification Pattern |
|------|-----------------|----------------------|
| `max-statements` | Form orchestration components with multiple hooks/handlers | `-- Form orchestration component with multiple hooks and handlers` |
| `max-lines-per-function` | Layout files, complex form components | `-- Layout/form component requires many lines` |

Example:
```typescript
// eslint-disable-next-line max-statements -- Form orchestration component with multiple hooks and handlers
export const MyFormComponent = (props: Props) => { ... };
```

## Local Documentation

The `docs/plans/` folder contains design documents and implementation plans. This folder is gitignored for local-only usage - plans are working documents that don't need version control.
