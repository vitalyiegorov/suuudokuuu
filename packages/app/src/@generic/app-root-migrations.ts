import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { gameSlice } from '../game/store/game.slice';
import { initialGameState } from '../game/store/game.state';
import { emptyGameHistory } from '../history/interfaces/history-game.interface';
import { emptyHistoryRatingSnapshot } from '../history/interfaces/history-rating-snapshot.interface';
import { historyGetCompletedGames } from '../history/utils/history-get-completed-games.util';
import { settingsSlice } from '../settings/store/settings.slice';
import { initialSettingsState } from '../settings/store/settings.state';
import { ColorSchemaEnum } from '../theme/enum/color-schema.enum';
import { ThemeEnum } from '../theme/enum/theme.enum';
import { CustomThemeSchemaVersion } from '../theme/schema/custom-theme.schema';
import { customThemesSlice } from '../theme/store/custom-themes.slice';
import { initialCustomThemesState } from '../theme/store/custom-themes.state';
import { getTheme } from '../theme/utils/get-theme.util';
import { migrateCustomThemeColors } from '../theme/utils/migrate-custom-theme-colors.util';

import { getDayNumber } from './utils/get-day-number.util';

import type { GameState } from '../game/store/game.state';
import type { CompletedGameInterface } from '../history/interfaces/completed-game.interface';
import type { HistoryGameInterface } from '../history/interfaces/history-game.interface';
import type { HistoryRatingSnapshotInterface } from '../history/interfaces/history-rating-snapshot.interface';
import type { SettingsState } from '../settings/store/settings.state';
import type { CustomThemesState } from '../theme/store/custom-themes.state';
import type { MigrationManifest } from 'redux-persist/es/types';

export interface AppRootPersistedStateInterface {
    [gameSlice.name]: GameState;
    [settingsSlice.name]: SettingsState;
    [customThemesSlice.name]: CustomThemesState;
}

export const appRootPersistVersion = 37;

const resetBestScores = (state: AppRootPersistedStateInterface): AppRootPersistedStateInterface => {
    const gameState = state[gameSlice.name];
    const resetHistory = { ...gameState.historyByDifficulty };

    Object.keys(resetHistory).forEach(key => {
        resetHistory[key as keyof typeof resetHistory].bestScore = 0;
    });

    return {
        ...state,
        [gameSlice.name]: { ...gameState, historyByDifficulty: resetHistory }
    };
};

const ensureHistoryEntryDefaults = (state: AppRootPersistedStateInterface): AppRootPersistedStateInterface => {
    const gameState = state[gameSlice.name];
    const updatedHistory = { ...gameState.historyByDifficulty };

    Object.keys(updatedHistory).forEach(key => {
        const historyEntry = updatedHistory[key as keyof typeof updatedHistory];
        updatedHistory[key as keyof typeof updatedHistory] = {
            ...emptyGameHistory,
            ...historyEntry
        };
    });

    return {
        ...state,
        [gameSlice.name]: { ...gameState, historyByDifficulty: updatedHistory }
    };
};

const ensureAllDifficulties = (state: AppRootPersistedStateInterface): AppRootPersistedStateInterface => {
    const gameState = state[gameSlice.name];

    return {
        ...state,
        [gameSlice.name]: {
            ...gameState,
            historyByDifficulty: {
                ...initialGameState.historyByDifficulty,
                ...gameState.historyByDifficulty
            }
        }
    };
};

const migrateSolutionStepsToTimelineEvents = (state: AppRootPersistedStateInterface): AppRootPersistedStateInterface => ({
    ...state,
    [gameSlice.name]: { ...initialGameState, ...state[gameSlice.name], timelineEvents: [], challengeTimelineEvents: [] },
    [settingsSlice.name]: { ...initialSettingsState, ...state[settingsSlice.name] }
});

const backfillRunDifficulty = (state: AppRootPersistedStateInterface): AppRootPersistedStateInterface => {
    const gameState = { ...initialGameState, ...state[gameSlice.name] };
    const fieldLength = defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize;
    const difficulty =
        gameState.sudokuString.length === fieldLength
            ? Sudoku.convertFieldFromString(gameState.sudokuString, defaultSudokuConfig)[1]
            : initialGameState.difficulty;

    return {
        ...state,
        [gameSlice.name]: { ...gameState, difficulty }
    };
};

const introduceCustomThemes = (state: AppRootPersistedStateInterface): AppRootPersistedStateInterface => ({
    ...state,
    [customThemesSlice.name]: { ...initialCustomThemesState, ...state[customThemesSlice.name] },
    [settingsSlice.name]: { ...initialSettingsState, ...state[settingsSlice.name] }
});

const mapHistoryByDifficultyEntries = (
    state: AppRootPersistedStateInterface,
    mapEntry: (historyEntry: HistoryGameInterface) => HistoryGameInterface
): AppRootPersistedStateInterface => {
    const gameState = { ...initialGameState, ...state[gameSlice.name] };
    const updatedHistory = { ...gameState.historyByDifficulty };

    Object.keys(updatedHistory).forEach(key => {
        updatedHistory[key as keyof typeof updatedHistory] = mapEntry(updatedHistory[key as keyof typeof updatedHistory]);
    });

    return {
        ...state,
        [gameSlice.name]: { ...gameState, historyByDifficulty: updatedHistory }
    };
};

const legacyCompletedGameRatingDefaults = { rating: 0, isRatingCeiling: false };

const backfillCompletedGameRatings = (state: AppRootPersistedStateInterface): AppRootPersistedStateInterface =>
    mapHistoryByDifficultyEntries(state, historyEntry => ({
        ...historyEntry,
        completedGames: historyEntry.completedGames.map(completedGame => ({
            ...legacyCompletedGameRatingDefaults,
            ...completedGame
        }))
    }));

const dropHellQueue = (state: AppRootPersistedStateInterface): AppRootPersistedStateInterface => {
    const clone = { ...state };

    Reflect.deleteProperty(clone, 'hellQueue');

    return clone;
};

const migrateCustomThemesToSemanticTokens = (state: AppRootPersistedStateInterface): AppRootPersistedStateInterface => {
    const customThemesState = { ...initialCustomThemesState, ...state[customThemesSlice.name] };
    const themes = customThemesState.themes.map(theme => {
        const sourceTheme = Object.values(ThemeEnum).includes(theme.sourceTheme) ? theme.sourceTheme : ThemeEnum.BlackAndWhite;
        const storedColors: Partial<Record<ColorSchemaEnum, unknown>> = { ...theme.colors };

        return {
            ...theme,
            schemaVersion: CustomThemeSchemaVersion,
            colors: {
                [ColorSchemaEnum.Light]: migrateCustomThemeColors(
                    storedColors[ColorSchemaEnum.Light],
                    getTheme(sourceTheme, ColorSchemaEnum.Light).colors
                ),
                [ColorSchemaEnum.Dark]: migrateCustomThemeColors(
                    storedColors[ColorSchemaEnum.Dark],
                    getTheme(sourceTheme, ColorSchemaEnum.Dark).colors
                )
            }
        };
    });

    return {
        ...state,
        [customThemesSlice.name]: { ...customThemesState, themes }
    };
};

const computeBestRatingFromCompletedGames = (completedGames: readonly CompletedGameInterface[]): HistoryRatingSnapshotInterface =>
    completedGames.reduce<HistoryRatingSnapshotInterface>(
        (best, completedGame) =>
            completedGame.rating > 0 && completedGame.rating > best.rating
                ? { rating: completedGame.rating, isRatingCeiling: completedGame.isRatingCeiling }
                : best,
        emptyHistoryRatingSnapshot
    );

const backfillStatsPack = (state: AppRootPersistedStateInterface): AppRootPersistedStateInterface => {
    const migratedState = mapHistoryByDifficultyEntries(state, historyEntry => {
        const defaultedEntry = { ...emptyGameHistory, ...historyEntry };

        return { ...defaultedEntry, bestRating: computeBestRatingFromCompletedGames(defaultedEntry.completedGames) };
    });
    const migratedGameState = migratedState[gameSlice.name];

    return {
        ...migratedState,
        [gameSlice.name]: {
            ...migratedGameState,
            techniqueUsageCounts: { ...initialGameState.techniqueUsageCounts, ...migratedGameState.techniqueUsageCounts }
        }
    };
};

const backfillPlayedDayNumbersFromCompletedWins = (state: AppRootPersistedStateInterface): AppRootPersistedStateInterface => {
    const gameState = { ...initialGameState, ...state[gameSlice.name] };
    const winDayNumbers = historyGetCompletedGames(gameState.historyByDifficulty).map(completedGame =>
        getDayNumber(completedGame.completedAt)
    );
    const playedDayNumbers = Array.from(new Set([...gameState.playedDayNumbers, ...winDayNumbers])).sort(
        (firstDayNumber, secondDayNumber) => firstDayNumber - secondDayNumber
    );

    return {
        ...state,
        [gameSlice.name]: { ...gameState, playedDayNumbers }
    };
};

export const appRootMigrations: MigrationManifest<AppRootPersistedStateInterface> = {
    12: state => ({
        ...state,
        [gameSlice.name]: {
            ...initialGameState,
            ...state[gameSlice.name],
            historyByDifficulty: {
                ...initialGameState.historyByDifficulty,
                // @ts-expect-error Migrating old state
                // eslint-disable-next-line  @typescript-eslint/no-unsafe-member-access
                ...(state.history?.byDifficulty as unknown as GameState['historyByDifficulty'])
            }
        }
    }),
    13: state => ({ ...state, [gameSlice.name]: { ...initialGameState, ...state[gameSlice.name] } }),
    14: state => ({ ...state, [settingsSlice.name]: { ...initialSettingsState, ...state[settingsSlice.name] } }),
    15: resetBestScores,
    16: ensureHistoryEntryDefaults,
    17: ensureAllDifficulties,
    18: ensureHistoryEntryDefaults,
    19: state => ({ ...state, [settingsSlice.name]: { ...initialSettingsState, ...state[settingsSlice.name] } }),
    20: state => ({ ...state, [settingsSlice.name]: { ...initialSettingsState, ...state[settingsSlice.name] } }),
    21: state => ({ ...state, [settingsSlice.name]: { ...initialSettingsState, ...state[settingsSlice.name] } }),
    22: state => ({ ...state, [gameSlice.name]: { ...initialGameState, ...state[gameSlice.name] } }),
    23: state => ({ ...state, [gameSlice.name]: { ...initialGameState, ...state[gameSlice.name] } }),
    24: state => ({ ...state, [gameSlice.name]: { ...initialGameState, ...state[gameSlice.name] } }),
    25: state => ({ ...state, [gameSlice.name]: { ...initialGameState, ...state[gameSlice.name] } }),
    26: state => ({ ...state, [settingsSlice.name]: { ...initialSettingsState, ...state[settingsSlice.name] } }),
    27: state => ({ ...state, [settingsSlice.name]: { ...initialSettingsState, ...state[settingsSlice.name] } }),
    28: migrateSolutionStepsToTimelineEvents,
    29: backfillRunDifficulty,
    30: introduceCustomThemes,
    31: migrateCustomThemesToSemanticTokens,
    32: ensureAllDifficulties,
    33: dropHellQueue,
    34: backfillCompletedGameRatings,
    35: ensureAllDifficulties,
    36: backfillStatsPack,
    37: backfillPlayedDayNumbersFromCompletedWins
};
