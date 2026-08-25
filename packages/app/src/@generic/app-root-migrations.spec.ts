/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it, jest } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
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
import { getDayNumber } from './utils/get-day-number.util';

import type { AppRootPersistedStateInterface } from './app-root-migrations';
import type { GameCellTimelineEventInterface } from '../game/interface/game-timeline-event.interface';
import type { SettingsState } from '../settings/store/settings.state';

jest.mock('react-native', () => ({
    Appearance: {
        getColorScheme: () => 'light'
    }
}));

jest.mock('./utils/i18n.util', () => ({
    i18nGetOSLocale: () => 'en'
}));

const migrationVersions = Object.keys(appRootMigrations).map(Number);

const LastReleasedPersistVersion = 33;

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

const LegacyEasyCompletedAt = new Date(2026, 0, 1, 12).getTime();
const LegacyHardCompletedAt = new Date(2026, 0, 2, 12).getTime();
const LegacyPlayedDayNumber = 20688;

const ratedEasyCompletedGame = {
    encodedState: 'legacy-state',
    difficulty: DifficultyEnum.Easy,
    rating: 0,
    isRatingCeiling: false,
    elapsedTime: 60,
    score: 100,
    mistakes: 0,
    maxMistakes: 3,
    completedAt: LegacyEasyCompletedAt
};

const legacyEasyCompletedGame = withoutKeyAtRuntime(withoutKeyAtRuntime(ratedEasyCompletedGame, 'rating'), 'isRatingCeiling');

const legacyHardCompletedGame = {
    encodedState: 'rated-state',
    difficulty: DifficultyEnum.Hard,
    rating: 8.5,
    isRatingCeiling: true,
    elapsedTime: 30,
    score: 50,
    mistakes: 1,
    maxMistakes: 3,
    completedAt: LegacyHardCompletedAt
};

const legacyUndoneMove: GameCellTimelineEventInterface = {
    kind: TimelineEventKindEnum.Cell,
    cellIndex: 12,
    value: 3,
    ts: 1000
};

const buildLegacyReleasedState = (): AppRootPersistedStateInterface => {
    const storedHistoryByDifficulty = withoutKeyAtRuntime(
        withoutKeyAtRuntime(
            {
                ...initialGameState.historyByDifficulty,
                [DifficultyEnum.Easy]: { ...emptyGameHistory, difficulty: DifficultyEnum.Easy, completedGames: [legacyEasyCompletedGame] },
                [DifficultyEnum.Hard]: { ...emptyGameHistory, difficulty: DifficultyEnum.Hard, completedGames: [legacyHardCompletedGame] }
            },
            DifficultyEnum.Hell
        ),
        DifficultyEnum.Infinity
    );
    const storedGame = withoutKeyAtRuntime(
        withoutKeyAtRuntime(
            withoutKeyAtRuntime(
                {
                    ...initialGameState,
                    score: 700,
                    historyByDifficulty: storedHistoryByDifficulty,
                    playedDayNumbers: [LegacyPlayedDayNumber],
                    techniqueUsageCounts: { 2: 5 },
                    undoneMoves: [legacyUndoneMove]
                },
                'dailyDayNumber'
            ),
            'dailyCompletedDayNumbers'
        ),
        'dailyBestStreak'
    );
    const storedSettings = withoutKeyAtRuntime(
        withoutKeyAtRuntime(withoutKeyAtRuntime({ ...initialSettingsState, hasTimer: false }, 'calmMode'), 'motionPreference'),
        'comfortModeRestore'
    );

    return buildState({ game: storedGame, settings: storedSettings });
};

const collapsedLegacyReleasedState: AppRootPersistedStateInterface = {
    game: {
        ...initialGameState,
        score: 700,
        techniqueUsageCounts: { 2: 5 },
        undoneMoves: [],
        playedDayNumbers: [getDayNumber(LegacyEasyCompletedAt), getDayNumber(LegacyHardCompletedAt), LegacyPlayedDayNumber],
        historyByDifficulty: {
            ...initialGameState.historyByDifficulty,
            [DifficultyEnum.Easy]: {
                ...emptyGameHistory,
                difficulty: DifficultyEnum.Easy,
                bestRating: { rating: 0, isRatingCeiling: false },
                completedGames: [ratedEasyCompletedGame]
            },
            [DifficultyEnum.Hard]: {
                ...emptyGameHistory,
                difficulty: DifficultyEnum.Hard,
                bestRating: { rating: 8.5, isRatingCeiling: true },
                completedGames: [legacyHardCompletedGame]
            }
        }
    },
    settings: { ...initialSettingsState, hasTimer: false },
    customThemes: initialCustomThemesState
};

describe('appRootMigrations', () => {
    it('should persist at the newest migration version', () => {
        expect.assertions(1);

        expect(appRootPersistVersion).toBe(Math.max(...migrationVersions));
    });

    it('should keep the released manifest free of version gaps', () => {
        expect.assertions(1);

        const releasedVersions = migrationVersions
            .filter(version => version <= LastReleasedPersistVersion)
            .sort((firstVersion, secondVersion) => firstVersion - secondVersion);

        expect(releasedVersions).toStrictEqual(releasedVersions.map((_, index) => releasedVersions[0] + index));
    });

    it('should reach the newest version from the last released version in a single collapsed step', () => {
        expect.assertions(1);

        expect(migrationVersions.filter(version => version > LastReleasedPersistVersion)).toStrictEqual([appRootPersistVersion]);
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

    it('should backfill the unknown rating sentinel onto a completed game recorded before rating existed', () => {
        expect.assertions(2);

        const legacyCompletedGame = withoutKeyAtRuntime(
            withoutKeyAtRuntime(
                {
                    encodedState: 'legacy-state',
                    difficulty: DifficultyEnum.Easy,
                    rating: 0,
                    isRatingCeiling: false,
                    elapsedTime: 60,
                    score: 100,
                    mistakes: 0,
                    maxMistakes: 3,
                    completedAt: 1700000000000
                },
                'rating'
            ),
            'isRatingCeiling'
        );
        const state = buildState({
            game: {
                ...initialGameState,
                historyByDifficulty: {
                    ...initialGameState.historyByDifficulty,
                    [DifficultyEnum.Easy]: { ...emptyGameHistory, completedGames: [legacyCompletedGame] }
                }
            }
        });
        const [migratedCompletedGame] = runMigration(41, state).game.historyByDifficulty[DifficultyEnum.Easy].completedGames;

        expect(migratedCompletedGame).toMatchObject({ rating: 0, isRatingCeiling: false, score: 100 });
        expect(migratedCompletedGame.encodedState).toBe('legacy-state');
    });

    it('should keep an already-rated completed game untouched', () => {
        expect.assertions(1);

        const ratedCompletedGame = {
            encodedState: 'rated-state',
            difficulty: DifficultyEnum.Hard,
            rating: 3.4,
            isRatingCeiling: false,
            elapsedTime: 30,
            score: 50,
            mistakes: 1,
            maxMistakes: 3,
            completedAt: 1700000001000
        };
        const state = buildState({
            game: {
                ...initialGameState,
                historyByDifficulty: {
                    ...initialGameState.historyByDifficulty,
                    [DifficultyEnum.Hard]: { ...emptyGameHistory, completedGames: [ratedCompletedGame] }
                }
            }
        });

        expect(runMigration(41, state).game.historyByDifficulty[DifficultyEnum.Hard].completedGames).toStrictEqual([ratedCompletedGame]);
    });

    it('should backfill the unknown rating sentinel onto the in-progress game state', () => {
        expect.assertions(2);

        const legacyGameState = withoutKeyAtRuntime(withoutKeyAtRuntime(initialGameState, 'rating'), 'isRatingCeiling');
        const state = buildState({ game: legacyGameState });
        const migrated = runMigration(41, state);

        expect(migrated.game.rating).toBe(0);
        expect(migrated.game.isRatingCeiling).toBe(false);
    });

    it('should keep the Infinity difficulty entry in the history after the collapsed migration', () => {
        expect.assertions(1);

        const state = buildState();

        expect(Object.keys(runMigration(41, state).game.historyByDifficulty)).toStrictEqual(
            Object.keys(initialGameState.historyByDifficulty)
        );
    });

    it('should backfill the missing Infinity history entry when Infinity predates the persisted state entirely', () => {
        expect.assertions(1);

        const legacyHistoryByDifficulty = withoutKeyAtRuntime(initialGameState.historyByDifficulty, DifficultyEnum.Infinity);
        const legacyState = buildState({ game: { ...initialGameState, historyByDifficulty: legacyHistoryByDifficulty } });
        const migrated = runMigration(41, legacyState);

        expect(Object.keys(migrated.game.historyByDifficulty)).toStrictEqual(Object.keys(initialGameState.historyByDifficulty));
    });

    it('should backfill the best rating from the highest rated completed game, ignoring rating-0 games', () => {
        expect.assertions(1);

        const legacyCompletedGames = [
            {
                encodedState: '',
                difficulty: DifficultyEnum.Easy,
                rating: 0,
                isRatingCeiling: false,
                elapsedTime: 1,
                score: 1,
                mistakes: 0,
                maxMistakes: 3,
                completedAt: 1
            },
            {
                encodedState: '',
                difficulty: DifficultyEnum.Easy,
                rating: 3.4,
                isRatingCeiling: false,
                elapsedTime: 1,
                score: 1,
                mistakes: 0,
                maxMistakes: 3,
                completedAt: 2
            },
            {
                encodedState: '',
                difficulty: DifficultyEnum.Easy,
                rating: 8.5,
                isRatingCeiling: true,
                elapsedTime: 1,
                score: 1,
                mistakes: 0,
                maxMistakes: 3,
                completedAt: 3
            }
        ];
        const state = buildState({
            game: {
                ...initialGameState,
                historyByDifficulty: {
                    ...initialGameState.historyByDifficulty,
                    [DifficultyEnum.Easy]: { ...emptyGameHistory, completedGames: legacyCompletedGames }
                }
            }
        });

        const migratedHistory = runMigration(41, state).game.historyByDifficulty[DifficultyEnum.Easy];

        expect(migratedHistory.bestRating).toStrictEqual({ rating: 8.5, isRatingCeiling: true });
    });

    it('should default the best rating to the empty snapshot when a difficulty has no rated completed games', () => {
        expect.assertions(1);

        const state = buildState();

        const migratedHistory = runMigration(41, state).game.historyByDifficulty[DifficultyEnum.Easy];

        expect(migratedHistory.bestRating).toStrictEqual({ rating: 0, isRatingCeiling: false });
    });

    it('should default technique usage counts to empty rather than fabricating them from completed-game history', () => {
        expect.assertions(1);

        const legacyCompletedGame = {
            encodedState: 'legacy-handoff-payload',
            difficulty: DifficultyEnum.Easy,
            rating: 4.2,
            isRatingCeiling: false,
            elapsedTime: 1,
            score: 1,
            mistakes: 0,
            maxMistakes: 3,
            completedAt: 1
        };
        const state = buildState({
            game: {
                ...initialGameState,
                historyByDifficulty: {
                    ...initialGameState.historyByDifficulty,
                    [DifficultyEnum.Easy]: { ...emptyGameHistory, completedGames: [legacyCompletedGame] }
                }
            }
        });

        expect(runMigration(41, state).game.techniqueUsageCounts).toStrictEqual({});
    });

    it('should keep already-populated technique usage counts untouched', () => {
        expect.assertions(1);

        const state = buildState({
            game: { ...initialGameState, techniqueUsageCounts: { 2: 5 } }
        });

        expect(runMigration(41, state).game.techniqueUsageCounts).toStrictEqual({ 2: 5 });
    });

    it('should backfill played day numbers from completed wins only', () => {
        expect.assertions(1);

        const dayOneCompletedAt = new Date(2026, 0, 1, 12).getTime();
        const dayTwoCompletedAt = new Date(2026, 0, 2, 12).getTime();
        const buildLegacyCompletedGame = (completedAt: number) => ({
            encodedState: '',
            difficulty: DifficultyEnum.Easy,
            rating: 0,
            isRatingCeiling: false,
            elapsedTime: 1,
            score: 1,
            mistakes: 0,
            maxMistakes: 3,
            completedAt
        });
        const legacyCompletedGames = [buildLegacyCompletedGame(dayOneCompletedAt), buildLegacyCompletedGame(dayTwoCompletedAt)];
        const state = buildState({
            game: {
                ...initialGameState,
                historyByDifficulty: {
                    ...initialGameState.historyByDifficulty,
                    [DifficultyEnum.Easy]: { ...emptyGameHistory, completedGames: legacyCompletedGames }
                }
            }
        });

        const migratedGameState = runMigration(41, state).game;
        const dayOneNumber = getDayNumber(dayOneCompletedAt);
        const dayTwoNumber = getDayNumber(dayTwoCompletedAt);

        expect(migratedGameState.playedDayNumbers).toStrictEqual([dayOneNumber, dayTwoNumber]);
    });

    it('should merge backfilled day numbers with any already-recorded activity instead of discarding it', () => {
        expect.assertions(1);

        const alreadyPlayedDayNumber = getDayNumber(new Date(2020, 0, 1, 12).getTime());
        const state = buildState({
            game: { ...initialGameState, playedDayNumbers: [alreadyPlayedDayNumber] }
        });

        expect(runMigration(41, state).game.playedDayNumbers).toStrictEqual([alreadyPlayedDayNumber]);
    });

    it('should backfill the comfort preferences at the collapsed migration without touching stored choices', () => {
        expect.assertions(3);

        const storedSettings = withoutKeyAtRuntime(
            withoutKeyAtRuntime({ ...initialSettingsState, hasTimer: false }, 'calmMode'),
            'motionPreference'
        );
        const migrated = runMigration(41, buildState({ settings: storedSettings }));

        expect(migrated.settings.motionPreference).toBe('system');
        expect(migrated.settings.calmMode).toBe(false);
        expect(migrated.settings.hasTimer).toBe(false);
    });

    it('should rehydrate a pre-comfort-mode state with the preset off and nothing else touched', () => {
        expect.assertions(6);

        const legacySettings: SettingsState = { ...initialSettingsState, fontSize: 'xs', theme: ThemeEnum.Newspaper };
        const storedSettings = withoutKeyAtRuntime(
            withoutKeyAtRuntime(withoutKeyAtRuntime(legacySettings, 'comfortMode'), 'comfortModeOfferDismissed'),
            'comfortModeRestore'
        );
        const migrated = runMigration(41, buildState({ settings: storedSettings }));

        expect(migrated.settings.comfortMode).toBe('off');
        expect(migrated.settings.comfortModeOfferDismissed).toBe(false);
        expect(migrated.settings.comfortModeRestore).toBeNull();
        expect(migrated.settings.fontSize).toBe('xs');
        expect(migrated.settings.theme).toBe(ThemeEnum.Newspaper);
        expect(migrated.settings.hasTimer).toBe(initialSettingsState.hasTimer);
    });
    it('should seed the daily challenge record at the collapsed migration without touching anything else', () => {
        expect.assertions(4);

        const storedGame = withoutKeyAtRuntime(
            withoutKeyAtRuntime(
                withoutKeyAtRuntime({ ...initialGameState, playedDayNumbers: [20688], score: 500 }, 'dailyCompletedDayNumbers'),
                'dailyBestStreak'
            ),
            'dailyDayNumber'
        );
        const migrated = runMigration(41, buildState({ game: storedGame }));

        expect(migrated.game.dailyCompletedDayNumbers).toStrictEqual([]);
        expect(migrated.game.dailyBestStreak).toBe(0);
        expect(migrated.game.dailyDayNumber).toBe(0);
        expect(migrated.game.playedDayNumbers).toStrictEqual([20688]);
    });

    it('should never resume a stored run as a daily challenge', () => {
        expect.assertions(1);

        const storedGame = { ...initialGameState, dailyDayNumber: 20688 };

        expect(runMigration(41, buildState({ game: storedGame })).game.dailyDayNumber).toBe(0);
    });

    it('should drop a stored redo stack', () => {
        expect.assertions(1);

        const storedGame = { ...initialGameState, undoneMoves: [legacyUndoneMove] };

        expect(runMigration(41, buildState({ game: storedGame })).game.undoneMoves).toStrictEqual([]);
    });

    it('should migrate a released v33 state into the exact collapsed shape', () => {
        expect.assertions(1);

        expect(runMigration(41, buildLegacyReleasedState())).toStrictEqual(collapsedLegacyReleasedState);
    });

    it('should land on the same shape when replayed over an already-collapsed state', () => {
        expect.assertions(1);

        const migrated = runMigration(41, buildLegacyReleasedState());

        expect(runMigration(41, migrated)).toStrictEqual(migrated);
    });
});
