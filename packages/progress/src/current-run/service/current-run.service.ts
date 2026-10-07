import { SharedPayloadKindEnum, TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { getCellKey } from '@suuudokuuu/field-core';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import * as Clock from 'effect/Clock';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Option from 'effect/Option';
import { isNotUndefined, isUndefined } from 'effect/Predicate';
import * as SqlClient from 'effect/sql/SqlClient';
import * as Struct from 'effect/Struct';

import { getDayNumber } from '../../@generic/utils/get-day-number.util';
import { getDayStreak } from '../../@generic/utils/get-day-streak.util';
import { CompletedGameRepository } from '../../completed-game/repository/completed-game.repository';
import { DifficultyStatsRepository } from '../../difficulty-stats/repository/difficulty-stats.repository';
import { PlayerStatsRepository } from '../../player-stats/repository/player-stats.repository';
import { SudokuScoring } from '../../scoring/class/sudoku-scoring';
import { defaultScoringConfig } from '../../scoring/constant/default-scoring-config.constant';
import { initialCurrentRun } from '../constant/initial-current-run.constant';
import { CurrentRunRepository } from '../repository/current-run.repository';
import { gameStateToString } from '../utils/game-state-to-string.util';

import type { DifficultyStatsType } from '../../difficulty-stats/type/difficulty-stats.type';
import type { PlayerStatsType } from '../../player-stats/type/player-stats.type';
import type { CurrentRunType } from '../type/current-run.type';
import type { CellTimelineEventType, TimelineEventType } from '../type/timeline-event.type';
import type { StepScriptCandidateInterface } from '@suuudokuuu/field-core';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

type TechniqueUsageCountsType = PlayerStatsType['techniqueUsageCounts'];
type FieldStateType = Pick<CurrentRunType, 'candidates' | 'eliminatedCandidates' | 'sudokuString'>;
type InputStateType = Pick<CurrentRunType, 'inputMode' | 'showAutoCandidates'>;
type StatsMoveType = (run: CurrentRunType, counts: TechniqueUsageCountsType) => [CurrentRunType, TechniqueUsageCountsType];
type TimelineMarkerKindType = Exclude<
    TimelineEventType['kind'],
    TimelineEventKindEnum.Cell | TimelineEventKindEnum.Mistake | TimelineEventKindEnum.Pencil
>;

const MillisecondsPerSecond = 1000;
const MaxTimelineTimestamp = 65_535;

const scoring = new SudokuScoring(defaultScoringConfig);

const getTimelineTimestampDelta = (run: CurrentRunType): number => {
    const cumulativeTime = run.timelineEvents.reduce((total, event) => total + event.ts, 0);

    return Math.min(Math.max(run.elapsedTime - cumulativeTime, 0), MaxTimelineTimestamp);
};

const withTimelineMarker = (run: CurrentRunType, kind: TimelineMarkerKindType): CurrentRunType => ({
    ...run,
    timelineEvents: [...run.timelineEvents, { kind, ts: getTimelineTimestampDelta(run) }]
});

const getCellIndex = (cell: Pick<CellInterface, 'x' | 'y'>): number => cell.y * defaultSudokuConfig.fieldSize + cell.x;

const isCellEvent = (event: TimelineEventType): event is CellTimelineEventType => event.kind === TimelineEventKindEnum.Cell;

const isLastEventAway = (run: CurrentRunType): boolean => run.timelineEvents.at(-1)?.kind === TimelineEventKindEnum.Away;

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

const resumeRun = (run: CurrentRunType): CurrentRunType => ({
    ...run,
    isPaused: false,
    shouldShowPauseScreen: false,
    shouldResumeOnFocus: false
});

const pauseRun = (run: CurrentRunType, shouldShowPauseScreen: boolean): CurrentRunType =>
    run.isChallengeRun ? run : { ...run, isPaused: true, shouldShowPauseScreen, shouldResumeOnFocus: !shouldShowPauseScreen };

const syncChallengeClock = (run: CurrentRunType, nowMs: number): CurrentRunType => {
    if (!run.isChallengeRun) {
        return run;
    }

    if (run.wallClockStartMs === 0) {
        return { ...run, wallClockStartMs: nowMs - run.elapsedTime * MillisecondsPerSecond };
    }

    const wallElapsedSeconds = Math.floor((nowMs - run.wallClockStartMs) / MillisecondsPerSecond);

    return wallElapsedSeconds > run.elapsedTime ? { ...run, elapsedTime: wallElapsedSeconds } : run;
};

const returnToRun = (run: CurrentRunType, nowMs: number): CurrentRunType => {
    const syncedRun = syncChallengeClock(run, nowMs);

    if (!isLastEventAway(syncedRun)) {
        return syncedRun;
    }

    if (getTimelineTimestampDelta(syncedRun) === 0) {
        return { ...syncedRun, timelineEvents: syncedRun.timelineEvents.slice(0, -1) };
    }

    return withTimelineMarker(syncedRun, TimelineEventKindEnum.Return);
};

const saveMove = (
    run: CurrentRunType,
    {
        sudokuString,
        candidates,
        eliminatedCandidates,
        correctCell,
        scoredCells
    }: FieldStateType & { correctCell: CellInterface; scoredCells: ScoredCellsInterface }
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
        eliminatedCandidates,
        score: run.score + score,
        undoneMoves: [],
        timelineEvents: [...run.timelineEvents, cellEvent]
    };
};

const classifyMove =
    ({ cell, technique }: { cell: CellInterface; technique: SolutionTechniqueEnum }): StatsMoveType =>
    (run, counts) => {
        const cellIndex = getCellIndex(cell);
        const cellEvent = run.timelineEvents
            .filter(isCellEvent)
            .findLast(event => event.cellIndex === cellIndex && event.value === cell.value);

        if (isUndefined(cellEvent) || isNotUndefined(cellEvent.technique)) {
            return [run, counts];
        }

        const timelineEvents = run.timelineEvents.map(event => (event === cellEvent ? { ...cellEvent, technique } : event));

        return [{ ...run, timelineEvents }, applyTechniqueUsageDelta(counts, technique, 1)];
    };

const applyHint = (run: CurrentRunType, eliminations: readonly StepScriptCandidateInterface[]): CurrentRunType => {
    const penalty = scoring.calculateHintPenalty(run);
    const candidates = { ...run.candidates };
    const eliminatedCandidates = { ...run.eliminatedCandidates };

    eliminations.forEach(({ cell, value }) => {
        const key = getCellKey(cell);

        eliminatedCandidates[key] = [...new Set([...(eliminatedCandidates[key] ?? []), value])];

        if (key in candidates) {
            candidates[key] = candidates[key].filter(candidate => candidate !== value);
        }
    });

    return {
        ...withTimelineMarker(run, TimelineEventKindEnum.Hint),
        score: Math.max(run.score - penalty, 0),
        undoneMoves: [],
        candidates,
        eliminatedCandidates
    };
};

const undoMove =
    (fieldState: FieldStateType): StatsMoveType =>
    (run, counts) => {
        const nextRun = { ...run, ...fieldState };
        const undoneMove = run.timelineEvents.findLast(isCellEvent);

        if (run.sudokuString === fieldState.sudokuString || isUndefined(undoneMove)) {
            return [nextRun, counts];
        }

        const undoneIndex = run.timelineEvents.lastIndexOf(undoneMove);
        const timelineEvents = run.timelineEvents
            .map((event, index) => (index === undoneIndex + 1 ? { ...event, ts: event.ts + undoneMove.ts } : event))
            .filter(event => event !== undoneMove);
        const score = Math.max(run.score - (undoneMove.score ?? 0) - scoring.calculateUndoPenalty(run), 0);

        return [
            { ...nextRun, timelineEvents, score, undoneMoves: [...run.undoneMoves, undoneMove] },
            applyTechniqueUsageDelta(counts, undoneMove.technique, -1)
        ];
    };

const redoMove =
    (fieldState: FieldStateType): StatsMoveType =>
    (run, counts) => {
        const nextRun = { ...run, ...fieldState };
        const redoneMove = run.undoneMoves.at(-1);

        if (run.sudokuString === fieldState.sudokuString || isUndefined(redoneMove)) {
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

const toggleCellCandidate = (run: CurrentRunType, { candidates, cell }: Pick<CurrentRunType, 'candidates'> & { cell: CellInterface }) => {
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

const getFinishedStats = (stats: DifficultyStatsType, run: CurrentRunType, isWon: boolean, isChallenge: boolean): DifficultyStatsType => {
    const challengeCount = isChallenge ? 1 : 0;

    if (!isWon) {
        return {
            ...stats,
            gamesCompleted: stats.gamesCompleted + 1,
            gamesLost: stats.gamesLost + 1,
            challengesLost: stats.challengesLost + challengeCount
        };
    }

    const isBestRating = run.rating > stats.bestRating;

    return {
        ...stats,
        gamesCompleted: stats.gamesCompleted + 1,
        averageTime: (stats.averageTime * stats.gamesWon + run.elapsedTime) / (stats.gamesWon + 1),
        bestTime: stats.bestTime === 0 || run.elapsedTime < stats.bestTime ? run.elapsedTime : stats.bestTime,
        gamesWon: stats.gamesWon + 1,
        gamesWonWithoutMistakes: stats.gamesWonWithoutMistakes + (run.mistakes === 0 ? 1 : 0),
        hardcoreWon: stats.hardcoreWon + (run.maxMistakes === 0 ? 1 : 0),
        challengesWon: stats.challengesWon + challengeCount,
        bestScore: Math.max(stats.bestScore, run.score),
        bestRating: isBestRating ? run.rating : stats.bestRating,
        isBestRatingCeiling: isBestRating ? run.isRatingCeiling : stats.isBestRatingCeiling
    };
};

export class CurrentRunService extends Context.Service<CurrentRunService>()('@suuudokuuu/progress/CurrentRunService', {
    make: Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const currentRunRepository = yield* CurrentRunRepository;
        const playerStatsRepository = yield* PlayerStatsRepository;
        const difficultyStatsRepository = yield* DifficultyStatsRepository;
        const completedGameRepository = yield* CompletedGameRepository;

        const updateRunWithStats = Effect.fnUntraced(
            function* (statsMove: StatsMoveType) {
                const currentRun = yield* currentRunRepository.get;

                if (Option.isNone(currentRun)) {
                    return;
                }

                const playerStats = yield* playerStatsRepository.get;
                const [nextRun, techniqueUsageCounts] = statsMove(currentRun.value, playerStats.techniqueUsageCounts);

                if (nextRun !== currentRun.value) {
                    yield* currentRunRepository.save(nextRun);
                }

                if (techniqueUsageCounts !== playerStats.techniqueUsageCounts) {
                    yield* playerStatsRepository.save({ ...playerStats, techniqueUsageCounts });
                }
            },
            effect => sql.withTransaction(effect),
            Effect.orDie
        );
        const updateRun = (update: (run: CurrentRunType) => CurrentRunType) => updateRunWithStats((run, counts) => [update(run), counts]);

        return {
            start: (
                setup: Pick<
                    CurrentRunType,
                    'dailyDayNumber' | 'difficulty' | 'isChallengeRun' | 'isRatingCeiling' | 'maxMistakes' | 'rating' | 'sudokuString'
                >
            ) => currentRunRepository.save({ ...initialCurrentRun, ...setup }),
            load: Effect.fn('CurrentRunService.load')(function* (run: CurrentRunType) {
                const nowMs = yield* Clock.currentTimeMillis;
                const needsWallClock = run.challengeState !== '' || run.isChallengeRun;

                yield* currentRunRepository.save(resumeRun({ ...run, ...(needsWallClock && { wallClockStartMs: nowMs }) }));
            }),
            reset: sql.withTransaction(Effect.tap(currentRunRepository.get, () => currentRunRepository.remove)).pipe(Effect.orDie),
            pause: (shouldShowPauseScreen = true) => updateRun(run => pauseRun(run, shouldShowPauseScreen)),
            resume: updateRun(resumeRun),
            focus: Effect.fn('CurrentRunService.focus')(function* () {
                const nowMs = yield* Clock.currentTimeMillis;
                const currentRun = yield* currentRunRepository.get;

                if (Option.isNone(currentRun)) {
                    return { isChallengeRun: false, shouldRunTimer: false };
                }

                const { isChallengeRun, isPaused, shouldResumeOnFocus } = currentRun.value;

                yield* updateRun(run => {
                    const resumedRun = isPaused && shouldResumeOnFocus ? resumeRun(run) : run;

                    return isChallengeRun ? returnToRun(resumedRun, nowMs) : resumedRun;
                });

                return { isChallengeRun, shouldRunTimer: !isPaused || shouldResumeOnFocus };
            }),
            returnToRun: Effect.flatMap(Clock.currentTimeMillis, nowMs => updateRun(run => returnToRun(run, nowMs))),
            leaveRun: updateRun(run =>
                !run.isChallengeRun || isLastEventAway(run) ? run : withTimelineMarker(run, TimelineEventKindEnum.Away)
            ),
            screenshot: updateRun(run => (run.isChallengeRun ? withTimelineMarker(run, TimelineEventKindEnum.Screenshot) : run)),
            save: (move: Parameters<typeof saveMove>[1]) => updateRun(run => saveMove(run, move)),
            classifyMove: (move: Parameters<typeof classifyMove>[0]) => updateRunWithStats(classifyMove(move)),
            hint: (eliminations: readonly StepScriptCandidateInterface[]) => updateRun(run => applyHint(run, eliminations)),
            undo: (fieldState: FieldStateType) => updateRunWithStats(undoMove(fieldState)),
            redo: (fieldState: FieldStateType) => updateRunWithStats(redoMove(fieldState)),
            mistake: (cell: CellInterface) => updateRun(run => recordMistake(run, cell)),
            toggleAutoCandidates: (inputState: InputStateType) => updateRun(run => toggleAutoCandidates(run, inputState)),
            toggleInputMode: (inputState: InputStateType) => updateRun(run => ({ ...run, ...inputState })),
            toggleCellCandidate: (payload: Parameters<typeof toggleCellCandidate>[1]) =>
                updateRun(run => toggleCellCandidate(run, payload)),
            finish: Effect.fn('CurrentRunService.finish')(
                function* (isWon: boolean, isChallenge: boolean) {
                    const nowMs = yield* Clock.currentTimeMillis;
                    const currentRun = yield* currentRunRepository.get;

                    if (Option.isNone(currentRun)) {
                        return;
                    }

                    const run = currentRun.value;
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
                    yield* difficultyStatsRepository.save(getFinishedStats(stats, run, isWon, isChallenge));

                    if (isWon) {
                        yield* completedGameRepository.insert({
                            ...Struct.pick(run, [
                                'difficulty',
                                'rating',
                                'isRatingCeiling',
                                'elapsedTime',
                                'score',
                                'mistakes',
                                'maxMistakes'
                            ]),
                            encodedState: gameStateToString(run, SharedPayloadKindEnum.Handoff),
                            completedAt: nowMs,
                            dailyDayNumber: run.dailyDayNumber > 0 ? run.dailyDayNumber : null
                        });
                    }
                },
                effect => sql.withTransaction(effect),
                Effect.orDie
            )
        };
    })
}) {
    static readonly layer = Layer.effect(CurrentRunService, CurrentRunService.make).pipe(
        Layer.provide(
            Layer.mergeAll(
                CurrentRunRepository.layer,
                PlayerStatsRepository.layer,
                DifficultyStatsRepository.layer,
                CompletedGameRepository.layer
            )
        )
    );
}
