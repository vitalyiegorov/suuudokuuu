import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { getCellKey } from '@suuudokuuu/field-core';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Option from 'effect/Option';
import { isNotUndefined, isUndefined } from 'effect/Predicate';
import * as SqlClient from 'effect/sql/SqlClient';

import { PlayerStatsRepository } from '../../player-stats/repository/player-stats.repository';
import { SudokuScoring } from '../../scoring/class/sudoku-scoring';
import { defaultScoringConfig } from '../../scoring/constant/default-scoring-config.constant';
import { CurrentRunRepository } from '../repository/current-run.repository';
import { getTimelineTimestampDelta } from '../utils/get-timeline-timestamp-delta.util';
import { withTimelineMarker } from '../utils/with-timeline-marker.util';

import type { PlayerStatsType } from '../../player-stats/type/player-stats.type';
import type { GameCellCandidatePayloadInterface } from '../interface/game-cell-candidate-payload.interface';
import type { GameClassifyMovePayloadInterface } from '../interface/game-classify-move-payload.interface';
import type { GameFieldStatePayloadInterface } from '../interface/game-field-state-payload.interface';
import type { GameSavePayloadInterface } from '../interface/game-save-payload.interface';
import type { CurrentRunType } from '../type/current-run.type';
import type { CellTimelineEventType, TimelineEventType } from '../type/timeline-event.type';
import type { StepScriptCandidateInterface } from '@suuudokuuu/field-core';
import type { CellInterface } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

type TechniqueUsageCountsType = PlayerStatsType['techniqueUsageCounts'];
type InputStateType = Pick<CurrentRunType, 'inputMode' | 'showAutoCandidates'>;
type StatsMoveType = (run: CurrentRunType, counts: TechniqueUsageCountsType) => [CurrentRunType, TechniqueUsageCountsType];

const scoring = new SudokuScoring(defaultScoringConfig);

const getCellIndex = (cell: Pick<CellInterface, 'x' | 'y'>): number => cell.y * defaultSudokuConfig.fieldSize + cell.x;

const isCellEvent = (event: TimelineEventType): event is CellTimelineEventType => event.kind === TimelineEventKindEnum.Cell;

const applyTechniqueUsageDelta = (counts: TechniqueUsageCountsType, technique: SolutionTechniqueEnum | undefined, delta: number) => {
    if (isUndefined(technique)) {
        return counts;
    }

    const nextCount = (counts[technique] ?? 0) + delta;
    const nextCounts = { ...counts, [technique]: nextCount };

    if (nextCount <= 0) {
        Reflect.deleteProperty(nextCounts, technique);
    }

    return nextCounts;
};

const saveMove = (
    run: CurrentRunType,
    { sudokuString, candidates, correctCell, scoredCells }: GameSavePayloadInterface
): CurrentRunType => {
    const { difficulty, mistakes, elapsedTime, maxMistakes } = run;
    const score = scoring.calculate({ scoredCells, difficulty, mistakes, elapsedTime, maxMistakes });
    const cellEvent = {
        kind: TimelineEventKindEnum.Cell,
        cellIndex: getCellIndex(correctCell),
        value: correctCell.value,
        ts: getTimelineTimestampDelta(run),
        score
    } as const;

    return {
        ...run,
        sudokuString,
        candidates,
        score: run.score + score,
        undoneMoves: [],
        timelineEvents: [...run.timelineEvents, cellEvent]
    };
};

const classifyMove: (payload: GameClassifyMovePayloadInterface) => StatsMoveType =
    ({ cell, technique }) =>
    (run, counts) => {
        const cellIndex = getCellIndex(cell);
        const cellEvent = run.timelineEvents.findLast(
            event => isCellEvent(event) && event.cellIndex === cellIndex && event.value === cell.value
        );

        if (isUndefined(cellEvent) || !isCellEvent(cellEvent) || isNotUndefined(cellEvent.technique)) {
            return [run, counts];
        }

        const timelineEvents = run.timelineEvents.map(event => (event === cellEvent ? { ...cellEvent, technique } : event));

        return [{ ...run, timelineEvents }, applyTechniqueUsageDelta(counts, technique, 1)];
    };

const applyHint = (run: CurrentRunType, eliminations: readonly StepScriptCandidateInterface[]): CurrentRunType => {
    const penalty = scoring.calculateHintPenalty({ difficulty: run.difficulty, maxMistakes: run.maxMistakes });
    const candidates = { ...run.candidates };

    eliminations.forEach(elimination => {
        const key = getCellKey(elimination.cell);
        const cellCandidates = Option.fromNullishOr(candidates[key]);

        if (Option.isSome(cellCandidates)) {
            candidates[key] = cellCandidates.value.filter(candidate => candidate !== elimination.value);
        }
    });

    return { ...withTimelineMarker(run, TimelineEventKindEnum.Hint), score: Math.max(run.score - penalty, 0), undoneMoves: [], candidates };
};

const undoMove: (fieldState: GameFieldStatePayloadInterface) => StatsMoveType =
    ({ sudokuString, candidates }) =>
    (run, counts) => {
        const nextRun = { ...run, sudokuString, candidates };
        const undoneMove = run.timelineEvents.findLast(isCellEvent);

        if (run.sudokuString === sudokuString || isUndefined(undoneMove)) {
            return [nextRun, counts];
        }

        const undoneIndex = run.timelineEvents.lastIndexOf(undoneMove);
        const timelineEvents = run.timelineEvents
            .map((event, index) => (index === undoneIndex + 1 ? { ...event, ts: event.ts + undoneMove.ts } : event))
            .filter(event => event !== undoneMove);
        const penalty = scoring.calculateUndoPenalty({ difficulty: run.difficulty, maxMistakes: run.maxMistakes });
        const score = Math.max(run.score - (undoneMove.score ?? 0) - penalty, 0);

        return [
            { ...nextRun, timelineEvents, score, undoneMoves: [...run.undoneMoves, undoneMove] },
            applyTechniqueUsageDelta(counts, undoneMove.technique, -1)
        ];
    };

const redoMove: (fieldState: GameFieldStatePayloadInterface) => StatsMoveType =
    ({ sudokuString, candidates }) =>
    (run, counts) => {
        const nextRun = { ...run, sudokuString, candidates };
        const redoneMove = run.undoneMoves.at(-1);

        if (run.sudokuString === sudokuString || isUndefined(redoneMove)) {
            return [nextRun, counts];
        }

        const timelineEvents = [...run.timelineEvents, { ...redoneMove, ts: getTimelineTimestampDelta(run) }];

        return [
            { ...nextRun, timelineEvents, undoneMoves: run.undoneMoves.slice(0, -1), score: run.score + (redoneMove.score ?? 0) },
            applyTechniqueUsageDelta(counts, redoneMove.technique, 1)
        ];
    };

const recordMistake = (run: CurrentRunType, cell: CellInterface): CurrentRunType => {
    const mistakeEvent = {
        kind: TimelineEventKindEnum.Mistake,
        cellIndex: getCellIndex(cell),
        value: cell.value,
        ts: getTimelineTimestampDelta(run)
    } as const;

    return { ...run, mistakes: run.mistakes + 1, timelineEvents: [...run.timelineEvents, mistakeEvent] };
};

const toggleAutoCandidates = (run: CurrentRunType, inputState: InputStateType): CurrentRunType => {
    const hasRecordedAssist = run.timelineEvents.some(event => event.kind === TimelineEventKindEnum.AutoCandidates);
    const nextRun = { ...run, ...inputState };

    return inputState.showAutoCandidates && !hasRecordedAssist
        ? withTimelineMarker(nextRun, TimelineEventKindEnum.AutoCandidates)
        : nextRun;
};

const toggleCellCandidate = (run: CurrentRunType, { candidates, cell }: GameCellCandidatePayloadInterface): CurrentRunType => {
    const pencilEvent = {
        kind: TimelineEventKindEnum.Pencil,
        cellIndex: getCellIndex(cell),
        value: cell.value,
        ts: getTimelineTimestampDelta(run)
    } as const;

    return {
        ...run,
        candidates,
        undoneMoves: [],
        timelineEvents: run.isChallengeRun ? [...run.timelineEvents, pencilEvent] : run.timelineEvents
    };
};

export class CurrentRunMoveService extends Context.Service<CurrentRunMoveService>()('@suuudokuuu/progress/CurrentRunMoveService', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const currentRunRepository = yield* CurrentRunRepository;
        const playerStatsRepository = yield* PlayerStatsRepository;

        const updateRunWithStats = (statsMove: StatsMoveType) =>
            sql
                .withTransaction(
                    Effect.gen(function* () {
                        const currentRun = yield* currentRunRepository.get;
                        const playerStats = yield* playerStatsRepository.get;

                        if (Option.isNone(currentRun)) {
                            return;
                        }

                        const [nextRun, techniqueUsageCounts] = statsMove(currentRun.value, playerStats.techniqueUsageCounts);

                        yield* currentRunRepository.save(nextRun);

                        if (techniqueUsageCounts !== playerStats.techniqueUsageCounts) {
                            yield* playerStatsRepository.save({ ...playerStats, techniqueUsageCounts });
                        }
                    })
                )
                .pipe(Effect.orDie);

        return {
            save: (payload: GameSavePayloadInterface) => currentRunRepository.update(run => saveMove(run, payload)),
            classifyMove: (payload: GameClassifyMovePayloadInterface) => updateRunWithStats(classifyMove(payload)),
            hint: (eliminations: readonly StepScriptCandidateInterface[]) =>
                currentRunRepository.update(run => applyHint(run, eliminations)),
            undo: (fieldState: GameFieldStatePayloadInterface) => updateRunWithStats(undoMove(fieldState)),
            redo: (fieldState: GameFieldStatePayloadInterface) => updateRunWithStats(redoMove(fieldState)),
            mistake: (cell: CellInterface) => currentRunRepository.update(run => recordMistake(run, cell)),
            toggleAutoCandidates: (inputState: InputStateType) => currentRunRepository.update(run => toggleAutoCandidates(run, inputState)),
            toggleInputMode: (inputState: InputStateType) => currentRunRepository.update(run => ({ ...run, ...inputState })),
            toggleCellCandidate: (payload: GameCellCandidatePayloadInterface) =>
                currentRunRepository.update(run => toggleCellCandidate(run, payload))
        };
    })
}) {
    static readonly layer = Layer.effect(CurrentRunMoveService, CurrentRunMoveService.make).pipe(
        Layer.provide(Layer.mergeAll(CurrentRunRepository.layer, PlayerStatsRepository.layer))
    );
}
