import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import * as Option from 'effect/Option';
import * as Schema from 'effect/Schema';

import { DifficultySchema } from '../../@generic/schema/difficulty.schema';
import { getDayNumber } from '../../@generic/utils/get-day-number.util';
import { ColorSchemaEnum } from '../../custom-theme/enum/color-schema.enum';
import { ThemeEnum } from '../../custom-theme/enum/theme.enum';
import { emptyLegacyHistory, emptyLegacyRatingSnapshot, legacyInitialGameState } from '../constant/legacy-initial-state.constant';

import { migrateCustomThemeColors } from './migrate-custom-theme-colors.util';

import type { ThemeColorsType } from '../../custom-theme/type/theme-colors.type';
import type { SettingsType } from '../../settings/type/settings.type';
import type {
    LegacyGameStateInterface,
    LegacyHistoryInterface,
    LegacyRatingSnapshotInterface,
    LegacyRootStateInterface
} from '../interface/legacy-root-state.interface';

export const LegacyPersistVersion = 42;

type LegacyMigrationType = (state: LegacyRootStateInterface) => LegacyRootStateInterface;

const CustomThemeSchemaVersion = 2;
const initialCustomThemesState: LegacyRootStateInterface['customThemes'] = { themes: [] };
const isDifficulty = Schema.is(DifficultySchema);

const FirstHistorySchema = Schema.Struct({ history: Schema.Struct({ byDifficulty: Schema.Record(Schema.String, Schema.Unknown) }) });
const decodeFirstHistory = Schema.decodeUnknownOption(FirstHistorySchema);

const resetBestScores = (state: LegacyRootStateInterface): LegacyRootStateInterface => {
    const gameState = state.game;
    const resetHistory = { ...gameState.historyByDifficulty };

    Object.keys(resetHistory)
        .filter(isDifficulty)
        .forEach(difficulty => {
            resetHistory[difficulty].bestScore = 0;
        });

    return {
        ...state,
        game: { ...gameState, historyByDifficulty: resetHistory }
    };
};

const ensureHistoryEntryDefaults = (state: LegacyRootStateInterface): LegacyRootStateInterface => {
    const gameState = state.game;
    const updatedHistory = { ...gameState.historyByDifficulty };

    Object.keys(updatedHistory)
        .filter(isDifficulty)
        .forEach(difficulty => {
            updatedHistory[difficulty] = { ...emptyLegacyHistory, ...updatedHistory[difficulty] };
        });

    return {
        ...state,
        game: { ...gameState, historyByDifficulty: updatedHistory }
    };
};

const ensureAllDifficulties = (state: LegacyRootStateInterface): LegacyRootStateInterface => {
    const gameState = state.game;

    return {
        ...state,
        game: {
            ...gameState,
            historyByDifficulty: {
                ...legacyInitialGameState.historyByDifficulty,
                ...gameState.historyByDifficulty
            }
        }
    };
};

const backfillRunDifficulty = (state: LegacyRootStateInterface): LegacyRootStateInterface => {
    const gameState = { ...legacyInitialGameState, ...state.game };
    const fieldLength = defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize;
    const difficulty =
        gameState.sudokuString.length === fieldLength
            ? Sudoku.convertFieldFromString(gameState.sudokuString, defaultSudokuConfig)[1]
            : legacyInitialGameState.difficulty;

    return {
        ...state,
        game: { ...gameState, difficulty }
    };
};

const mapHistoryByDifficultyEntries = (
    state: LegacyRootStateInterface,
    mapEntry: (historyEntry: LegacyHistoryInterface) => LegacyHistoryInterface
): LegacyRootStateInterface => {
    const gameState = { ...legacyInitialGameState, ...state.game };
    const updatedHistory = { ...gameState.historyByDifficulty };

    Object.keys(updatedHistory)
        .filter(isDifficulty)
        .forEach(difficulty => {
            updatedHistory[difficulty] = mapEntry(updatedHistory[difficulty]);
        });

    return {
        ...state,
        game: { ...gameState, historyByDifficulty: updatedHistory }
    };
};

const legacyCompletedGameRatingDefaults = { rating: 0, isRatingCeiling: false };

const backfillCompletedGameRatings = (state: LegacyRootStateInterface): LegacyRootStateInterface =>
    mapHistoryByDifficultyEntries(state, historyEntry => ({
        ...historyEntry,
        completedGames: historyEntry.completedGames.map(completedGame => ({
            ...legacyCompletedGameRatingDefaults,
            ...completedGame
        }))
    }));

const dropHellQueue = (state: LegacyRootStateInterface): LegacyRootStateInterface => {
    const clone = { ...state };

    Reflect.deleteProperty(clone, 'hellQueue');

    return clone;
};

const computeBestRatingFromCompletedGames = (completedGames: readonly LegacyRatingSnapshotInterface[]): LegacyRatingSnapshotInterface =>
    completedGames.reduce<LegacyRatingSnapshotInterface>(
        (best, completedGame) =>
            completedGame.rating > 0 && completedGame.rating > best.rating
                ? { rating: completedGame.rating, isRatingCeiling: completedGame.isRatingCeiling }
                : best,
        emptyLegacyRatingSnapshot
    );

const backfillStatsPack = (state: LegacyRootStateInterface): LegacyRootStateInterface => {
    const migratedState = mapHistoryByDifficultyEntries(state, historyEntry => {
        const defaultedEntry = { ...emptyLegacyHistory, ...historyEntry };

        return { ...defaultedEntry, bestRating: computeBestRatingFromCompletedGames(defaultedEntry.completedGames) };
    });
    const migratedGameState = migratedState.game;

    return {
        ...migratedState,
        game: {
            ...migratedGameState,
            techniqueUsageCounts: { ...legacyInitialGameState.techniqueUsageCounts, ...migratedGameState.techniqueUsageCounts }
        }
    };
};

const backfillPlayedDayNumbersFromCompletedWins = (state: LegacyRootStateInterface): LegacyRootStateInterface => {
    const gameState: LegacyGameStateInterface = { ...legacyInitialGameState, ...state.game };
    const winDayNumbers = Object.values(gameState.historyByDifficulty)
        .flatMap(history => history.completedGames)
        .map(completedGame => getDayNumber(completedGame.completedAt));
    const playedDayNumbers = Array.from(new Set([...gameState.playedDayNumbers, ...winDayNumbers])).sort(
        (firstDayNumber, secondDayNumber) => firstDayNumber - secondDayNumber
    );

    return {
        ...state,
        game: { ...gameState, playedDayNumbers }
    };
};

const ComfortModePersistedKeys = ['comfortMode', 'comfortModeOfferDismissed', 'comfortModeRestore'] as const;

const dropComfortMode = (state: LegacyRootStateInterface): LegacyRootStateInterface => {
    const settingsState = { ...state.settings };

    ComfortModePersistedKeys.forEach(key => {
        Reflect.deleteProperty(settingsState, key);
    });

    return {
        ...state,
        settings: settingsState
    };
};

type GetThemeColorsType = (theme: ThemeEnum, colorSchema: ColorSchemaEnum) => ThemeColorsType;

const migrateCustomThemesToSemanticTokens = (
    state: LegacyRootStateInterface,
    getThemeColors: GetThemeColorsType
): LegacyRootStateInterface => {
    const customThemesState = { ...initialCustomThemesState, ...state.customThemes };
    const themes = customThemesState.themes.map(theme => {
        const sourceTheme = Object.values(ThemeEnum).includes(theme.sourceTheme) ? theme.sourceTheme : ThemeEnum.BlackAndWhite;
        const storedColors: Partial<Record<ColorSchemaEnum, unknown>> = { ...theme.colors };

        return {
            ...theme,
            schemaVersion: CustomThemeSchemaVersion,
            colors: {
                [ColorSchemaEnum.Light]: migrateCustomThemeColors(
                    storedColors[ColorSchemaEnum.Light],
                    getThemeColors(sourceTheme, ColorSchemaEnum.Light)
                ),
                [ColorSchemaEnum.Dark]: migrateCustomThemeColors(
                    storedColors[ColorSchemaEnum.Dark],
                    getThemeColors(sourceTheme, ColorSchemaEnum.Dark)
                )
            }
        };
    });

    return {
        ...state,
        customThemes: { ...customThemesState, themes }
    };
};

const backfillStatsPackAndDailyRecord = (state: LegacyRootStateInterface, initialSettingsState: SettingsType): LegacyRootStateInterface => {
    const withPlayedDayNumbers = backfillPlayedDayNumbersFromCompletedWins(
        backfillStatsPack(ensureAllDifficulties(backfillCompletedGameRatings(state)))
    );

    return {
        ...withPlayedDayNumbers,
        game: {
            ...withPlayedDayNumbers.game,
            undoneMoves: [],
            dailyDayNumber: legacyInitialGameState.dailyDayNumber,
            dailyCompletedDayNumbers: legacyInitialGameState.dailyCompletedDayNumbers,
            dailyBestStreak: legacyInitialGameState.dailyBestStreak
        },
        settings: { ...initialSettingsState, ...state.settings }
    };
};

const migrateFirstPersistedHistory = (state: LegacyRootStateInterface): LegacyRootStateInterface => ({
    ...state,
    game: {
        ...legacyInitialGameState,
        ...state.game,
        historyByDifficulty: {
            ...legacyInitialGameState.historyByDifficulty,
            ...Option.getOrElse(
                Option.map(decodeFirstHistory(state), ({ history }) => history.byDifficulty),
                () => ({})
            )
        }
    }
});

const withGameDefaults = (state: LegacyRootStateInterface): LegacyRootStateInterface => ({
    ...state,
    game: { ...legacyInitialGameState, ...state.game }
});

export const makeLegacyMigrations = (
    initialSettingsState: SettingsType,
    getThemeColors: GetThemeColorsType
): Record<number, LegacyMigrationType> => {
    const withSettingsDefaults = (state: LegacyRootStateInterface): LegacyRootStateInterface => ({
        ...state,
        settings: { ...initialSettingsState, ...state.settings }
    });

    return {
        12: migrateFirstPersistedHistory,
        13: withGameDefaults,
        14: withSettingsDefaults,
        15: resetBestScores,
        16: ensureHistoryEntryDefaults,
        17: ensureAllDifficulties,
        18: ensureHistoryEntryDefaults,
        19: withSettingsDefaults,
        20: withSettingsDefaults,
        21: withSettingsDefaults,
        22: withGameDefaults,
        23: withGameDefaults,
        24: withGameDefaults,
        25: withGameDefaults,
        26: withSettingsDefaults,
        27: withSettingsDefaults,
        28: state =>
            withSettingsDefaults({
                ...state,
                game: { ...legacyInitialGameState, ...state.game, timelineEvents: [], challengeTimelineEvents: [] }
            }),
        29: backfillRunDifficulty,
        30: state => withSettingsDefaults({ ...state, customThemes: { ...initialCustomThemesState, ...state.customThemes } }),
        31: state => migrateCustomThemesToSemanticTokens(state, getThemeColors),
        32: ensureAllDifficulties,
        33: dropHellQueue,
        41: state => backfillStatsPackAndDailyRecord(state, initialSettingsState),
        42: dropComfortMode
    };
};
