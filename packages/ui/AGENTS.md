# Shared UI Package

Shared React Native components and the theme contract, consumed by the Expo app.

- Define themed styles in nearby `*.styles.ts` files with `StyleSheet.create(theme => ...)` from Unistyles. Static colors belong in styles; use `withUnistyles` for themed non-style props and `useUnistyles` only when animation interpolation requires theme values.
- Use Unistyles variants for supported visual differences. Keep only variants used by consumers, and preserve caller style overrides.
- Export components from `src/index.ts` and keep implementation helpers internal. The existing `./theme` entry exposes theme contracts, tokens, and the pure `mixColors` and `validateCustomThemeColors` helpers so Unistyles can configure before themed component styles are evaluated; do not import the component entry during theme setup or add other entry points.
- Supply `ReduceMotionContext` from the application's resolved system and user motion preference. Shared UI does not subscribe to platform motion settings.
- Follow the root component, accessibility, Effect and testing rules. Pure utility tests live under `test`; retain the package coverage gates.
