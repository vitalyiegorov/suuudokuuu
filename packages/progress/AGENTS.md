# Progress

Persisted settings literals in `src/settings/schema/settings.schema.ts` are a storage compatibility contract. Removing a font size, language, motion preference, cell margin, theme, or difficulty value requires a new SQL migration that rewrites existing rows before the narrowed schema decodes them. Additions preserve existing values.
