import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameChallengeStateSelector } from '../../game/store/game.selectors';
import { stringToGameState } from '../../game/utils/string-to-game-state.util';
import { getRunTechniqueEvents } from '../utils/get-run-technique-events.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

export const useChallengeTechniqueEvents = (): ChallengeTechniqueEventInterface[] => {
    const challengeState = useAppSelector(gameChallengeStateSelector);

    const rivalGameState = stringToGameState(challengeState);

    return getRunTechniqueEvents(rivalGameState.challengeTimelineEvents, rivalGameState.sudokuString);
};
