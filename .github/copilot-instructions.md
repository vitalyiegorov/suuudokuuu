# Copilot Instructions for Suuudokuuu

Read the nearest applicable `AGENTS.md` before making changes. The root file defines repository-wide engineering, validation, commit, and planning-artifact rules; package-level files add scoped requirements.

Working designs and implementation plans belong in `docs/plans/`. They are local-only and gitignored: never stage or commit them. Do not use `docs/superpowers/plans/` or `docs/superpowers/specs/`; both are prohibited legacy locations.

Use `yarn` for project commands. For code changes, follow the root validation sequence and run relevant tests. Commit source changes with Conventional Commits, but never include planning artifacts.
