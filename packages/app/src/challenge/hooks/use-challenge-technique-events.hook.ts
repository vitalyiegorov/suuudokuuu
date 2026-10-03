import { useCurrentRun } from '../../game/query/use-current-run.query';
import { stringToGameState } from '../../game/utils/string-to-game-state.util';
import { getRunTechniqueEvents } from '../utils/get-run-technique-events.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

export const useChallengeTechniqueEvents = (): ChallengeTechniqueEventInterface[] => {
    const { challengeState } = useCurrentRun();

    const rivalGameState = stringToGameState(challengeState);

    return getRunTechniqueEvents(rivalGameState.challengeTimelineEvents, rivalGameState.sudokuString);
};
