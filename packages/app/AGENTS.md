# App Package

Main Sudoku game application built with Expo 57, React Native 0.86, React 19.2, React Compiler, Expo Router, Redux Toolkit, Lingui 6, Reanimated 4, and React Native `StyleSheet` theme modules.

## Commands

```bash
yarn start
yarn ios
yarn ios:device
yarn android
yarn web
yarn prebuild

yarn export:web
yarn build:vercel

yarn i18n:sync
yarn ts
yarn lint
yarn test
yarn test:coverage
```

After modifying user-facing text, run:

```bash
yarn i18n:sync
```

## Structure

```text
src/
├── @generic/           # Store setup, shared components, hooks, styles, utils
├── app/                # Expo Router routes and root layout
├── challenge/          # Challenge result/accept/progress UI and utilities
├── game/               # Game context, Redux slice, board UI, hooks, serializers
├── history/            # Completed game history and replay UI
├── i18n/locales/       # Lingui catalogs: en, uk, fr, de, es
├── scoring/            # SudokuScoring and score explanation UI
├── screens/            # Screen-level components used by routes
├── settings/           # Preferences, settings UI, settings slice
└── theme/              # Theme context, enums, interfaces, and theme objects
```

## React 19 Rules

1. Let React Compiler handle ordinary memoization. Do not add `React.memo`, `useMemo`, or `useCallback` by default.
2. Use manual memoization only for APIs that require stable callback identity, such as `useFocusEffect`.
3. Do not use `forwardRef` for new components. Accept `ref` as a regular prop when a component needs it.
4. Do not add `displayName`.
5. Keep derived render values as local constants instead of storing duplicate state.

## Component Patterns

1. Keep one component per folder: `component-name/component-name.tsx`.
2. Each component file exports exactly one component. Context files may export context objects, and provider components live in their own component folders.
3. Keep route files thin. Routes should select and render screen components from `screens/components` or feature modules.
4. Extract repeated JSX rows/items into named components instead of render functions.
5. Extract complex JSX prop logic to named variables before the return.
6. Use named `handle*` functions for non-trivial handlers.
7. For many props, destructure inside the function body. For small components, destructuring in the signature is fine.
8. Keep component internals ordered as props, framework hooks, state/refs, external hooks, handlers, derived values, effects, return.
9. Use composition and explicit variant components instead of boolean-heavy mode props.
10. Prefer `children` for primary composed content instead of `render*` props or named content props.
11. Pure helpers used by components live in the owning module's `utils/` folder. Component files may keep module-level data constants, but not named behavior helpers.
12. Component props are always declared inline as `interface Props`. Do not use `type Props`, `*PropsInterface`, or inline object parameter types for a single component. Promote a shared props interface only when the exact same shape is consumed by multiple components.

## Styling And Themes

1. This app uses React Native `StyleSheet` modules, not NativeWind or CVA.
2. Keep style objects in nearby `*.styles.ts` files when the style is owned by a component.
3. Use theme tokens from `theme/` and shared generic styles instead of duplicating raw colors.
4. Preserve the existing theme contract in `ThemeInterface` from `@suuudokuuu/ui` (`packages/ui/src/theme/interface/theme.interface.ts`).
5. Keep test selectors in nearby `*.selectors.ts` files when a screen or component is targeted by Maestro.

## State And Persistence

1. Redux slices live in the owning module's `store` folder.
2. Use `useAppDispatch` and `useAppSelector` from `@generic/hooks`.
3. When persisted state shape changes, bump the Redux Persist version and add a migration in `@generic/app-root.store.ts`.
4. Persisted-state migrations are the only place where legacy unknown shapes may need narrow escape hatches. Do not spread that pattern into normal app code.
5. Keep game mutations in the game slice and puzzle invariants in `@suuudokuuu/generator`.

## Routing And Deep Links

1. Expo Router routes live under `src/app`.
2. Shared puzzle links enter through `shared/[url].tsx`.
3. Keep `suuudokuuu://` and associated domain behavior working when touching app config, router files, encoder payloads, or sharing hooks.
4. Prefer route files that delegate to screen components instead of embedding large screen logic directly.

## i18n

1. Use `t` from Lingui macros for string props, alerts, toasts, labels, and non-JSX strings.
2. Use `<Trans>` for direct JSX text children.
3. Do not pass `<Trans>` where a component prop expects `string`.
4. Prefer `<Trans>` in JSX: `<Trans>Score</Trans>` instead of `{t\`Score\`}`.
5. Use `plural(...)` from Lingui macros for count-sensitive user-facing text instead of concatenating counts with fixed singular/plural labels.
6. Do not call `i18n.t()`. Use `t`, `<Trans>`, `msg`, or `plural` macros so extraction stays static.
7. After text changes, run `yarn i18n:sync`.
8. Before finishing i18n work, run `yarn i18n:check` from the repo root.
9. Keep every locale's `messages.po` and compiled `messages.ts` under `src/i18n/locales` in sync.

## Vercel Web Deploy

1. `vercel-functions/api/beta/*.ts` are web-standard `{ fetch }` endpoints; `vercel-functions/shared/create-node-handler.util.ts` bridges them to the Node `(request, response)` signature the Vercel Node launcher calls.
2. `scripts/build-vercel-output.ts` (`yarn build:vercel`) emits a Build Output API v3 tree in `.vercel/output`: `static/` from the Expo web export, one esbuild bundle per endpoint in `functions/api/beta/<name>.func`, and `config.json`.
3. `vercel.json` stays the single source of truth for routes; the build script reads them from it.
4. CI deploys the prebuilt tree with `vercel deploy --prebuilt` from `packages/app`, so the functions are never installed or compiled on Vercel.

## Web Platform Notes

1. `Alert` resolves to `@generic/components/alert/alert.web.ts` on web, which maps a React Native
   `Alert.alert` call onto a single `window.confirm()`. It selects handlers by `AlertButton.style`
   (`'cancel'` versus the first non-cancel button). Never match on `button.text` — every call site
   builds those labels with the Lingui `t` macro, so text matching silently breaks in every locale that
   translates the label.
2. `enableScreens()` is called only when `Platform.OS !== 'web'` in `src/app/_layout.tsx`.
   `react-native-screens` assigns `ENABLE_SCREENS` _before_ its `isNativePlatformSupported` guard, so
   calling it unconditionally flips `screensEnabled()` to `true` on web and diverts the tab navigator
   from react-navigation's `ResourceSavingView` into `Screen.web.js`, the only component in the web
   tree that applies `hidden` + `display: none`. `enableFreeze()` returns before its assignment and is
   a genuine no-op on web, so it is guarded alongside purely for symmetry.
3. Blurred chrome on web (`EdgeFade`, the `FloatingTabBar` `BlurView` surface) attaches
   `useBackdropRecomposite` from `@suuudokuuu/screen-chrome`. Keep that ref attached to an existing
   wrapper element; do not introduce a new wrapper View for it, which would change tab bar layout.

## Error Handling

1. Use `getErrorMessage(error)` for unknown errors.
2. Keep user-facing error messages localized.
3. Avoid catch-and-ignore unless the failure is intentionally recoverable and the caller has a clear fallback.

## Verification

Run app-level checks after app changes:

```bash
yarn ts && yarn lint
```

Run `yarn test` when scoring, reducers, persistence, or deterministic app logic changes. Run Maestro flows from `tests/app-tests` when routes, selectors, deep links, sharing, or end screens change.

## Running On A Local Simulator

1. JavaScript and TypeScript changes need only Metro. Do not run `expo run:ios` for them.
2. Start Metro from the worktree you are editing, then confirm the port it actually bound. It does not always land on 8081, and the dev client remembers whatever port it used last. A port mismatch looks exactly like "my changes did nothing", so check the port before suspecting the build or the worktree.
3. Verify Metro is serving before debugging the app: `curl -s -o /dev/null -w '%{http_code}' http://localhost:<port>/status` returns 200.
4. Both the release and dev builds register the `suuudokuuu` scheme, so `simctl openurl` with the dev-launcher URL is ambiguous and may reach the wrong app. The reliable route is to launch the dev client directly and use its own UI:

```bash
xcrun simctl terminate booted com.vitalyiegorov.suuudokuuu
xcrun simctl launch booted com.vitalyiegorov.suuudokuuu.dev
```

Then tap **Enter URL manually**, type `http://localhost:<port>`, and tap **Connect**. The launcher's "Recently opened" list shows which port the client used previously.

5. The dev client resumes a cached bundle when launched plain, so an unchanged screen does not prove Metro is unreachable. Metro logging no bundle request is the signal that nothing fetched.
6. Native rebuilds work through `yarn ios`, `yarn ios:device` and `yarn prebuild`, which pin `LANG` and `LC_ALL` to `en_US.UTF-8`. Only native dependency or app-config changes need that path.
7. Do not call `expo run:ios`, `expo prebuild` or `pod install` directly unless the shell exports a UTF-8 locale. With `LANG` unset, Ruby resolves the filesystem encoding to US-ASCII, `Dir.pwd` comes back as ASCII-8BIT, and CocoaPods dies in `Pod::Config#installation_root` with `Unicode Normalization not appropriate for ASCII-8BIT`, which then fails `xcodebuild` with "sandbox is not in sync with the Podfile.lock". Prefer the package scripts, which already set the locale.
