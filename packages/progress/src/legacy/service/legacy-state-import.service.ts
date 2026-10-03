import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Option from 'effect/Option';
import { isObject } from 'effect/Predicate';
import * as Schema from 'effect/Schema';
import * as SqlClient from 'effect/sql/SqlClient';

import { DifficultySchema } from '../../@generic/schema/difficulty.schema';
import { CompletedGameRepository } from '../../completed-game/repository/completed-game.repository';
import { initialCurrentRun } from '../../current-run/constant/initial-current-run.constant';
import { CurrentRunRepository } from '../../current-run/repository/current-run.repository';
import { CustomThemeRepository } from '../../custom-theme/repository/custom-theme.repository';
import { DifficultyStatsRepository } from '../../difficulty-stats/repository/difficulty-stats.repository';
import { PlayerStatsRepository } from '../../player-stats/repository/player-stats.repository';
import { SettingsRepository } from '../../settings/repository/settings.repository';
import { legacyInitialGameState } from '../constant/legacy-initial-state.constant';
import { LegacyPersistVersion, makeLegacyMigrations } from '../utils/make-legacy-migrations.util';

import type { ColorSchemaEnum } from '../../custom-theme/enum/color-schema.enum';
import type { ThemeEnum } from '../../custom-theme/enum/theme.enum';
import type { ThemeColorsType } from '../../custom-theme/type/theme-colors.type';
import type { LegacyRootStateInterface } from '../interface/legacy-root-state.interface';

const PersistedRootSchema = Schema.fromJsonString(Schema.Record(Schema.String, Schema.fromJsonString(Schema.Unknown)));
const PersistMetadataSchema = Schema.Struct({ version: Schema.Number });
const isDifficulty = Schema.is(DifficultySchema);

const isLegacyRootState = (value: object): value is Partial<LegacyRootStateInterface> => isObject(value);

export class LegacyStateImportService extends Context.Service<LegacyStateImportService>()('@suuudokuuu/progress/LegacyStateImportService', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const settingsRepository = yield* SettingsRepository;
        const customThemeRepository = yield* CustomThemeRepository;
        const currentRunRepository = yield* CurrentRunRepository;
        const difficultyStatsRepository = yield* DifficultyStatsRepository;
        const completedGameRepository = yield* CompletedGameRepository;
        const playerStatsRepository = yield* PlayerStatsRepository;

        return {
            importPersistedRoot: Effect.fn('LegacyStateImportService.importPersistedRoot')(function* (
                persistedRoot: string,
                getThemeColors: (theme: ThemeEnum, colorSchema: ColorSchemaEnum) => ThemeColorsType
            ) {
                const { _persist: persistMetadata, ...slices } = yield* Schema.decodeUnknownEffect(PersistedRootSchema)(persistedRoot).pipe(
                    Effect.orDie
                );
                const inboundVersion = Option.match(Schema.decodeUnknownOption(PersistMetadataSchema)(persistMetadata), {
                    onNone: () => -1,
                    onSome: metadata => metadata.version
                });
                const initialSettings = yield* settingsRepository.get;
                const migrations = makeLegacyMigrations(initialSettings, getThemeColors);

                if (!isLegacyRootState(slices)) {
                    return;
                }

                const { game, settings, customThemes } = Object.keys(migrations)
                    .map(Number)
                    .filter(version => version > inboundVersion && version <= LegacyPersistVersion)
                    .sort((firstVersion, secondVersion) => firstVersion - secondVersion)
                    .reduce<Partial<LegacyRootStateInterface>>(
                        (state, version) =>
                            migrations[version]({
                                game: legacyInitialGameState,
                                settings: initialSettings,
                                customThemes: { themes: [] },
                                ...state
                            }),
                        slices
                    );
                const gameState = { ...legacyInitialGameState, ...game };
                const histories = Object.values(gameState.historyByDifficulty).filter(history => isDifficulty(history.difficulty));

                yield* sql
                    .withTransaction(
                        Effect.gen(function* () {
                            yield* Effect.all(
                                [currentRunRepository.remove, customThemeRepository.removeAll, completedGameRepository.removeAll],
                                {
                                    discard: true
                                }
                            );
                            yield* settingsRepository.save({ ...initialSettings, ...settings });
                            yield* Effect.forEach(customThemes?.themes ?? [], customThemeRepository.upsert, { discard: true });

                            if (gameState.sudokuString !== '') {
                                yield* currentRunRepository.save({ ...initialCurrentRun, ...gameState });
                            }

                            yield* Effect.forEach(
                                histories,
                                history =>
                                    difficultyStatsRepository.save({
                                        ...history,
                                        bestRating: history.bestRating.rating,
                                        isBestRatingCeiling: history.bestRating.isRatingCeiling
                                    }),
                                { discard: true }
                            );
                            yield* Effect.forEach(
                                histories.flatMap(history => [...history.completedGames].reverse()),
                                completedGameRepository.insert,
                                { discard: true }
                            );
                            yield* playerStatsRepository.save({
                                techniqueUsageCounts: gameState.techniqueUsageCounts,
                                dailyBestStreak: gameState.dailyBestStreak,
                                playedDayNumbers: gameState.playedDayNumbers,
                                dailyCompletedDayNumbers: gameState.dailyCompletedDayNumbers
                            });
                        })
                    )
                    .pipe(Effect.orDie);
            })
        };
    })
}) {
    static readonly layer = Layer.effect(LegacyStateImportService, LegacyStateImportService.make).pipe(
        Layer.provide(
            Layer.mergeAll(
                SettingsRepository.layer,
                CustomThemeRepository.layer,
                CurrentRunRepository.layer,
                DifficultyStatsRepository.layer,
                CompletedGameRepository.layer,
                PlayerStatsRepository.layer
            )
        )
    );
}
