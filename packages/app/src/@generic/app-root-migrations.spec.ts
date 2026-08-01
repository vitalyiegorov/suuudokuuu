/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it, jest } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { initialGameState } from '../game/store/game.state';
import { emptyGameHistory } from '../history/interfaces/history-game.interface';
import { initialSettingsState } from '../settings/store/settings.state';
import { ColorSchemaEnum } from '../theme/enum/color-schema.enum';
import { ThemeEnum } from '../theme/enum/theme.enum';
import { CustomThemeSchemaVersion } from '../theme/schema/custom-theme.schema';
import { initialCustomThemesState } from '../theme/store/custom-themes.state';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../theme/themes/colorful.theme';
import { createCustomTheme } from '../theme/utils/create-custom-theme.util';

import { appRootMigrations, appRootPersistVersion } from './app-root-migrations';

import type { AppRootPersistedStateInterface } from './app-root-migrations';

jest.mock('react-native', () => ({
    Appearance: {
        getColorScheme: () => 'light'
    }
}));

jest.mock('./utils/i18n.util', () => ({
    i18nGetOSLocale: () => 'en'
}));

const migrationVersions = Object.keys(appRootMigrations).map(Number);

const buildState = (overrides: Partial<AppRootPersistedStateInterface> = {}): AppRootPersistedStateInterface => ({
    game: initialGameState,
    settings: initialSettingsState,
    customThemes: initialCustomThemesState,
    ...overrides
});

const runMigration = (version: number, state: AppRootPersistedStateInterface): AppRootPersistedStateInterface =>
    appRootMigrations[version](state);

const withoutKeyAtRuntime = <T extends object>(value: T, key: keyof T): T => {
    const clone = { ...value };
    Reflect.deleteProperty(clone, key);

    return clone;
};

const withExtraKeyAtRuntime = <T extends object>(value: T, key: PropertyKey, extraValue: unknown): T => {
    const clone = { ...value };
    Reflect.set(clone, key, extraValue);

    return clone;
};

describe('appRootMigrations', () => {
    it('should persist at the newest migration version', () => {
        expect.assertions(1);

        expect(appRootPersistVersion).toBe(Math.max(...migrationVersions));
    });

    it('should keep the manifest free of version gaps', () => {
        expect.assertions(1);

        const sortedVersions = [...migrationVersions].sort((first, second) => first - second);

        expect(sortedVersions).toStrictEqual(sortedVersions.map((_, index) => sortedVersions[0] + index));
    });

    it('should reset every stored best score', () => {
        expect.assertions(1);

        const state = buildState({
            game: {
                ...initialGameState,
                historyByDifficulty: {
                    ...initialGameState.historyByDifficulty,
                    [DifficultyEnum.Easy]: { ...emptyGameHistory, bestScore: 4200 }
                }
            }
        });

        expect(runMigration(15, state).game.historyByDifficulty[DifficultyEnum.Easy].bestScore).toBe(0);
    });

    it('should keep a complete history entry untouched while defaulting its gaps', () => {
        expect.assertions(2);

        const storedEntry = { ...emptyGameHistory, difficulty: DifficultyEnum.Easy, gamesCompleted: 3, bestScore: 10 };
        const state = buildState({
            game: {
                ...initialGameState,
                historyByDifficulty: { ...initialGameState.historyByDifficulty, [DifficultyEnum.Easy]: storedEntry }
            }
        });
        const migrated = runMigration(16, state).game.historyByDifficulty[DifficultyEnum.Easy];

        expect(migrated.gamesCompleted).toBe(3);
        expect(migrated.gamesWon).toBe(emptyGameHistory.gamesWon);
    });

    it('should keep every known difficulty in the history', () => {
        expect.assertions(1);

        const state = buildState();

        expect(Object.keys(runMigration(17, state).game.historyByDifficulty)).toStrictEqual(
            Object.keys(initialGameState.historyByDifficulty)
        );
    });

    it('should backfill the run difficulty of a resumed board', () => {
        expect.assertions(1);

        const nightmareGivens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
        const state = buildState({ game: { ...initialGameState, sudokuString: nightmareGivens } });

        expect(runMigration(29, state).game.difficulty).toBe(DifficultyEnum.Nightmare);
    });

    it('should leave the default difficulty in place when no board is stored', () => {
        expect.assertions(1);

        expect(runMigration(29, buildState()).game.difficulty).toBe(initialGameState.difficulty);
    });

    it('should drop stored timelines and fill new state defaults', () => {
        expect.assertions(3);

        const state = buildState({ game: { ...initialGameState, score: 700 } });
        const migrated = runMigration(28, state);

        expect(migrated.game.timelineEvents).toStrictEqual([]);
        expect(migrated.game.challengeTimelineEvents).toStrictEqual([]);
        expect(migrated.game.score).toBe(700);
    });

    it('should introduce an empty custom themes slice and keep existing settings', () => {
        expect.assertions(2);

        const state = buildState({
            settings: { ...initialSettingsState, theme: ThemeEnum.Newspaper, hasTimer: false }
        });
        const migrated = runMigration(30, state);

        expect(migrated.customThemes).toStrictEqual(initialCustomThemesState);
        expect(migrated.settings).toMatchObject({ theme: ThemeEnum.Newspaper, hasTimer: false });
    });

    it('should migrate stored custom themes to the semantic token vocabulary', () => {
        expect.assertions(4);

        const storedTheme = createCustomTheme('Legacy', ThemeEnum.Colorful, [], 1700000000000);
        const state = buildState({ customThemes: { themes: [storedTheme] } });
        const [migrated] = runMigration(31, state).customThemes.themes;

        expect(migrated.schemaVersion).toBe(CustomThemeSchemaVersion);
        expect(migrated.colors[ColorSchemaEnum.Light]).toStrictEqual(ColorfulLightTheme.colors);
        expect(migrated.colors[ColorSchemaEnum.Dark]).toStrictEqual(ColorfulDarkTheme.colors);
        expect(migrated.name).toBe('Legacy');
    });

    it('should keep an empty custom themes slice unchanged at the semantic token migration', () => {
        expect.assertions(1);

        expect(runMigration(31, buildState()).customThemes).toStrictEqual(initialCustomThemesState);
    });

    it('should keep the Hell difficulty entry in the history after migration 32', () => {
        expect.assertions(1);

        const state = buildState();

        expect(Object.keys(runMigration(32, state).game.historyByDifficulty)).toStrictEqual(
            Object.keys(initialGameState.historyByDifficulty)
        );
    });

    it('should backfill the missing Hell history entry when Hell predates the persisted state entirely', () => {
        expect.assertions(1);

        const legacyHistoryByDifficulty = withoutKeyAtRuntime(initialGameState.historyByDifficulty, DifficultyEnum.Hell);
        const legacyState = buildState({ game: { ...initialGameState, historyByDifficulty: legacyHistoryByDifficulty } });
        const migrated = runMigration(32, legacyState);

        expect(Object.keys(migrated.game.historyByDifficulty)).toStrictEqual(Object.keys(initialGameState.historyByDifficulty));
    });

    it('should drop the now-unknown hell queue key while leaving the rest of the state untouched', () => {
        expect.assertions(2);

        const state = buildState({ settings: { ...initialSettingsState, hasTimer: false } });
        const legacyState = withExtraKeyAtRuntime(state, 'hellQueue', { entries: [{ id: 'stale-entry' }] });
        const migrated = runMigration(33, legacyState);

        expect(Reflect.has(migrated, 'hellQueue')).toBe(false);
        expect(migrated).toStrictEqual(state);
    });

    it('should leave persisted state unchanged at migration 33 when no hell queue key is present', () => {
        expect.assertions(1);

        const state = buildState();

        expect(runMigration(33, state)).toStrictEqual(state);
    });
});
