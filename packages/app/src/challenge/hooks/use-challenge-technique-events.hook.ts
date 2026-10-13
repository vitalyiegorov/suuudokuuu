import { useCurrentRun } from '../../game/query/use-current-run.query';
import { decodeSharedGameState } from '../../game/utils/decode-shared-game-state.util';
import { getRunTechniqueEvents } from '../utils/get-run-technique-events.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

export const useChallengeTechniqueEvents = (): ChallengeTechniqueEventInterface[] => {
    const { challengeState } = useCurrentRun();

    const rivalGameState = decodeSharedGameState(challengeState).gameState;

    return getRunTechniqueEvents(rivalGameState.challengeTimelineEvents, rivalGameState.sudokuString);
};
