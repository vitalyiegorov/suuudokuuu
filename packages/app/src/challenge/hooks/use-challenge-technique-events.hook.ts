import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameChallengeStateSelector } from '../../game/store/game.selectors';
import { getTimelineCellSteps } from '../../game/utils/get-timeline-cell-steps.util';
import { stringToGameState } from '../../game/utils/string-to-game-state.util';
import { getChallengeTechniqueEvents } from '../utils/get-challenge-technique-events.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

export const useChallengeTechniqueEvents = (): ChallengeTechniqueEventInterface[] => {
    const challengeState = useAppSelector(gameChallengeStateSelector);

    const rivalGameState = stringToGameState(challengeState);

    return getChallengeTechniqueEvents(rivalGameState.sudokuString, getTimelineCellSteps(rivalGameState.challengeTimelineEvents));
};
