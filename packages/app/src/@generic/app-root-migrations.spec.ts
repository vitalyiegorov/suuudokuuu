/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it, jest } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { initialGameState } from '../game/store/game.state';
import { emptyGameHistory } from '../history/interfaces/history-game.interface';
import { initialSettingsState } from '../settings/store/settings.state';

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
    ...overrides
});

const runMigration = (version: number, state: AppRootPersistedStateInterface): AppRootPersistedStateInterface =>
    appRootMigrations[version](state);

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
});
