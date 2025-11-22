# Copilot Instructions for Suuudokuuu

## Code Style and Quality Standards

**CRITICAL RULES:**
- **Never add comments** - code should be explicit, clean and understandable through proper naming
- **Never use barrel exports** (index.ts files that re-export other modules)
- **Favor composition** over inheritance and complex patterns
- **Pick proper names** for classes, functions, modules, and variables that make the code self-documenting

## Repository Overview

**Suuudokuuu** is a modern, open-source Sudoku game built with React Native/Expo to support Ukraine. The repository is a **monorepo** (~1.7GB) using **TurboRepo** and **Lerna** for managing multiple packages with enterprise-grade CI/CD.

**Key Technologies:**
- **Runtime:** Node.js >= 22.0.0 (package manager: Yarn 4.9.2)
- **Frameworks:** React Native 0.81.4, React 19.1.0, Expo 54.x
- **Languages:** TypeScript 5.9.2 (strict mode enabled)
- **Build Tools:** TurboRepo, Lerna, Babel, Metro bundler
- **Deployment:** EAS (Expo Application Services), Vercel (web)

## Repository Structure

```
.
├── .github/workflows/    # CI/CD pipelines
├── packages/
│   ├── app/             # Main React Native/Expo application
│   │   ├── src/         # Source code
│   │   │   ├── app/     # Expo Router screens
│   │   │   ├── game/    # Game logic and state
│   │   │   ├── settings/
│   │   │   ├── theme/
│   │   │   └── locales/ # i18n translations
│   │   ├── app.config.js
│   │   ├── babel.config.js
│   │   ├── eas.json     # EAS build configurations
│   │   └── package.json
│   └── generator/       # Sudoku puzzle generator library
│       ├── src/
│       ├── dist/        # Built output (cjs + esm)
│       └── package.json
└── tests/
    └── app-tests/       # Maestro E2E tests

Root Configuration Files:
- package.json          # Root workspace scripts
- turbo.json           # TurboRepo task configuration
- lerna.json           # Lerna versioning config
- eslint.config.mjs    # ESLint configuration (flat config)
- tsconfig.json        # TypeScript base config
- .prettierrc.js       # Prettier formatting rules
- .jscpd.json         # Copy-paste detection config
- knip.json           # Dead code detection config
- commitlint.config.js # Commit message validation
- .lintstagedrc.js    # Pre-commit hooks
```

## Build & Validation Commands

### Initial Setup
**ALWAYS run these commands first after cloning or when dependencies change:**

```bash
yarn install  # Takes ~30-40 seconds, installs all workspace dependencies
```

**Note:** You may see peer dependency warnings about TypeScript version (5.9.2 vs <5.9.0 expected) and missing @babel/core - these are expected and do not affect functionality.

### Core Validation Pipeline

**Run these commands in this exact order to validate changes:**

```bash
# 1. TypeScript type checking (~6 seconds)
yarn turbo ts

# 2. ESLint linting (~14 seconds)
yarn turbo lint

# 3. Dead code detection (~5 seconds)
yarn turbo deadcode

# 4. Copy-paste detection (~2 seconds)
yarn turbo cpd

# 5. Unit tests (~10 seconds)
yarn test

# Optional: with coverage (~10 seconds)
yarn test:coverage
```

**Alternative: Run all checks together:**
```bash
yarn turbo ts && yarn turbo lint && yarn turbo deadcode && yarn turbo cpd && yarn test
```

### Build Commands

```bash
# Build all packages (~6 seconds first time, uses Turbo cache after)
yarn build

# Force rebuild without cache
yarn build:force

# Build individual packages (from package directory):
cd packages/generator && yarn build
```

**Build Output:**
- `packages/generator/dist/cjs/` - CommonJS modules
- `packages/generator/dist/esm/` - ES modules

### Formatting & Linting

```bash
# Auto-fix ESLint issues
yarn lint:force

# Format code with Prettier
yarn format
```

## Pre-commit Validation

**Husky hooks automatically run on commit:**
1. `.husky/pre-commit`: Runs `yarn ts` and `lint-staged` (formats/lints changed files)
2. `.husky/commit-msg`: Validates commit message format with commitlint

**Commit Message Format (REQUIRED):**
- Must follow [Conventional Commits](https://www.conventionalcommits.org/)
- Examples: `feat(app): add feature`, `fix(generator): bug fix`, `chore: update deps`
- PR titles are validated in CI using the same rules

## CI/CD Pipelines

### Pull Request Pipeline (`.github/workflows/pr.yml`)

**Triggers:** Every PR
**Jobs:**
1. **code-quality** (Ubuntu, ~2-3 min):
   - Validates PR title with commitlint
   - Runs `yarn turbo ts` (TypeScript)
   - Runs `yarn turbo lint` (ESLint)
   - Runs `yarn turbo deadcode` (Knip)
   - Runs `yarn turbo cpd` (jscpd)
   - Runs `yarn test:coverage` (Jest with coverage)
   - Uploads coverage to Codecov

2. **eas-deploy** (Ubuntu, depends on code-quality):
   - Creates EAS preview update for iOS/Android (`development` channel)
   - Builds and deploys web app to EAS hosting
   - Posts deployment URL as PR comment

3. **e2e-ios** (macOS, depends on code-quality & eas-deploy):
   - Runs Maestro E2E tests on iOS Simulator (iPhone 16 Pro, Xcode 16.4)
   - Builds app with `eas build --profile=e2e --platform ios --local`

4. **e2e-android** (Ubuntu, depends on code-quality & eas-deploy):
   - Runs Maestro E2E tests on Android emulator (API 34)
   - Builds app with `eas build --profile=e2e --platform android --local`

**CRITICAL:** All checks in `code-quality` must pass before EAS deployment and E2E tests run.

### Main Branch Pipeline (`.github/workflows/main.yml`)

**Triggers:** Push to `main` branch
**Jobs:**
1. **release**: Runs `yarn release` (Lerna) to create GitHub releases and update CHANGELOGs
2. **web-deploy**: Deploys production web app to Vercel
3. **eas-update**: Publishes EAS update to `production` channel

## Key Configuration Details

### TypeScript
- **Strict mode enabled** with all strict flags
- **Module resolution:** Node
- **Target:** ESNext
- **JSX:** react-jsx (React 19)
- **Important:** `noEmit: true` in root config (packages have own build configs)

### ESLint (`eslint.config.mjs`)
- **Flat config format** (ESLint 9.x)
- **Extends:** @eslint/js all rules
- **Key rules:** camelcase, complexity (max 25), 140 char line length
- **Plugins:** TypeScript, React, React Hooks, Jest, Import, Promise, Lingui, RNW Community
- **Ignored paths:** `.expo/`, `.turbo/`, `node_modules/`, `dist/`, `build/`, `*.d.ts`

### Prettier
- Single quotes, 140 char width, 4 spaces indent, semicolons, no trailing commas

### Jest (Generator package)
- **Test pattern:** `*.spec.ts` files in `src/`
- **Coverage thresholds:** 69% statements, 39% branches, 66% lines, 56% functions
- **Environment:** Node

### EAS Build Profiles (`packages/app/eas.json`)
- **development**: Dev client, internal distribution, `development` channel
- **preview**: Internal distribution, `preview` channel (used for PRs)
- **e2e**: Extends preview, for iOS simulator/Android emulator
- **production**: Auto-increment version, `production` channel

## Making Changes

### When Modifying Code:

1. **Make minimal changes** to achieve the goal
2. **Run validation early and often:**
   ```bash
   yarn turbo ts     # Check types
   yarn turbo lint   # Check linting
   yarn test         # Run tests
   ```
3. **Update i18n if needed** (app package):
   ```bash
   cd packages/app
   yarn i18n:extract  # Extract new strings
   yarn i18n:compile  # Compile translations
   ```
4. **Verify build succeeds:**
   ```bash
   yarn build
   ```

### When Adding Dependencies:

1. **Check for security vulnerabilities** before adding
2. **Add to correct workspace:**
   ```bash
   # Root workspace
   yarn add -DW <package>
   
   # Specific package
   cd packages/app && yarn add <package>
   ```
3. **Rebuild after adding:**
   ```bash
   yarn install && yarn build
   ```

### When Modifying Tests:

- **Generator tests:** Add `.spec.ts` files in `src/` matching the source file structure
- **Follow existing patterns:** Use Jest with `@jest/globals`
- **Maintain coverage thresholds** (see jest.config.js)

## Common Issues & Solutions

### Issue: TypeScript version warning from @typescript-eslint
**Solution:** Expected warning, safe to ignore. TS 5.9.2 works fine despite plugin expecting <5.9.0.

### Issue: Peer dependency warnings for @babel/core or redux
**Solution:** Expected in Yarn 4 with workspace setup, dependencies are satisfied through hoisting.

### Issue: Build cache not invalidating
**Solution:** Use `yarn build:force` or `yarn turbo ts --force` to bypass Turbo cache.

### Issue: Commit message rejected
**Solution:** Follow conventional commits format: `type(scope): message` where type is feat/fix/chore/docs/style/refactor/perf/test.

### Issue: Pre-commit hooks failing
**Solution:** Fix TypeScript errors first (`yarn turbo ts`), then lint errors will auto-fix on commit.

## Additional Validation Steps

**Before finalizing changes:**
1. Clean build from scratch (optional but recommended):
   ```bash
   rm -rf node_modules packages/*/node_modules packages/*/dist
   yarn install
   yarn build
   ```
2. Run full validation pipeline:
   ```bash
   yarn turbo ts && yarn turbo lint && yarn turbo deadcode && yarn turbo cpd && yarn test:coverage
   ```
3. Check git status for unintended changes:
   ```bash
   git status
   ```

## Important Notes

- **ALWAYS** run `yarn install` before any build/test commands after dependency changes
- **NEVER** commit `node_modules/`, `dist/`, `.turbo/`, `.expo/` directories (in .gitignore)
- **TRUST** these instructions - only search for additional info if something is unclear or fails
- **Use** `yarn run -T <command>` to run workspace-level commands from package directories
- **Remember** Turbo caching - commands run faster on subsequent runs if inputs haven't changed
- **Expo/React Native changes** may require running `npx expo prebuild --clean` for native changes
- **Versioning** is managed by Lerna - don't manually update version fields in package.json

## Quick Reference

| Command | Purpose | Time | When to Use |
|---------|---------|------|-------------|
| `yarn install` | Install dependencies | ~35s | After clone, dependency changes |
| `yarn turbo ts` | Type check | ~6s | After code changes |
| `yarn turbo lint` | Lint code | ~14s | Before commit |
| `yarn test` | Run tests | ~10s | After logic changes |
| `yarn build` | Build packages | ~6s | Before deployment |
| `yarn turbo deadcode` | Detect unused code | ~5s | Before PR |
| `yarn turbo cpd` | Copy-paste detection | ~2s | Before PR |

**Full validation pipeline:** ~50 seconds total
