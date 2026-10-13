import { DifficultyEnum } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';
import * as Schema from 'effect/Schema';
import * as Struct from 'effect/Struct';

import { CompletedGameSchema } from '../../completed-game/schema/completed-game.schema';
import { CurrentRunSchema } from '../../current-run/schema/current-run.schema';
import { CustomThemeSchema } from '../../custom-theme/schema/custom-theme.schema';
import { DifficultyStatsSchema } from '../../difficulty-stats/schema/difficulty-stats.schema';
import { PlayerStatsSchema } from '../../player-stats/schema/player-stats.schema';
import { SettingsSchema } from '../../settings/schema/settings.schema';
import { emptyLegacyHistory, emptyLegacyRatingSnapshot, legacyInitialGameState } from '../constant/legacy-initial-state.constant';

import type { SettingsType } from '../../settings/type/settings.type';

const FirstHistoryPersistVersion = 12;
const TimelinePersistVersion = 28;
const SemanticThemePersistVersion = 31;
const StatsPackPersistVersion = 41;

const LegacyRecordSchema = Schema.Record(Schema.String, Schema.Unknown);
const LegacyCompletedGameSchema = Schema.toType(Schema.Struct(Struct.omit(CompletedGameSchema.fields, ['dailyDayNumber'])));
const LegacyHistorySchema = Schema.toType(
    Schema.Struct({
        ...Struct.omit(DifficultyStatsSchema.fields, ['isBestRatingCeiling']),
        bestRating: Schema.Struct({ rating: Schema.Number, isRatingCeiling: Schema.Boolean }),
        completedGames: Schema.Array(LegacyCompletedGameSchema).pipe(Schema.mutable)
    })
);
const FirstHistorySchema = Schema.Struct({ history: Schema.Struct({ byDifficulty: Schema.Record(Schema.String, LegacyHistorySchema) }) });
export const decodeFirstHistory = Schema.decodeUnknownOption(FirstHistorySchema);

const LegacyGameSchema = Schema.toType(
    Schema.Struct({
        ...CurrentRunSchema.fields,
        ...PlayerStatsSchema.fields,
        historyByDifficulty: Schema.Record(Schema.Literals(Object.values(DifficultyEnum)), LegacyHistorySchema)
    })
);
const LegacyThemeSchema = Schema.Struct({
    ...CustomThemeSchema.fields,
    sourceTheme: Schema.String,
    colors: LegacyRecordSchema
});
const LegacyImportSchema = Schema.Struct({
    game: LegacyGameSchema,
    settings: Schema.toType(SettingsSchema),
    customThemes: Schema.Struct({ themes: Schema.Array(LegacyThemeSchema).pipe(Schema.withDecodingDefaultKey(Effect.succeed([]))) })
});

const decodeLegacyHistory = Effect.fn('decodeLegacyHistory')(function* (value: unknown, inboundVersion: number) {
    const history = yield* Schema.decodeUnknownEffect(LegacyRecordSchema)(value);
    const completedGames = yield* Schema.decodeUnknownEffect(Schema.Array(LegacyRecordSchema))(history['completedGames'] ?? []);

    return yield* Schema.decodeUnknownEffect(LegacyHistorySchema)({
        ...emptyLegacyHistory,
        ...history,
        ...(inboundVersion < StatsPackPersistVersion && { bestRating: emptyLegacyRatingSnapshot }),
        completedGames: completedGames.map(completedGame => ({
            rating: 0,
            isRatingCeiling: false,
            ...completedGame
        }))
    });
});

export const decodeLegacyState = Effect.fn('decodeLegacyState')(function* (
    slices: Record<string, unknown>,
    initialSettings: SettingsType,
    inboundVersion: number
) {
    const legacySlices = yield* Schema.decodeUnknownEffect(
        Schema.Struct({
            game: Schema.optionalKey(LegacyRecordSchema),
            settings: Schema.optionalKey(LegacyRecordSchema),
            customThemes: Schema.optionalKey(LegacyRecordSchema),
            history: Schema.optionalKey(LegacyRecordSchema)
        })
    )(slices);
    const game = legacySlices.game ?? {};
    const settings = yield* Schema.decodeUnknownEffect(LegacyRecordSchema)(legacySlices.settings ?? {});
    const customThemes = yield* Schema.decodeUnknownEffect(
        Schema.Struct({
            themes: Schema.Array(LegacyRecordSchema).pipe(Schema.withDecodingDefaultKey(Effect.succeed([])))
        })
    )(legacySlices.customThemes ?? {});
    const firstHistory = yield* Schema.decodeUnknownEffect(LegacyRecordSchema)(legacySlices.history ?? {});
    const historyByDifficulty = yield* Schema.decodeUnknownEffect(LegacyRecordSchema)(
        inboundVersion < FirstHistoryPersistVersion
            ? (firstHistory['byDifficulty'] ?? game['historyByDifficulty'] ?? {})
            : (game['historyByDifficulty'] ?? {})
    );
    const decodedHistories = yield* Effect.forEach(Object.entries(historyByDifficulty), ([difficulty, history]) =>
        Effect.map(decodeLegacyHistory(history, inboundVersion), decoded => [difficulty, decoded] as const)
    );

    return yield* Schema.decodeUnknownEffect(LegacyImportSchema)({
        game: {
            ...legacyInitialGameState,
            ...game,
            ...(inboundVersion < TimelinePersistVersion && { timelineEvents: [], challengeTimelineEvents: [] }),
            ...(inboundVersion < StatsPackPersistVersion && {
                undoneMoves: [],
                dailyDayNumber: legacyInitialGameState.dailyDayNumber,
                dailyCompletedDayNumbers: legacyInitialGameState.dailyCompletedDayNumbers,
                dailyBestStreak: legacyInitialGameState.dailyBestStreak
            }),
            historyByDifficulty: { ...legacyInitialGameState.historyByDifficulty, ...Object.fromEntries(decodedHistories) }
        },
        settings: { ...initialSettings, ...settings },
        customThemes: {
            themes: customThemes.themes.map(theme => ({
                ...(inboundVersion < SemanticThemePersistVersion && { schemaVersion: 1 }),
                ...theme
            }))
        }
    });
});
