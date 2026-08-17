import { getRunTechniqueEvents } from '../../challenge/utils/get-run-technique-events.util';

import { getReplayTimeline } from './get-replay-timeline.util';

import type { ChallengeTechniqueEventInterface } from '../../challenge/interfaces/challenge-technique-event.interface';
import type { GameState } from '../../game/store/game.state';

export const getReplayRunTechniqueEvents = (gameState: GameState): ChallengeTechniqueEventInterface[] => {
    const { events, givens } = getReplayTimeline(gameState);

    return getRunTechniqueEvents(events, givens);
};
