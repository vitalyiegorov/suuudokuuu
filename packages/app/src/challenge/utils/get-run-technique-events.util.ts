import { isNotEmptyArray } from '@rnw-community/shared';

import { getTimelineCellSteps } from '../../game/utils/get-timeline-cell-steps.util';

import { getChallengeTechniqueEvents } from './get-challenge-technique-events.util';
import { getTapeTechniqueEvents } from './get-tape-technique-events.util';

import type { GameTimelineEventInterface } from '../../game/interface/game-timeline-event.interface';
import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

export const getRunTechniqueEvents = (events: GameTimelineEventInterface[], givens: string): ChallengeTechniqueEventInterface[] => {
    const storedTechniqueEvents = getTapeTechniqueEvents(events);

    if (isNotEmptyArray(storedTechniqueEvents)) {
        return storedTechniqueEvents;
    }

    return getChallengeTechniqueEvents(givens, getTimelineCellSteps(events));
};
