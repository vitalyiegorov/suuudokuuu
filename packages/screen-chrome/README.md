# @suuudokuuu/screen-chrome

A generic, composable, fully configurable "screen chrome" system for React Native (Expo) apps: progressive edge fade/blur bands and a collapsible large-to-small header title, both scroll-driven.

## Purpose

`screen-chrome` provides two building blocks that are commonly needed together on scrollable screens:

1. **Edge fade + blur** — a progressive blur/gradient band at the top and/or bottom edge of the screen so content fades and blurs out under chrome (a header, a tab bar, etc.), light/dark theme aware, with optional scroll-driven opacity and blur intensity.
2. **Collapsible header** — a header whose large title cross-fades into a small title as the user scrolls, backed by a scroll-driven blur backdrop.

Everything is configured through a single provider-level config object with sensible platform-specific defaults, rather than hardcoded constants. There is no framework lock-in: no NativeWind, and no app-specific theme import — light/dark theming is injected via a `colorScheme` prop, so the package can be consumed by apps with entirely different styling systems.

## Install

This package is consumed as raw TypeScript source (no build step) via Yarn workspaces:

```json
{
    "dependencies": {
        "@suuudokuuu/screen-chrome": "workspace:*"
    }
}
```

### Peer dependencies

The package does not bundle these — the consuming app must install and configure them:

| Package                                 | Required version |
| --------------------------------------- | ---------------- |
| `react`                                 | 19.2.3           |
| `react-native`                          | 0.86.0           |
| `react-native-reanimated`               | 4.5.0            |
| `react-native-safe-area-context`        | ~5.7.0           |
| `expo-blur`                             | ~57.0.0          |
| `expo-linear-gradient`                  | ~57.0.0          |
| `@react-native-masked-view/masked-view` | ^0.3.2           |

`EdgeFade` renders its native mask via `MaskedView` from `@react-native-masked-view/masked-view` (not `@expo/ui/community/masked-view`, which can composite against the window and make the app surface transparent when a full-screen overlay/menu opens — see `@generic/component/blur-gradient`).

## Quick start

```tsx
<ScreenChromeProvider colorScheme="dark" config={{ maxBlurIntensity: 60 }}>
    <ScreenChromeFrame>
        <ScreenChromeContent>
            <ScreenChromeScrollView>{content}</ScreenChromeScrollView>
        </ScreenChromeContent>
        <EdgeFade position="top" scrollAnimation={{ opacityInputRange: [0, 40] }} />
        <EdgeFade position="bottom" />
        <CollapsibleHeader>
            <CollapsibleHeaderLeading>{backButton}</CollapsibleHeaderLeading>
            <CollapsibleHeaderTitleSlot>
                <CollapsibleHeaderLargeTitle>
                    <MyTitle fontSize={31} />
                </CollapsibleHeaderLargeTitle>
                <CollapsibleHeaderSmallTitle>
                    <MyTitle fontSize={17} />
                </CollapsibleHeaderSmallTitle>
            </CollapsibleHeaderTitleSlot>
            <CollapsibleHeaderTrailing>{actions}</CollapsibleHeaderTrailing>
        </CollapsibleHeader>
    </ScreenChromeFrame>
</ScreenChromeProvider>
```

Render order inside `ScreenChromeFrame` matters: content first (so native blur can sample it), then edge fades, then the header, on top.

## API reference

### Provider and context

- **`ScreenChromeProvider`** — `{ children, colorScheme?: 'light' | 'dark', config?: ScreenChromeConfigOverridesInterface }`. Defaults `colorScheme` to `'light'`. Deep-merges the given `config` (all fields optional) over the platform default config. Owns the shared scroll position used by every child.
- **`useScreenChrome()`** — reads the current context value (`colorScheme`, `config`, `scrollY`). Throws `useScreenChrome must be used within ScreenChromeProvider` when called outside the provider.
- **`useScreenChromeScrollHandler()`** — returns an animated scroll handler that writes the clamped scroll offset (`Math.max(event.contentOffset.y, 0)`) to the shared value on the UI thread. Already wired into `ScreenChromeScrollView`; only needed if you bring your own scroll view.
- **`useScrollFadeStyle(inputRange, outputRange)`** — escape hatch returning an animated opacity style interpolated off the shared scroll position, for any custom scroll-linked element outside the provided components.
- **`useBackdropRecomposite()`** — returns a `BackdropRecompositeRef` (a ref callback) to attach to any container element. On web, whenever the document returns to visibility (`visibilitychange` → `visible`) or the page is restored from the back/forward cache (`pageshow` with `event.persisted`), every element in that container's subtree with a non-`none` computed `backdrop-filter` has the filter cleared for one frame and restored on the next `requestAnimationFrame`. This forces WebKit to rebuild backdrop-filter layers that it can leave painted opaque after reclaiming a backgrounded tab's GPU resources. On native the hook is `emptyFn` and attaches nothing. `EdgeFade`'s web implementation wires this to itself; consumers with their own blurred chrome (a `BlurView` tab bar, for example) can attach the same ref to an existing wrapper so no extra DOM node or layout is introduced.

### Config

All fields are optional overrides on top of the platform defaults below.

| Field                                  | Native default                                                                                                                                           | Web default |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `headerHeight`                         | 64                                                                                                                                                       | 64          |
| `topFadeHeight`                        | 150                                                                                                                                                      | 76          |
| `bottomFadeHeight`                     | 150                                                                                                                                                      | 76          |
| `headerBackdropHeight`                 | 220                                                                                                                                                      | 108         |
| `intensity` (static blur)              | 50                                                                                                                                                       | 50          |
| `maxBlurIntensity` (scroll-driven cap) | 52                                                                                                                                                       | 38          |
| `collapseStart`                        | 0                                                                                                                                                        | 0           |
| `smallTitleStart`                      | 40                                                                                                                                                       | 40          |
| `largeTitleEnd`                        | 60                                                                                                                                                       | 60          |
| `collapseEnd`                          | 80                                                                                                                                                       | 80          |
| `scrollEventThrottle`                  | 16                                                                                                                                                       | 16          |
| `snapToCollapse`                       | `false`                                                                                                                                                  | `false`     |
| `colors`                               | light `rgba(255,255,255,0.42)` solid / `rgba(255,255,255,0.08)` wash, dark `rgba(0,0,0,0.48)` solid / `rgba(0,0,0,0.12)` wash                            | same        |
| `maskStops`                            | top `{0: 'rgba(0,0,0,0.99)', 0.5: '#000000', 1: 'transparent'}`, bottom `{0: 'transparent', 0.16: 'transparent', 0.7: '#000000', 1: 'rgba(0,0,0,0.99)'}` | same        |

`colors` is keyed by color scheme (`light` / `dark`), each entry providing a `solid` and a `wash` color used to build the edge gradient. `maskStops` defines the alpha mask gradient stops per edge position and is run through an easing curve on native for a perceptually smooth falloff.

When `snapToCollapse` is `true`, ending a drag or momentum scroll with the offset strictly between `collapseStart` and `collapseEnd` animates the scroll position to the nearer rest state (`collapseStart` below the midpoint, `collapseEnd` otherwise) so the header never rests half-collapsed, matching UIKit's large-title snap behavior. A drag that ends with residual momentum (`velocity.y` magnitude `>= 0.05`) defers to the subsequent momentum-end snap instead of double-animating. When the OS reduced-motion setting is on, the snap jumps instead of animating. Default `false` for parity with the reference implementations.

### `EdgeFade`

The fade + blur primitive, rendered at either screen edge.

| Prop              | Type                                                                                  | Default                           |
| ----------------- | ------------------------------------------------------------------------------------- | --------------------------------- |
| `position`        | `'top' \| 'bottom'`                                                                   | required                          |
| `height`          | `number`                                                                              | from config, by position          |
| `intensity`       | `number`                                                                              | `config.intensity`                |
| `scrollAnimation` | `{ opacityInputRange?, intensityInputRange?, maxIntensity? }`                         | none (static band)                |
| `blurMethod`      | `BlurMethod` — native-only Android blur method; no effect on web/iOS system materials | `'dimezisBlurView'` (native only) |
| `style`           | `StyleProp<ViewStyle>`                                                                | none                              |

When `scrollAnimation` is supplied, container opacity interpolates over `opacityInputRange` into `[0, 1]` and blur intensity interpolates over `intensityInputRange` into `[0, maxIntensity ?? config.maxBlurIntensity]`, both clamped. Without it, the band renders as a static fade.

The band is purely decorative and is excluded from the accessibility tree (native: `accessible={false}`, `accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"`; web: `aria-hidden`), so it never occludes or displaces the accessibility elements of content or chrome it visually overlaps (e.g. a tab bar or header sitting under it).

### `CollapsibleHeader` (compound)

- **`CollapsibleHeader`** — the header container, positioned above the edge fades, sized to `insets.top + config.headerHeight`.
- **`CollapsibleHeaderLeading`** / **`CollapsibleHeaderTrailing`** — fixed-size slots for consumer-owned content (for example a back button or action buttons). The package renders no default content here.
- **`CollapsibleHeaderTitleSlot`** — the flexible middle region that stacks the large and small title layers.
- **`CollapsibleHeaderLargeTitle`** — fades out (opacity 1 → 0) as the user scrolls from `collapseStart` to `largeTitleEnd`.
- **`CollapsibleHeaderSmallTitle`** — fades in (opacity 0 → 1) as the user scrolls from `smallTitleStart` to `collapseEnd`.
- **`CollapsibleHeaderBackdrop`** — convenience wrapper around `EdgeFade` preconfigured to back the header with a scroll-driven blur that follows the same collapse thresholds.

Title content (the actual text) is always supplied by the consumer — the package only animates opacity, it never renders or sizes text itself.

### Screen structure

- **`ScreenChromeFrame`** — the root container (`flex: 1`); child order controls paint order.
- **`ScreenChromeContent`** — wraps the scrollable content area.
- **`ScreenChromeScrollView`** — an `Animated.ScrollView` prewired with the scroll handler and `scrollEventThrottle` from config. Accepts optional `contentInsetTop` / `contentInsetBottom` numbers (default `0`) that get merged additively into `contentContainerStyle` alongside the safe-area insets; any explicit padding you pass still wins. All other `ScrollView` props pass through untouched.

## Theming

There is no built-in theme system — pass `colorScheme="light"` or `colorScheme="dark"` to `ScreenChromeProvider` (default `"light"`) and every component reads its colors from `config.colors[colorScheme]`. To customize the palette, override the `colors` field in `config` per scheme rather than passing raw colors to individual components.

## Platform behavior

- **Native** — `EdgeFade` layers a `MaskedView` (from `@react-native-masked-view/masked-view`, alpha gradient mask) over a wash gradient and a real `BlurView`, so the edge both blurs and tints the content beneath it. Blur tint follows `colorScheme` (`systemChromeMaterial*` / `systemMaterial*`).
- **Web** — `EdgeFade` uses a CSS `backdrop-filter`/`mask-image` approach instead of a native blur view. Scroll-driven animation on web affects **opacity only** — the blur radius stays static; only the opacity interpolates with scroll. The bottom edge renders on web the same as the top edge. `EdgeFade` also attaches `useBackdropRecomposite` to itself so its blur layer is rebuilt when the tab returns to the foreground.

## Not included by design

- **No back button** — `CollapsibleHeaderLeading` is an empty slot; navigation chrome stays with the consumer.
- **No i18n** — the package renders no user-facing strings; all title and label content is consumer-provided.
- **No navigation coupling** — nothing in this package imports a router or navigation library; it only reacts to scroll position.
