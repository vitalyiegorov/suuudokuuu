import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

import { gameSlice } from '../game/store/game.slice';
import { initialGameState } from '../game/store/game.state';
import { HellQueueEntrySchema } from '../hell-queue/schema/hell-queue-entry.schema';
import { hellQueueSlice } from '../hell-queue/store/hell-queue.slice';
import { initialHellQueueState } from '../hell-queue/store/hell-queue.state';
import { emptyGameHistory } from '../history/interfaces/history-game.interface';
import { settingsSlice } from '../settings/store/settings.slice';
import { initialSettingsState } from '../settings/store/settings.state';
import { ColorSchemaEnum } from '../theme/enum/color-schema.enum';
import { ThemeEnum } from '../theme/enum/theme.enum';
import { CustomThemeSchemaVersion } from '../theme/schema/custom-theme.schema';
import { customThemesSlice } from '../theme/store/custom-themes.slice';
import { initialCustomThemesState } from '../theme/store/custom-themes.state';
import { getTheme } from '../theme/utils/get-theme.util';
import { migrateCustomThemeColors } from '../theme/utils/migrate-custom-theme-colors.util';

import type { GameState } from '../game/store/game.state';
import type { HellQueueState } from '../hell-queue/store/hell-queue.state';
import type { SettingsState } from '../settings/store/settings.state';
import type { CustomThemesState } from '../theme/store/custom-themes.state';
import type { MigrationManifest } from 'redux-persist/es/types';

export interface AppRootPersistedStateInterface {
    [gameSlice.name]: GameState;
    [settingsSlice.name]: SettingsState;
    [customThemesSlice.name]: CustomThemesState;
    [hellQueueSlice.name]: HellQueueState;
}

export const appRootPersistVersion = 32;

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

const introduceHellDifficultyAndQueue = (state: AppRootPersistedStateInterface): AppRootPersistedStateInterface => {
    const gameState = state[gameSlice.name];
    const rawHellQueueState = state[hellQueueSlice.name];
    const rawEntries = isDefined(rawHellQueueState) && Array.isArray(rawHellQueueState.entries) ? rawHellQueueState.entries : [];
    const validEntries = rawEntries.filter(entry => HellQueueEntrySchema.safeParse(entry).success);

    return {
        ...state,
        [gameSlice.name]: {
            ...gameState,
            historyByDifficulty: {
                ...initialGameState.historyByDifficulty,
                ...gameState.historyByDifficulty
            }
        },
        [hellQueueSlice.name]: { ...initialHellQueueState, entries: validEntries }
    };
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
    32: introduceHellDifficultyAndQueue
};
