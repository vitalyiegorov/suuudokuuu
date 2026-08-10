import { GameStateSerializer, SharedPayloadKindEnum, applyCellEventsToField } from '@suuudokuuu/encoder';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

import { GameState, initialGameState } from '../store/game.state';

import { getDifficultyFromOrdinal } from './get-difficulty-from-ordinal.util';
import { getKeyedCandidates } from './get-keyed-candidates.util';
import { getTimelineMistakesCount } from './get-timeline-mistakes-count.util';

const RatingWireScale = 10;

const serializer = new GameStateSerializer();

export const stringToGameState = (gameStateString = ''): GameState => {
    try {
        const decoded = serializer.decodeState(gameStateString);
        const isChallenge = decoded.kind === SharedPayloadKindEnum.Challenge;
        const isHandoff = decoded.kind === SharedPayloadKindEnum.Handoff;
        const explicitDifficulty = getDifficultyFromOrdinal(decoded.difficulty);
        const [, inferredDifficulty] = Sudoku.convertFieldFromString(decoded.field, defaultSudokuConfig);

        return {
            ...initialGameState,
            sudokuString: decoded.field,
            difficulty: isDefined(explicitDifficulty) ? explicitDifficulty : inferredDifficulty,
            maxMistakes: decoded.maxMistakes,
            rating: decoded.rating / RatingWireScale,
            isRatingCeiling: decoded.isRatingCeiling,

            ...(isChallenge && {
                challengeTimelineEvents: decoded.timelineEvents,
                challengeTime: decoded.elapsedTime,
                challengeState: gameStateString,
                isChallengeRun: true
            }),

            ...(isHandoff && {
                sudokuString: applyCellEventsToField(decoded.field, decoded.timelineEvents),
                timelineEvents: decoded.timelineEvents,
                elapsedTime: decoded.elapsedTime,
                score: decoded.score,
                mistakes: getTimelineMistakesCount(decoded.timelineEvents),
                candidates: getKeyedCandidates(decoded.candidates),
                isChallengeRun: decoded.isChallengeRun,
                wallClockStartMs: decoded.anchorSeconds * 1000
            })
        } satisfies GameState;
    } catch {
        return initialGameState;
    }
};
