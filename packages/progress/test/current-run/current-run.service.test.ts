import { assert, describe, it } from '@effect/vitest';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum, emptyScoredCells } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Effect from 'effect/Effect';
import * as Exit from 'effect/Exit';
import * as Option from 'effect/Option';
import * as TestClock from 'effect/testing/TestClock';

import { getDayNumber } from '../../src/@generic/utils/get-day-number.util';
import { CompletedGameRepository } from '../../src/completed-game/repository/completed-game.repository';
import { initialCurrentRun } from '../../src/current-run/constant/initial-current-run.constant';
import { CurrentRunRepository } from '../../src/current-run/repository/current-run.repository';
import { CurrentRunService } from '../../src/current-run/service/current-run.service';
import { DifficultyStatsRepository } from '../../src/difficulty-stats/repository/difficulty-stats.repository';
import { PlayerStatsRepository } from '../../src/player-stats/repository/player-stats.repository';
import { SudokuScoring } from '../../src/scoring/class/sudoku-scoring';
import { defaultScoringConfig } from '../../src/scoring/constant/default-scoring-config.constant';
import { ProgressTestLayer } from '../progress-test.layer';

import type { CurrentRunType } from '../../src/current-run/type/current-run.type';

const startedSudokuString = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
const millisecondsPerSecond = 1000;
const dayInMilliseconds = 86_400_000;
const firstDayMs = 1_728_000_000_000;
const firstDay = getDayNumber(firstDayMs);
const wallClockStartMs = 1_000_000;
const anchoredElapsedTime = 10;
const returnedElapsedTime = 25;
const scoring = new SudokuScoring(defaultScoringConfig);
const placedCell = { x: 2, y: 0, value: 4, group: 0 };
const placedSudokuString = `534${startedSudokuString.slice(3)}`;
const placedCandidates = { '1-1': [2, 7] };
const thinkTime = 12;
const penaltyParams = { difficulty: DifficultyEnum.Medium, maxMistakes: 3 };
const placementScore = scoring.calculate({ ...penaltyParams, scoredCells: emptyScoredCells, mistakes: 0, elapsedTime: thinkTime });

const saveRun = (run: Partial<CurrentRunType> = {}) =>
    Effect.flatMap(CurrentRunRepository, currentRunRepository =>
        currentRunRepository.save({ ...initialCurrentRun, sudokuString: startedSudokuString, difficulty: DifficultyEnum.Medium, ...run })
    );

const getRun = Effect.flatMap(CurrentRunRepository, currentRunRepository => currentRunRepository.get).pipe(Effect.map(Option.getOrThrow));

const getPlayerStats = Effect.flatMap(PlayerStatsRepository, playerStatsRepository => playerStatsRepository.get);

const finishRun = (run: Partial<CurrentRunType>, isWon: boolean, isChallenge: boolean) =>
    Effect.gen(function* () {
        const currentRunService = yield* CurrentRunService;

        yield* saveRun(run);
        yield* currentRunService.finish(isWon, isChallenge);
    });

const placeClassifiedCell = Effect.gen(function* () {
    const currentRunService = yield* CurrentRunService;

    yield* saveRun({ elapsedTime: thinkTime, undoneMoves: [{ kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts: 1 }] });
    yield* currentRunService.save({
        sudokuString: placedSudokuString,
        candidates: placedCandidates,
        correctCell: placedCell,
        scoredCells: emptyScoredCells
    });
    yield* currentRunService.classifyMove({ cell: placedCell, technique: SolutionTechniqueEnum.NakedSingle });
    yield* currentRunService.classifyMove({ cell: placedCell, technique: SolutionTechniqueEnum.HiddenSingle });

    return currentRunService;
});

describe('CurrentRunService', () => {
    it.effect('separates pausing the timer from showing the pause screen and never pauses a challenge run', () =>
        Effect.gen(function* () {
            const currentRunService = yield* CurrentRunService;

            yield* saveRun();
            yield* currentRunService.pause(false);

            assert.deepInclude(yield* getRun, { isPaused: true, shouldShowPauseScreen: false, shouldResumeOnFocus: true });
            assert.deepStrictEqual(yield* currentRunService.focus(), { isChallengeRun: false, shouldRunTimer: true });
            assert.deepInclude(yield* getRun, { isPaused: false, shouldResumeOnFocus: false });

            yield* currentRunService.pause();

            assert.deepInclude(yield* getRun, { isPaused: true, shouldShowPauseScreen: true, shouldResumeOnFocus: false });
            assert.deepStrictEqual(yield* currentRunService.focus(), { isChallengeRun: false, shouldRunTimer: false });

            yield* saveRun({ isChallengeRun: true });
            yield* currentRunService.pause();

            assert.isFalse((yield* getRun).isPaused);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('anchors and fast-forwards the challenge clock from wall time and records the time away', () =>
        Effect.gen(function* () {
            const currentRunService = yield* CurrentRunService;

            yield* TestClock.setTime(wallClockStartMs + anchoredElapsedTime * millisecondsPerSecond);
            yield* saveRun({ isChallengeRun: true, elapsedTime: anchoredElapsedTime });
            yield* currentRunService.focus();

            assert.strictEqual((yield* getRun).wallClockStartMs, wallClockStartMs);

            yield* currentRunService.leaveRun;
            yield* currentRunService.leaveRun;
            yield* TestClock.setTime(wallClockStartMs + returnedElapsedTime * millisecondsPerSecond);
            yield* currentRunService.returnToRun;

            const { elapsedTime, timelineEvents } = yield* getRun;

            assert.strictEqual(elapsedTime, returnedElapsedTime);
            assert.deepStrictEqual(timelineEvents, [
                { kind: TimelineEventKindEnum.Away, ts: anchoredElapsedTime },
                { kind: TimelineEventKindEnum.Return, ts: returnedElapsedTime - anchoredElapsedTime }
            ]);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('drops a sub-second away blip and records markers only in challenge runs', () =>
        Effect.gen(function* () {
            const currentRunService = yield* CurrentRunService;

            yield* saveRun();
            yield* currentRunService.leaveRun;
            yield* currentRunService.screenshot;

            assert.deepStrictEqual((yield* getRun).timelineEvents, []);

            yield* saveRun({ isChallengeRun: true, wallClockStartMs: 1 });
            yield* currentRunService.leaveRun;
            yield* currentRunService.returnToRun;
            yield* currentRunService.screenshot;

            assert.deepStrictEqual((yield* getRun).timelineEvents, [{ kind: TimelineEventKindEnum.Screenshot, ts: 0 }]);
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('loads a shared run resumed with a fresh wall clock and resets it', () =>
        Effect.gen(function* () {
            const currentRunService = yield* CurrentRunService;

            yield* TestClock.setTime(wallClockStartMs);
            yield* saveRun({ isPaused: true, challengeState: 'rival' });
            yield* currentRunService.load(yield* getRun);

            assert.deepInclude(yield* getRun, { isPaused: false, wallClockStartMs });

            yield* currentRunService.reset;

            assert.isTrue(Exit.isFailure(yield* Effect.exit(getRun)));
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('scores a placement, mirrors the engine field and attaches its technique once', () =>
        Effect.gen(function* () {
            yield* placeClassifiedCell;

            assert.deepInclude(yield* getRun, {
                sudokuString: placedSudokuString,
                candidates: placedCandidates,
                score: placementScore,
                undoneMoves: [],
                timelineEvents: [
                    {
                        kind: TimelineEventKindEnum.Cell,
                        cellIndex: 2,
                        value: 4,
                        ts: thinkTime,
                        score: placementScore,
                        technique: SolutionTechniqueEnum.NakedSingle
                    }
                ]
            });
            assert.deepStrictEqual((yield* getPlayerStats).techniqueUsageCounts, { [SolutionTechniqueEnum.NakedSingle]: 1 });
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('undoes a placement for its points plus the undo penalty and redoes it with a fresh think time', () =>
        Effect.gen(function* () {
            const currentRunService = yield* placeClassifiedCell;
            const fieldState = { sudokuString: startedSudokuString, candidates: {} };

            yield* currentRunService.undo(fieldState);

            const undoneRun = yield* getRun;

            assert.deepInclude(undoneRun, { sudokuString: startedSudokuString, score: 0, timelineEvents: [] });
            assert.strictEqual(undoneRun.undoneMoves.length, 1);
            assert.deepStrictEqual((yield* getPlayerStats).techniqueUsageCounts, {});

            yield* currentRunService.undo(fieldState);
            yield* currentRunService.redo({ sudokuString: placedSudokuString, candidates: placedCandidates });

            const redoneRun = yield* getRun;

            assert.deepInclude(redoneRun, { score: placementScore, undoneMoves: [] });
            assert.deepStrictEqual(
                redoneRun.timelineEvents.map(event => event.ts),
                [thinkTime]
            );
            assert.deepStrictEqual((yield* getPlayerStats).techniqueUsageCounts, { [SolutionTechniqueEnum.NakedSingle]: 1 });
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('charges a hint, strikes its eliminations and clears the redo stack', () =>
        Effect.gen(function* () {
            const currentRunService = yield* CurrentRunService;
            const hintPenalty = scoring.calculateHintPenalty(penaltyParams);

            yield* saveRun({
                score: hintPenalty + 1,
                candidates: placedCandidates,
                undoneMoves: [{ kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts: 1 }]
            });
            yield* currentRunService.hint([
                { cell: { x: 1, y: 1, value: 0, group: 0 }, value: 7 },
                { cell: { x: 5, y: 5, value: 0, group: 0 }, value: 7 }
            ]);
            yield* currentRunService.hint([]);

            assert.deepInclude(yield* getRun, {
                score: 0,
                candidates: { '1-1': [2] },
                undoneMoves: [],
                timelineEvents: [
                    { kind: TimelineEventKindEnum.Hint, ts: 0 },
                    { kind: TimelineEventKindEnum.Hint, ts: 0 }
                ]
            });
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('records mistakes, challenge pencil marks and the auto candidates assist once', () =>
        Effect.gen(function* () {
            const currentRunService = yield* CurrentRunService;
            const inputState = { inputMode: 'candidate' as const, showAutoCandidates: true };

            yield* saveRun({ isChallengeRun: true });
            yield* currentRunService.mistake(placedCell);
            yield* currentRunService.toggleCellCandidate({ candidates: placedCandidates, cell: placedCell });
            yield* currentRunService.toggleAutoCandidates(inputState);
            yield* currentRunService.toggleAutoCandidates(inputState);

            assert.deepInclude(yield* getRun, {
                ...inputState,
                mistakes: 1,
                candidates: placedCandidates,
                timelineEvents: [
                    { kind: TimelineEventKindEnum.Mistake, cellIndex: 2, value: 4, ts: 0 },
                    { kind: TimelineEventKindEnum.Pencil, cellIndex: 2, value: 4, ts: 0 },
                    { kind: TimelineEventKindEnum.AutoCandidates, ts: 0 }
                ]
            });
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('records wins, personal bests, best rating, the replay and the daily streak', () =>
        Effect.gen(function* () {
            yield* TestClock.setTime(firstDayMs);
            yield* finishRun({ score: 500, elapsedTime: 100, rating: 3.4, dailyDayNumber: firstDay }, true, false);

            assert.deepInclude(yield* getRun, { hasNewPersonalBestScore: true, isPaused: true, shouldResumeOnFocus: false });

            yield* TestClock.setTime(firstDayMs + dayInMilliseconds);
            yield* finishRun(
                { score: 300, elapsedTime: 50, rating: 2, mistakes: 1, maxMistakes: 0, dailyDayNumber: firstDay + 1 },
                true,
                true
            );

            assert.isFalse((yield* getRun).hasNewPersonalBestScore);
            assert.deepInclude(
                yield* Effect.flatMap(DifficultyStatsRepository, repository => repository.findByDifficulty(DifficultyEnum.Medium)),
                {
                    gamesCompleted: 2,
                    gamesWon: 2,
                    gamesWonWithoutMistakes: 1,
                    hardcoreWon: 1,
                    challengesWon: 1,
                    bestScore: 500,
                    bestTime: 50,
                    averageTime: 75,
                    bestRating: 3.4
                }
            );
            assert.deepStrictEqual(
                (yield* Effect.flatMap(CompletedGameRepository, repository => repository.findAll)).map(game => game.score),
                [300, 500]
            );
            assert.deepInclude(yield* getPlayerStats, {
                playedDayNumbers: [firstDay, firstDay + 1],
                dailyCompletedDayNumbers: [firstDay, firstDay + 1],
                dailyBestStreak: 2
            });
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('records losses without a replay, a daily record or a personal best', () =>
        Effect.gen(function* () {
            yield* TestClock.setTime(firstDayMs);
            yield* finishRun({ score: 900, dailyDayNumber: firstDay }, false, true);

            assert.isFalse((yield* getRun).hasNewPersonalBestScore);
            assert.deepInclude(
                yield* Effect.flatMap(DifficultyStatsRepository, repository => repository.findByDifficulty(DifficultyEnum.Medium)),
                {
                    gamesCompleted: 1,
                    gamesLost: 1,
                    challengesLost: 1,
                    averageTime: 0,
                    bestScore: 0
                }
            );
            assert.deepStrictEqual(yield* Effect.flatMap(CompletedGameRepository, repository => repository.findAll), []);
            assert.deepInclude(yield* getPlayerStats, {
                playedDayNumbers: [firstDay],
                dailyCompletedDayNumbers: []
            });
        }).pipe(Effect.provide(ProgressTestLayer))
    );
});
