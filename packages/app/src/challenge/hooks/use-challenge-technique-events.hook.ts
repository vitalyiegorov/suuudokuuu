import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameChallengeStateSelector } from '../../game/store/game.selectors';
import { getChallengeTechniqueEventsFromState } from '../utils/get-challenge-technique-events-from-state.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

export const useChallengeTechniqueEvents = (): ChallengeTechniqueEventInterface[] => {
    const challengeState = useAppSelector(gameChallengeStateSelector);

    return getChallengeTechniqueEventsFromState(challengeState);
};
