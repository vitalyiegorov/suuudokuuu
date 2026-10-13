import { GameStateSerializer, SharedPayloadKindEnum, TimelineEventKindEnum, applyCellEventsToField } from '@suuudokuuu/encoder';
import { getCellKey } from '@suuudokuuu/field-core';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { initialCurrentRun } from '@suuudokuuu/progress';

import { isDefined, isNumber } from '@rnw-community/shared';

import { withTimelineCellTechniques } from './with-timeline-cell-techniques.util';

import type { CurrentRunType } from '@suuudokuuu/progress';

const RatingWireScale = 10;

const serializer = new GameStateSerializer();

interface DecodedSharedGameStateInterface {
    readonly gameState: CurrentRunType;
    readonly kind: SharedPayloadKindEnum;
}

const createEmptyRun = (): CurrentRunType => ({
    ...initialCurrentRun,
    candidates: {},
    eliminatedCandidates: {},
    timelineEvents: [],
    undoneMoves: [],
    challengeTimelineEvents: []
});

const getKeyedCandidates = (indexedCandidates: Record<number, number[]>): Record<string, number[]> => {
    const candidates: Record<string, number[]> = {};

    for (const [cellIndex, values] of Object.entries(indexedCandidates)) {
        const index = parseInt(cellIndex, 10);
        const x = index % defaultSudokuConfig.fieldSize;
        const y = Math.floor(index / defaultSudokuConfig.fieldSize);

        candidates[getCellKey({ x, y })] = values;
    }

    return candidates;
};

export const decodeSharedGameState = (gameStateString = ''): DecodedSharedGameStateInterface => {
    try {
        const decoded = serializer.decodeState(gameStateString);
        const timelineEvents = withTimelineCellTechniques(decoded.timelineEvents, decoded.techniques);
        const isChallenge = decoded.kind === SharedPayloadKindEnum.Challenge;
        const isHandoff = decoded.kind === SharedPayloadKindEnum.Handoff;
        const encodedDifficulty = isNumber(decoded.difficulty) ? Object.values(DifficultyEnum)[decoded.difficulty] : null;
        const difficulty = isDefined(encodedDifficulty)
            ? encodedDifficulty
            : Sudoku.convertFieldFromString(decoded.field, defaultSudokuConfig)[1];

        const gameState = {
            ...createEmptyRun(),
            sudokuString: decoded.field,
            difficulty,
            maxMistakes: decoded.maxMistakes,
            rating: decoded.rating / RatingWireScale,
            isRatingCeiling: decoded.isRatingCeiling,

            ...(isChallenge && {
                challengeTimelineEvents: timelineEvents,
                challengeTime: decoded.elapsedTime,
                challengeState: gameStateString,
                isChallengeRun: true
            }),

            ...(isHandoff && {
                sudokuString: applyCellEventsToField(decoded.field, decoded.timelineEvents),
                timelineEvents,
                elapsedTime: decoded.elapsedTime,
                score: decoded.score,
                mistakes: decoded.timelineEvents.filter(event => event.kind === TimelineEventKindEnum.Mistake).length,
                candidates: getKeyedCandidates(decoded.candidates),
                isChallengeRun: decoded.isChallengeRun,
                wallClockStartMs: decoded.anchorSeconds * 1000
            })
        } satisfies CurrentRunType;

        return { gameState, kind: decoded.kind };
    } catch {
        return { gameState: createEmptyRun(), kind: SharedPayloadKindEnum.Puzzle };
    }
};
