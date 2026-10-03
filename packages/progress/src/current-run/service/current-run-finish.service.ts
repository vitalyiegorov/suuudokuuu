import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import * as Clock from 'effect/Clock';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Option from 'effect/Option';
import * as SqlClient from 'effect/sql/SqlClient';

import { getDayNumber } from '../../@generic/utils/get-day-number.util';
import { getDayStreak } from '../../@generic/utils/get-day-streak.util';
import { CompletedGameRepository } from '../../completed-game/repository/completed-game.repository';
import { DifficultyStatsRepository } from '../../difficulty-stats/repository/difficulty-stats.repository';
import { PlayerStatsRepository } from '../../player-stats/repository/player-stats.repository';
import { CurrentRunRepository } from '../repository/current-run.repository';
import { gameStateToString } from '../utils/game-state-to-string.util';

import type { DifficultyStatsType } from '../../difficulty-stats/type/difficulty-stats.type';
import type { PlayerStatsType } from '../../player-stats/type/player-stats.type';
import type { CurrentRunType } from '../type/current-run.type';

const addDayNumber = (dayNumbers: readonly number[], dayNumber: number): number[] =>
    dayNumbers.includes(dayNumber)
        ? [...dayNumbers]
        : [...dayNumbers, dayNumber].sort((firstDayNumber, secondDayNumber) => firstDayNumber - secondDayNumber);

const getFinishedPlayerStats = (playerStats: PlayerStatsType, run: CurrentRunType, isWon: boolean, nowMs: number): PlayerStatsType => {
    const playedDayNumbers = addDayNumber(playerStats.playedDayNumbers, getDayNumber(nowMs));

    if (!isWon || run.dailyDayNumber <= 0) {
        return { ...playerStats, playedDayNumbers };
    }

    const dailyCompletedDayNumbers = addDayNumber(playerStats.dailyCompletedDayNumbers, run.dailyDayNumber);
    const dailyBestStreak = Math.max(playerStats.dailyBestStreak, getDayStreak(dailyCompletedDayNumbers, run.dailyDayNumber));

    return { ...playerStats, playedDayNumbers, dailyCompletedDayNumbers, dailyBestStreak };
};

const getLostStats = (stats: DifficultyStatsType, isChallenge: boolean): DifficultyStatsType => ({
    ...stats,
    gamesCompleted: stats.gamesCompleted + 1,
    gamesLost: stats.gamesLost + 1,
    challengesLost: stats.challengesLost + (isChallenge ? 1 : 0)
});

const getWonStats = (stats: DifficultyStatsType, run: CurrentRunType, isChallenge: boolean): DifficultyStatsType => {
    const isBestRating = run.rating > stats.bestRating;

    return {
        ...stats,
        gamesCompleted: stats.gamesCompleted + 1,
        averageTime: (stats.averageTime * stats.gamesWon + run.elapsedTime) / (stats.gamesWon + 1),
        bestTime: stats.bestTime === 0 || run.elapsedTime < stats.bestTime ? run.elapsedTime : stats.bestTime,
        gamesWon: stats.gamesWon + 1,
        gamesWonWithoutMistakes: stats.gamesWonWithoutMistakes + (run.mistakes === 0 ? 1 : 0),
        hardcoreWon: stats.hardcoreWon + (run.maxMistakes === 0 ? 1 : 0),
        challengesWon: stats.challengesWon + (isChallenge ? 1 : 0),
        bestScore: Math.max(stats.bestScore, run.score),
        bestRating: isBestRating ? run.rating : stats.bestRating,
        isBestRatingCeiling: isBestRating ? run.isRatingCeiling : stats.isBestRatingCeiling
    };
};

export class CurrentRunFinishService extends Context.Service<CurrentRunFinishService>()('@suuudokuuu/progress/CurrentRunFinishService', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const currentRunRepository = yield* CurrentRunRepository;
        const difficultyStatsRepository = yield* DifficultyStatsRepository;
        const completedGameRepository = yield* CompletedGameRepository;
        const playerStatsRepository = yield* PlayerStatsRepository;

        const finishRun = Effect.fn('CurrentRunFinishService.finishRun')(function* (
            run: CurrentRunType,
            isWon: boolean,
            isChallenge: boolean
        ) {
            const nowMs = yield* Clock.currentTimeMillis;
            const stats = yield* difficultyStatsRepository.findByDifficulty(run.difficulty);
            const playerStats = yield* playerStatsRepository.get;
            const hasNewPersonalBestScore = isWon && !isChallenge && run.challengeState === '' && run.score > stats.bestScore;

            yield* currentRunRepository.save({
                ...run,
                hasNewPersonalBestScore,
                isPaused: true,
                shouldShowPauseScreen: false,
                shouldResumeOnFocus: false
            });
            yield* playerStatsRepository.save(getFinishedPlayerStats(playerStats, run, isWon, nowMs));
            yield* difficultyStatsRepository.save(isWon ? getWonStats(stats, run, isChallenge) : getLostStats(stats, isChallenge));

            if (isWon) {
                yield* completedGameRepository.insert({
                    difficulty: run.difficulty,
                    rating: run.rating,
                    isRatingCeiling: run.isRatingCeiling,
                    encodedState: gameStateToString(run, SharedPayloadKindEnum.Handoff),
                    elapsedTime: run.elapsedTime,
                    score: run.score,
                    mistakes: run.mistakes,
                    maxMistakes: run.maxMistakes,
                    completedAt: nowMs
                });
            }
        });

        return {
            finish: (isWon: boolean, isChallenge = false) =>
                sql
                    .withTransaction(
                        Effect.flatMap(currentRunRepository.get, currentRun =>
                            Option.match(currentRun, { onNone: () => Effect.void, onSome: run => finishRun(run, isWon, isChallenge) })
                        )
                    )
                    .pipe(Effect.orDie)
        };
    })
}) {
    static readonly layer = Layer.effect(CurrentRunFinishService, CurrentRunFinishService.make).pipe(
        Layer.provide(
            Layer.mergeAll(
                CurrentRunRepository.layer,
                DifficultyStatsRepository.layer,
                CompletedGameRepository.layer,
                PlayerStatsRepository.layer
            )
        )
    );
}
