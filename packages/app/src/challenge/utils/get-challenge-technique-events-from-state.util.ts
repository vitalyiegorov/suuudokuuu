import { getTimelineCellSteps } from '../../game/utils/get-timeline-cell-steps.util';
import { stringToGameState } from '../../game/utils/string-to-game-state.util';

import { getChallengeTechniqueEvents } from './get-challenge-technique-events.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

export const getChallengeTechniqueEventsFromState = (challengeState: string): ChallengeTechniqueEventInterface[] => {
    const gameState = stringToGameState(challengeState);

    return getChallengeTechniqueEvents(
        gameState.sudokuString,
        getTimelineCellSteps(gameState.challengeTimelineEvents),
        gameState.challengeTime
    );
};
