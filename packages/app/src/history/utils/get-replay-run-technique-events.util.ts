import { getChallengeTechniqueEvents } from '../../challenge/utils/get-challenge-technique-events.util';
import { getTimelineCellSteps } from '../../game/utils/get-timeline-cell-steps.util';

import { getReplayTimeline } from './get-replay-timeline.util';

import type { ChallengeTechniqueEventInterface } from '../../challenge/interfaces/challenge-technique-event.interface';
import type { GameState } from '../../game/store/game.state';

export const getReplayRunTechniqueEvents = (gameState: GameState): ChallengeTechniqueEventInterface[] => {
    const { events, givens } = getReplayTimeline(gameState);
    const steps = getTimelineCellSteps(events);

    return getChallengeTechniqueEvents(givens, steps);
};
