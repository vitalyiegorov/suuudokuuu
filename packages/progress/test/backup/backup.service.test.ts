import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Effect from 'effect/Effect';

import { InvalidBackupError } from '../../src/backup/error/invalid-backup.error';
import { BackupService } from '../../src/backup/service/backup.service';
import { CompletedGameRepository } from '../../src/completed-game/repository/completed-game.repository';
import { ThemeEnum } from '../../src/custom-theme/enum/theme.enum';
import { CustomThemeRepository } from '../../src/custom-theme/repository/custom-theme.repository';
import { DifficultyStatsRepository } from '../../src/difficulty-stats/repository/difficulty-stats.repository';
import { PlayerStatsRepository } from '../../src/player-stats/repository/player-stats.repository';
import { themeColors } from '../progress-fixtures';
import { ProgressTestLayer } from '../progress-test.layer';

import type { CompletedGameType } from '../../src/completed-game/type/completed-game.type';
import type { CustomThemeType } from '../../src/custom-theme/type/custom-theme.type';
import type { DifficultyStatsType } from '../../src/difficulty-stats/type/difficulty-stats.type';
import type { PlayerStatsType } from '../../src/player-stats/type/player-stats.type';

interface DeviceProgress {
    readonly completedGames: readonly CompletedGameType[];
    readonly difficultyStats: readonly DifficultyStatsType[];
    readonly playerStats: PlayerStatsType;
    readonly customThemes: readonly CustomThemeType[];
}

const firstDay = 20_400;
const easyCompletedAt = 1000;
const hardCompletedAt = 2000;
const mediumCompletedAt = 3000;
const makeGame = (difficulty: DifficultyEnum, completedAt: number, dailyDayNumber: number | null = null): CompletedGameType => ({
    difficulty,
    encodedState: `${difficulty}-${completedAt}`,
    rating: 2.5,
    isRatingCeiling: false,
    elapsedTime: 300,
    score: 1200,
    mistakes: 1,
    maxMistakes: 3,
    completedAt,
    dailyDayNumber
});
const makeStats = (stats: Partial<DifficultyStatsType>): DifficultyStatsType => ({
    difficulty: DifficultyEnum.Hard,
    gamesCompleted: 0,
    gamesWon: 0,
    gamesWonWithoutMistakes: 0,
    gamesLost: 0,
    bestScore: 0,
    bestRating: 0,
    isBestRatingCeiling: false,
    bestTime: 0,
    averageTime: 0,
    hardcoreWon: 0,
    challengesWon: 0,
    challengesLost: 0,
    ...stats
});
const makeTheme = (id: CustomThemeType['id'], updatedAt: number): CustomThemeType => ({
    id,
    name: `${id}-${updatedAt}`,
    schemaVersion: 2,
    sourceTheme: ThemeEnum.Colorful,
    colors: { light: themeColors, dark: { ...themeColors, background: '#000000' } },
    createdAt: 100,
    updatedAt
});

const deviceA: DeviceProgress = {
    completedGames: [makeGame(DifficultyEnum.Easy, easyCompletedAt), makeGame(DifficultyEnum.Hard, hardCompletedAt, firstDay + 1)],
    difficultyStats: [
        makeStats({
            gamesCompleted: 5,
            gamesWon: 4,
            gamesWonWithoutMistakes: 2,
            gamesLost: 1,
            bestScore: 4200,
            bestRating: 4.4,
            isBestRatingCeiling: true,
            bestTime: 310,
            averageTime: 455.5,
            hardcoreWon: 1
        })
    ],
    playerStats: {
        techniqueUsageCounts: { [SolutionTechniqueEnum.NakedSingle]: 14, [SolutionTechniqueEnum.XWing]: 2 },
        dailyBestStreak: 3,
        playedDayNumbers: [firstDay, firstDay + 1],
        dailyCompletedDayNumbers: [firstDay + 1]
    },
    customThemes: [makeTheme('custom-shared', 1000), makeTheme('custom-a', 1000)]
};
const deviceB: DeviceProgress = {
    completedGames: [makeGame(DifficultyEnum.Medium, mediumCompletedAt)],
    difficultyStats: [
        makeStats({ gamesCompleted: 7, gamesWon: 3, gamesLost: 4, bestScore: 5000, bestRating: 3.9, bestTime: 290, averageTime: 400 })
    ],
    playerStats: {
        techniqueUsageCounts: { [SolutionTechniqueEnum.NakedSingle]: 20, [SolutionTechniqueEnum.HiddenSingle]: 5 },
        dailyBestStreak: 2,
        playedDayNumbers: [firstDay - 1, firstDay],
        dailyCompletedDayNumbers: []
    },
    customThemes: [makeTheme('custom-shared', 500), makeTheme('custom-b', 700)]
};

const seedDevice = (progress: DeviceProgress) =>
    Effect.gen(function* () {
        const completedGameRepository = yield* CompletedGameRepository;
        const difficultyStatsRepository = yield* DifficultyStatsRepository;
        const playerStatsRepository = yield* PlayerStatsRepository;
        const customThemeRepository = yield* CustomThemeRepository;

        yield* Effect.forEach(progress.completedGames, game => completedGameRepository.insert(game), { discard: true });
        yield* Effect.forEach(progress.difficultyStats, stats => difficultyStatsRepository.save(stats), { discard: true });
        yield* playerStatsRepository.save(progress.playerStats);
        yield* Effect.forEach(progress.customThemes, theme => customThemeRepository.upsert(theme), { discard: true });
    });

const readDevice = Effect.gen(function* () {
    return {
        completedGames: yield* Effect.flatMap(CompletedGameRepository, repository => repository.findAll),
        difficultyStats: yield* Effect.flatMap(DifficultyStatsRepository, repository => repository.findAll),
        playerStats: yield* Effect.flatMap(PlayerStatsRepository, repository => repository.get),
        customThemes: yield* Effect.flatMap(CustomThemeRepository, repository => repository.findAll)
    };
});

const exportDevice = (progress: DeviceProgress) =>
    Effect.gen(function* () {
        yield* seedDevice(progress);

        return { backup: yield* Effect.flatMap(BackupService, backupService => backupService.exportBackup()), snapshot: yield* readDevice };
    }).pipe(Effect.provide(ProgressTestLayer));

const importBackup = (backup: string) => Effect.flatMap(BackupService, backupService => backupService.importBackup(backup));

describe('BackupService', () => {
    it.effect('restores every exported table into a fresh device unchanged', () =>
        Effect.gen(function* () {
            const exported = yield* exportDevice(deviceA);
            const restored = yield* importBackup(exported.backup).pipe(Effect.andThen(readDevice), Effect.provide(ProgressTestLayer));

            assert.deepStrictEqual(restored, exported.snapshot);
        })
    );

    it.effect('merges into a device with its own progress without losing either side', () =>
        Effect.gen(function* () {
            const exported = yield* exportDevice(deviceA);
            const merged = yield* Effect.gen(function* () {
                yield* seedDevice(deviceB);
                yield* importBackup(exported.backup);

                return yield* readDevice;
            }).pipe(Effect.provide(ProgressTestLayer));

            assert.deepStrictEqual(
                merged.completedGames.map(game => game.encodedState),
                [makeGame(DifficultyEnum.Medium, mediumCompletedAt), ...[...deviceA.completedGames].reverse()].map(
                    game => game.encodedState
                )
            );
            assert.deepStrictEqual(
                merged.difficultyStats.find(stats => stats.difficulty === DifficultyEnum.Hard),
                makeStats({
                    gamesCompleted: 7,
                    gamesWon: 4,
                    gamesWonWithoutMistakes: 2,
                    gamesLost: 4,
                    bestScore: 5000,
                    bestRating: 4.4,
                    isBestRatingCeiling: true,
                    bestTime: 290,
                    averageTime: 455.5,
                    hardcoreWon: 1
                })
            );
            assert.deepStrictEqual(merged.playerStats, {
                techniqueUsageCounts: {
                    [SolutionTechniqueEnum.NakedSingle]: 20,
                    [SolutionTechniqueEnum.HiddenSingle]: 5,
                    [SolutionTechniqueEnum.XWing]: 2
                },
                dailyBestStreak: 3,
                playedDayNumbers: [firstDay - 1, firstDay, firstDay + 1],
                dailyCompletedDayNumbers: [firstDay + 1]
            });
            assert.deepStrictEqual(merged.customThemes, [
                makeTheme('custom-shared', 1000),
                makeTheme('custom-b', 700),
                makeTheme('custom-a', 1000)
            ]);
        })
    );

    it.effect('changes nothing when the same backup is imported twice', () =>
        Effect.gen(function* () {
            const exported = yield* exportDevice(deviceA);
            const [afterFirstImport, afterSecondImport] = yield* Effect.gen(function* () {
                yield* seedDevice(deviceB);
                yield* importBackup(exported.backup);
                const firstSnapshot = yield* readDevice;
                yield* importBackup(exported.backup);

                return [firstSnapshot, yield* readDevice];
            }).pipe(Effect.provide(ProgressTestLayer));

            assert.deepStrictEqual(afterSecondImport, afterFirstImport);
        })
    );

    it.effect('rejects a file that is not a supported backup', () =>
        Effect.gen(function* () {
            const exported = yield* exportDevice(deviceA);
            const futureVersion = exported.backup.replace('"version":1', '"version":2');
            const errors = yield* Effect.forEach(['not a backup', '{}', futureVersion], backup => Effect.flip(importBackup(backup))).pipe(
                Effect.provide(ProgressTestLayer)
            );

            assert.isTrue(errors.every(error => error instanceof InvalidBackupError));
        })
    );
});
