# Progress

Persisted settings literals in `src/settings/schema/settings.schema.ts` are a storage compatibility contract. Removing a font size, language, motion preference, cell margin, theme, or difficulty value requires a new SQL migration that rewrites existing rows before the narrowed schema decodes them. Additions preserve existing values.

The backup file written by `BackupService` is a storage compatibility contract too. It carries completed games, difficulty stats, player stats and custom themes in their decoded shapes under `version: 1`; settings, the current run and store review claims are device-local and never exported. Import merges in one transaction and must stay idempotent: games are unioned by difficulty, completion time and encoded state, stat counters and records take the larger or better value (stats are aggregates of games that are trimmed, so they cannot be summed or recomputed without double counting), day numbers are unioned, and a custom theme is replaced only by a copy with a newer `updatedAt`. Narrowing an exported schema requires a new version that still decodes the older ones.

Store review claims are internal transaction state read only by `StoreReviewService`. They have no reactive subscribers, so their writes do not publish a reactivity mutation.

`SettingsRepository.initialize` runs inside the boot atom before any settings reader exists, so it must not publish a reactivity mutation either: invalidating the settings atoms mid-boot rebuilds them re-entrantly, and the nested query overflows the wa-sqlite WASM stack on WebKit (PR #558 web E2E, `RangeError: Maximum call stack size exceeded`).
