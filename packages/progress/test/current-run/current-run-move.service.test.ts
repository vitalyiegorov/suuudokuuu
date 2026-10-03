import { assert, describe, it } from '@effect/vitest';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { DifficultyEnum, emptyScoredCells } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import * as Effect from 'effect/Effect';

import { CurrentRunMoveService } from '../../src/current-run/service/current-run-move.service';
import { PlayerStatsRepository } from '../../src/player-stats/repository/player-stats.repository';
import { SudokuScoring } from '../../src/scoring/class/sudoku-scoring';
import { defaultScoringConfig } from '../../src/scoring/constant/default-scoring-config.constant';
import { ProgressTestLayer } from '../progress-test.layer';

import { getRun, saveRun, startedSudokuString } from './current-run-fixture';

const scoring = new SudokuScoring(defaultScoringConfig);
const placedCell = { x: 2, y: 0, value: 4, group: 0 };
const placedSudokuString = `534${startedSudokuString.slice(3)}`;
const placedCandidates = { '1-1': [2, 7] };
const thinkTime = 12;
const penaltyParams = { difficulty: DifficultyEnum.Medium, maxMistakes: 3 };
const placementScore = scoring.calculate({ ...penaltyParams, scoredCells: emptyScoredCells, mistakes: 0, elapsedTime: thinkTime });

const getTechniqueUsageCounts = Effect.flatMap(PlayerStatsRepository, playerStatsRepository => playerStatsRepository.get).pipe(
    Effect.map(playerStats => playerStats.techniqueUsageCounts)
);

const placeClassifiedCell = Effect.gen(function* () {
    const currentRunMoveService = yield* CurrentRunMoveService;

    yield* saveRun({ elapsedTime: thinkTime, undoneMoves: [{ kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts: 1 }] });
    yield* currentRunMoveService.save({
        sudokuString: placedSudokuString,
        candidates: placedCandidates,
        correctCell: placedCell,
        scoredCells: emptyScoredCells
    });
    yield* currentRunMoveService.classifyMove({ cell: placedCell, technique: SolutionTechniqueEnum.NakedSingle });
    yield* currentRunMoveService.classifyMove({ cell: placedCell, technique: SolutionTechniqueEnum.HiddenSingle });

    return currentRunMoveService;
});

describe('CurrentRunMoveService', () => {
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
            assert.deepStrictEqual(yield* getTechniqueUsageCounts, { [SolutionTechniqueEnum.NakedSingle]: 1 });
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('undoes a placement for its points plus the undo penalty and redoes it with a fresh think time', () =>
        Effect.gen(function* () {
            const currentRunMoveService = yield* placeClassifiedCell;
            const fieldState = { sudokuString: startedSudokuString, candidates: {} };

            yield* currentRunMoveService.undo(fieldState);

            const undoneRun = yield* getRun;

            assert.deepInclude(undoneRun, { sudokuString: startedSudokuString, score: 0, timelineEvents: [] });
            assert.strictEqual(undoneRun.undoneMoves.length, 1);
            assert.deepStrictEqual(yield* getTechniqueUsageCounts, {});

            yield* currentRunMoveService.undo(fieldState);
            yield* currentRunMoveService.redo({ sudokuString: placedSudokuString, candidates: placedCandidates });

            const redoneRun = yield* getRun;

            assert.deepInclude(redoneRun, { score: placementScore, undoneMoves: [] });
            assert.deepStrictEqual(
                redoneRun.timelineEvents.map(event => event.ts),
                [thinkTime]
            );
            assert.deepStrictEqual(yield* getTechniqueUsageCounts, { [SolutionTechniqueEnum.NakedSingle]: 1 });
        }).pipe(Effect.provide(ProgressTestLayer))
    );

    it.effect('charges a hint, strikes its eliminations and clears the redo stack', () =>
        Effect.gen(function* () {
            const currentRunMoveService = yield* CurrentRunMoveService;
            const hintPenalty = scoring.calculateHintPenalty(penaltyParams);

            yield* saveRun({
                score: hintPenalty + 1,
                candidates: placedCandidates,
                undoneMoves: [{ kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts: 1 }]
            });
            yield* currentRunMoveService.hint([
                { cell: { x: 1, y: 1, value: 0, group: 0 }, value: 7 },
                { cell: { x: 5, y: 5, value: 0, group: 0 }, value: 7 }
            ]);
            yield* currentRunMoveService.hint([]);

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
            const currentRunMoveService = yield* CurrentRunMoveService;
            const inputState = { inputMode: 'candidate' as const, showAutoCandidates: true };

            yield* saveRun({ isChallengeRun: true });
            yield* currentRunMoveService.mistake(placedCell);
            yield* currentRunMoveService.toggleCellCandidate({ candidates: placedCandidates, cell: placedCell });
            yield* currentRunMoveService.toggleAutoCandidates(inputState);
            yield* currentRunMoveService.toggleAutoCandidates(inputState);

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
});
