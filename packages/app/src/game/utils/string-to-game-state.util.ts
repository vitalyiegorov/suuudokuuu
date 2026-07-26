import { GameStateSerializer, SharedPayloadKindEnum } from '@suuudokuuu/encoder';

import { GameState, initialGameState } from '../store/game.state';

const serializer = new GameStateSerializer();

export const stringToGameState = (gameStateString = ''): GameState => {
    try {
        const decoded = serializer.decodeState(gameStateString);
        const isChallenge = decoded.kind === SharedPayloadKindEnum.Challenge;
        const isHandoff = decoded.kind === SharedPayloadKindEnum.Handoff;

        return {
            ...initialGameState,
            sudokuString: decoded.field,
            maxMistakes: decoded.maxMistakes,

            ...(isChallenge && {
                challengeTimelineEvents: decoded.timelineEvents,
                challengeTime: decoded.elapsedTime,
                challengeState: gameStateString,
                isChallengeRun: true
            }),

            ...(isHandoff && {
                timelineEvents: decoded.timelineEvents,
                elapsedTime: decoded.elapsedTime,
                score: decoded.score,
                candidates: decoded.candidates,
                isChallengeRun: decoded.isChallengeRun,
                wallClockStartMs: decoded.anchorSeconds * 1000
            })
        } satisfies GameState;
    } catch {
        return initialGameState;
    }
};
