# White-Label Configuration

The app supports white-labeling through two layers: a build-time config file
(`brand.config.js`) consumed by `app.config.js`, and a validated runtime
subset exposed through `expoConfig.extra.brand`.

## Build-Time Config: `packages/app/brand.config.js`

Every field is build-time only unless noted otherwise. Changing any of these
values requires a native rebuild (`expo prebuild` or an EAS build) — Metro
alone cannot apply them, since they configure identity, native manifests,
and bundled assets, not JavaScript.

| Field                   | Type                         | Default                                                           | Exposed at runtime                    |
| ----------------------- | ---------------------------- | ----------------------------------------------------------------- | ------------------------------------- |
| `appName`               | `string`                     | `'suuudokuuu'`                                                    | Yes, via `extra.brand.appName`        |
| `slug`                  | `string`                     | `'suuudokuuu'`                                                    | No                                    |
| `scheme`                | `string`                     | `'suuudokuuu'`                                                    | No                                    |
| `iosBundleIdentifier`   | `string`                     | `'com.vitalyiegorov.suuudokuuu'`                                  | No                                    |
| `androidPackage`        | `string`                     | `'com.vitaliiyehorov.suuudokuuu'`                                 | No                                    |
| `associatedDomains`     | `string[]`                   | `['suuudokuuu.com', 'www.suuudokuuu.com']`                        | No                                    |
| `webOrigin`             | `string`                     | `'https://www.suuudokuuu.com/'`                                   | No                                    |
| `assets.icon`           | `string` (path)              | `'./assets/icon.png'`                                             | No                                    |
| `assets.adaptiveIcon`   | `string` (path)              | `'./assets/adaptive-icon.png'`                                    | No                                    |
| `assets.splash`         | `string` (path)              | `'./assets/splash.png'`                                           | No                                    |
| `assets.favicon`        | `string` (path)              | `'./assets/favicon.png'`                                          | No                                    |
| `splashBackgroundColor` | `string` (hex color)         | `'#000000'`                                                       | No                                    |
| `defaultTheme`          | `string` (`ThemeEnum` value) | `'black-and-white'`                                               | Yes, via `extra.brand.defaultTheme`   |
| `links.donation`        | `string` (URL)               | `'https://savelife.in.ua/en/donate-en/#donate-army-card-monthly'` | Yes, via `extra.brand.links.donation` |

`app.config.js` reads `brandConfig` to build `name`, `slug`, `scheme`,
`icon`, `splash`, `ios.bundleIdentifier`, `ios.associatedDomains`,
`android.package`, `android.adaptiveIcon`, `android.intentFilters`,
`web.favicon`, and the `expo-router` plugin's `origin`. The Android intent
filter hosts are derived from `associatedDomains`: the apex domain (the
entry that does not start with `www.`) gets both a bare host entry and a
`*.` wildcard host entry, matching how Android verifies deep links for the
whole zone.

EAS deployment fields — `owner`, `updates.url`, and `extra.eas.projectId` —
stay hardcoded in `app.config.js` and are **not** part of `brand.config.js`.
They are deployment infrastructure, not brand identity: a fork must
provision its own EAS project regardless of any white-label values.

## Runtime Brand: `extra.brand`

`app.config.js` publishes a deliberately small, non-privileged subset of
`brandConfig` under `extra.brand`:

```js
extra: {
    brand: {
        appName: brandConfig.appName,
        defaultTheme: brandConfig.defaultTheme,
        links: brandConfig.links
    }
}
```

`expo config --type public` embeds `extra` directly into the published
config and the JS bundle, so only fields safe to ship to end users belong
here. Identity fields — bundle ids, the URL scheme, associated domains, and
signing-related values — are never included in `extra.brand`. Imported or
custom themes, and any other runtime code path, cannot reach or mutate
`brand.config.js`, the bundle identifiers, the scheme, or app signing; those
stay exclusively build-time.

## Runtime Accessor: `getBrand()`

`packages/app/src/@generic/utils/get-brand.util.ts` reads
`Constants.expoConfig?.extra?.brand`, validates it against `BrandSchema`
(`packages/app/src/@generic/schema/brand.schema.ts`), and returns the parsed
value. If the config is missing or fails validation, it returns a fallback
that reproduces the default brand exactly:

```ts
const fallbackBrand: BrandType = {
    appName: 'suuudokuuu',
    defaultTheme: ThemeEnum.BlackAndWhite,
    links: { donation: 'https://savelife.in.ua/en/donate-en/#donate-army-card-monthly' }
};
```

Runtime consumers call `getBrand()` instead of hardcoding brand values:

- `@generic/constants/donation.constant.ts` sets `donationLinkConstant` from
  `getBrand().links.donation`.
- `settings/component/settings-app-footer/settings-app-footer.tsx` and
  `screens/components/home-screen/home.screen.tsx` read
  `getBrand().appName` for the version label and the home screen title.

`settings/store/settings.state.ts` keeps `initialSettingsState.theme`
hardcoded to `ThemeEnum.BlackAndWhite` rather than reading
`getBrand().defaultTheme`. The Redux store module is imported transitively
by many unit tests (`settings.slice.spec.ts`, `settings.selectors.spec.ts`,
`app-root-migrations.spec.ts`), and `expo-constants` ships ESM output that
the app's Jest config does not currently transform, so pulling `getBrand()`
into that module breaks those suites at parse time. `BrandSchema.defaultTheme`
is still fully implemented and tested; wiring it into the initial settings
state is left for a follow-up that also updates the Jest transform
configuration for the Expo module chain.

## Required Asset Sizes

| Asset                 | Path                       | Size                                   | Notes                                            |
| --------------------- | -------------------------- | -------------------------------------- | ------------------------------------------------ |
| App icon              | `assets/icon.png`          | 1024×1024 px, no transparency          | iOS + base icon                                  |
| Android adaptive icon | `assets/adaptive-icon.png` | 1024×1024 px, transparent padding-safe | foreground layer                                 |
| Splash                | `assets/splash.png`        | 1284×2778 px recommended               | `resizeMode: contain` on `splashBackgroundColor` |
| Web favicon           | `assets/favicon.png`       | 48×48 px                               |                                                  |

## Rebuilding After a Brand Change

`brand.config.js` changes affect native identity, manifests, and bundled
assets. After editing it:

1. Run `expo prebuild` (or trigger an EAS build) to regenerate the native
   projects — Metro reloading JavaScript is not enough.
2. Re-verify the resolved config with
   `cd packages/app && npx expo config --type public` to confirm the new
   values took effect.
3. Re-run the deep-link Maestro flow
   (`tests/app-tests/flows/02.game-screen-win.flow.yaml`) after the rebuild
   to confirm shared links still open correctly under the new identity.
