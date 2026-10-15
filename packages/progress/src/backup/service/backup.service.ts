import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Schema from 'effect/Schema';
import * as SqlClient from 'effect/sql/SqlClient';

import { CompletedGameRepository } from '../../completed-game/repository/completed-game.repository';
import { CompletedGameSchema } from '../../completed-game/schema/completed-game.schema';
import { CustomThemeRepository } from '../../custom-theme/repository/custom-theme.repository';
import { CustomThemeSchema } from '../../custom-theme/schema/custom-theme.schema';
import { DifficultyStatsRepository } from '../../difficulty-stats/repository/difficulty-stats.repository';
import { DifficultyStatsSchema } from '../../difficulty-stats/schema/difficulty-stats.schema';
import { PlayerStatsRepository } from '../../player-stats/repository/player-stats.repository';
import { PlayerStatsSchema } from '../../player-stats/schema/player-stats.schema';

import type { CompletedGameType } from '../../completed-game/type/completed-game.type';
import type { DifficultyStatsType } from '../../difficulty-stats/type/difficulty-stats.type';
import type { PlayerStatsType } from '../../player-stats/type/player-stats.type';

const BackupSchema = Schema.fromJsonString(
    Schema.Struct({
        version: Schema.Literal(1),
        completedGames: Schema.Array(Schema.toType(CompletedGameSchema)),
        difficultyStats: Schema.Array(Schema.toType(DifficultyStatsSchema)),
        playerStats: Schema.toType(PlayerStatsSchema),
        customThemes: Schema.Array(Schema.toType(CustomThemeSchema))
    })
);

const getCompletedGameKey = (game: CompletedGameType) => `${game.difficulty}:${game.completedAt}:${game.encodedState}`;

const mergeDayNumbers = (local: readonly number[], imported: readonly number[]) =>
    [...new Set([...local, ...imported])].sort((first, second) => first - second);

const mergeBestTime = (local: number, imported: number) => {
    if (local === 0 || imported === 0) {
        return Math.max(local, imported);
    }

    return Math.min(local, imported);
};

const mergeAverageTime = (local: DifficultyStatsType, imported: DifficultyStatsType) => {
    if (local.gamesWon === imported.gamesWon) {
        return Math.min(local.averageTime, imported.averageTime);
    }

    return local.gamesWon > imported.gamesWon ? local.averageTime : imported.averageTime;
};

const mergeDifficultyStats = (local: DifficultyStatsType, imported: DifficultyStatsType): DifficultyStatsType => ({
    difficulty: local.difficulty,
    gamesCompleted: Math.max(local.gamesCompleted, imported.gamesCompleted),
    gamesWon: Math.max(local.gamesWon, imported.gamesWon),
    gamesWonWithoutMistakes: Math.max(local.gamesWonWithoutMistakes, imported.gamesWonWithoutMistakes),
    gamesLost: Math.max(local.gamesLost, imported.gamesLost),
    bestScore: Math.max(local.bestScore, imported.bestScore),
    bestRating: Math.max(local.bestRating, imported.bestRating),
    isBestRatingCeiling:
        local.bestRating === imported.bestRating
            ? local.isBestRatingCeiling || imported.isBestRatingCeiling
            : (local.bestRating > imported.bestRating ? local : imported).isBestRatingCeiling,
    bestTime: mergeBestTime(local.bestTime, imported.bestTime),
    averageTime: mergeAverageTime(local, imported),
    hardcoreWon: Math.max(local.hardcoreWon, imported.hardcoreWon),
    challengesWon: Math.max(local.challengesWon, imported.challengesWon),
    challengesLost: Math.max(local.challengesLost, imported.challengesLost)
});

const mergePlayerStats = (local: PlayerStatsType, imported: PlayerStatsType): PlayerStatsType => {
    const techniqueUsageCounts = new Map(Object.entries(local.techniqueUsageCounts));

    for (const [technique, count] of Object.entries(imported.techniqueUsageCounts)) {
        techniqueUsageCounts.set(technique, Math.max(techniqueUsageCounts.get(technique) ?? 0, count));
    }

    return {
        techniqueUsageCounts: Object.fromEntries(techniqueUsageCounts),
        dailyBestStreak: Math.max(local.dailyBestStreak, imported.dailyBestStreak),
        playedDayNumbers: mergeDayNumbers(local.playedDayNumbers, imported.playedDayNumbers),
        dailyCompletedDayNumbers: mergeDayNumbers(local.dailyCompletedDayNumbers, imported.dailyCompletedDayNumbers)
    };
};

export class BackupService extends Context.Service<BackupService>()('@suuudokuuu/progress/BackupService', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const completedGameRepository = yield* CompletedGameRepository;
        const difficultyStatsRepository = yield* DifficultyStatsRepository;
        const playerStatsRepository = yield* PlayerStatsRepository;
        const customThemeRepository = yield* CustomThemeRepository;

        return {
            exportBackup: Effect.fn('BackupService.exportBackup')(
                function* () {
                    const [completedGames, difficultyStats, playerStats, customThemes] = yield* Effect.all([
                        completedGameRepository.findAll,
                        difficultyStatsRepository.findAll,
                        playerStatsRepository.get,
                        customThemeRepository.findAll
                    ]);

                    return yield* Schema.encodeEffect(BackupSchema)({
                        version: 1,
                        completedGames,
                        difficultyStats,
                        playerStats,
                        customThemes
                    });
                },
                sql.withTransaction,
                Effect.orDie
            ),
            importBackup: Effect.fn('BackupService.importBackup')(function* (backupJson: string) {
                const backup = yield* Schema.decodeUnknownEffect(BackupSchema)(backupJson);

                yield* Effect.gen(function* () {
                    const localGameKeys = new Set((yield* completedGameRepository.findAll).map(getCompletedGameKey));
                    const localThemes = new Map((yield* customThemeRepository.findAll).map(theme => [theme.id, theme]));

                    yield* completedGameRepository.insertMany(
                        [...backup.completedGames].reverse().filter(game => !localGameKeys.has(getCompletedGameKey(game)))
                    );
                    yield* Effect.forEach(
                        backup.difficultyStats,
                        importedStats =>
                            Effect.flatMap(difficultyStatsRepository.findByDifficulty(importedStats.difficulty), localStats =>
                                difficultyStatsRepository.save(mergeDifficultyStats(localStats, importedStats))
                            ),
                        { discard: true }
                    );
                    yield* playerStatsRepository.save(mergePlayerStats(yield* playerStatsRepository.get, backup.playerStats));
                    yield* Effect.forEach(
                        backup.customThemes.filter(theme => theme.updatedAt > (localThemes.get(theme.id)?.updatedAt ?? -1)),
                        theme => customThemeRepository.upsert(theme),
                        { discard: true }
                    );
                }).pipe(sql.withTransaction, Effect.orDie);
            })
        };
    })
}) {
    static readonly layer = Layer.effect(BackupService, BackupService.make).pipe(
        Layer.provide(
            Layer.mergeAll(
                CompletedGameRepository.layer,
                DifficultyStatsRepository.layer,
                PlayerStatsRepository.layer,
                CustomThemeRepository.layer
            )
        )
    );
}
