# Progress

Persisted settings literals in `src/settings/schema/settings.schema.ts` are a storage compatibility contract. Removing a font size, language, motion preference, cell margin, theme, or difficulty value requires a new SQL migration that rewrites existing rows before the narrowed schema decodes them. Additions preserve existing values.

Store review claims are internal transaction state read only by `StoreReviewService`. They have no reactive subscribers, so their writes do not publish a reactivity mutation.

`SettingsRepository.initialize` runs inside the boot atom before any settings reader exists, so it must not publish a reactivity mutation either: invalidating the settings atoms mid-boot rebuilds them re-entrantly, and the nested query overflows the wa-sqlite WASM stack on WebKit (PR #558 web E2E, `RangeError: Maximum call stack size exceeded`).
