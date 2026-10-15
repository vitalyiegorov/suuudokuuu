import { assert, describe, it } from '@effect/vitest';
import { DifficultyEnum, emptyScoredCells } from '@suuudokuuu/generator';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';
import * as TestClock from 'effect/testing/TestClock';

import { CompletedGameRepository } from '../../src/completed-game/repository/completed-game.repository';
import { CurrentRunService } from '../../src/current-run/service/current-run.service';
import { SudokuScoring } from '../../src/scoring/class/sudoku-scoring';
import { defaultScoringConfig } from '../../src/scoring/constant/default-scoring-config.constant';
import { ProgressTestLayer } from '../progress-test.layer';

const sudokuString = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
const placedCell = { x: 2, y: 0, value: 4, group: 0 };
const scoring = new SudokuScoring(defaultScoringConfig);
const millisecondsPerSecond = 1000;
const startMs = 1_000_000;
const firstTickMs = 400;
const delayedTickMs = 4900;
const pausedAtMs = 6300;
const closedMs = 600_000;
const placedAfterResumeMs = 2400;
const finishedAfterResumeMs = 5200;
const stoppedAtMs = 3500;
const tickAfterReturnMs = 1500;
const challengeAwayMs = 42_000;

const setTimeAfterStart = (milliseconds: number) => TestClock.setTime(startMs + milliseconds);

const getElapsedTime = Effect.flatMap(CurrentRunService, currentRunService =>
    Effect.map(currentRunService.reset, run => Option.getOrThrow(run).elapsedTime)
);

const startRun = (isChallengeRun: boolean) =>
    Effect.gen(function* () {
        const currentRunService = yield* CurrentRunService;

        yield* TestClock.setTime(startMs);
        yield* currentRunService.start({
            isChallengeRun,
            sudokuString,
            difficulty: DifficultyEnum.Medium,
            rating: 0,
            isRatingCeiling: false,
            maxMistakes: 3,
            dailyDayNumber: 0
        });
        yield* currentRunService.focus();

        return currentRunService;
    });

describe('run clock', () => {
    it.effect('counts wall time across delayed ticks, pause and resume, and scores and records the corrected time', () =>
        Effect.gen(function* () {
            const currentRunService = yield* startRun(false);

            yield* setTimeAfterStart(firstTickMs);
            yield* currentRunService.tick;
            yield* setTimeAfterStart(delayedTickMs);
            yield* currentRunService.tick;
            yield* setTimeAfterStart(pausedAtMs);
            yield* currentRunService.pause();
            yield* setTimeAfterStart(closedMs);
            yield* currentRunService.tick;
            yield* currentRunService.resume;
            yield* currentRunService.focus();
            yield* setTimeAfterStart(closedMs + placedAfterResumeMs);
            yield* currentRunService.save({
                sudokuString,
                candidates: {},
                eliminatedCandidates: {},
                correctCell: placedCell,
                scoredCells: emptyScoredCells
            });
            yield* setTimeAfterStart(closedMs + finishedAfterResumeMs);
            yield* currentRunService.finish(true, false);

            const [completedGame] = yield* Effect.flatMap(CompletedGameRepository, repository => repository.findAll);
            const finishedElapsedTime = Math.floor((pausedAtMs + finishedAfterResumeMs) / millisecondsPerSecond);
            const placementScore = scoring.calculate({
                scoredCells: emptyScoredCells,
                difficulty: DifficultyEnum.Medium,
                mistakes: 0,
                maxMistakes: 3,
                elapsedTime: Math.floor((pausedAtMs + placedAfterResumeMs) / millisecondsPerSecond)
            });

            assert.deepInclude(completedGame, { elapsedTime: finishedElapsedTime, score: placementScore });
            assert.strictEqual(yield* getElapsedTime, finishedElapsedTime);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('stops the clock when the run leaves the screen and drops the time a crashed run was closed', () =>
        Effect.gen(function* () {
            const currentRunService = yield* startRun(false);

            yield* setTimeAfterStart(stoppedAtMs);
            yield* currentRunService.stopClock;
            yield* setTimeAfterStart(closedMs);
            yield* currentRunService.tick;
            yield* currentRunService.focus();
            yield* setTimeAfterStart(closedMs + tickAfterReturnMs);
            yield* currentRunService.tick;
            yield* setTimeAfterStart(closedMs * 2);
            yield* currentRunService.focus();
            yield* setTimeAfterStart(closedMs * 2 + tickAfterReturnMs);
            yield* currentRunService.tick;

            assert.strictEqual(yield* getElapsedTime, Math.floor((stoppedAtMs + tickAfterReturnMs * 2) / millisecondsPerSecond));
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('keeps a challenge clock running while the player is away', () =>
        Effect.gen(function* () {
            const currentRunService = yield* startRun(true);

            yield* currentRunService.leaveRun;
            yield* currentRunService.stopClock;
            yield* setTimeAfterStart(challengeAwayMs);
            yield* currentRunService.focus();

            assert.strictEqual(yield* getElapsedTime, challengeAwayMs / millisecondsPerSecond);
        }).pipe(Effect.provide(ProgressTestLayer))
    );
});
