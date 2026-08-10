import { seTechniqueRatings } from '@suuudokuuu/rating';

import { isEmptyArray } from '@rnw-community/shared';

import type { ChallengeTechniqueEventInterface } from '../../challenge/interfaces/challenge-technique-event.interface';
import type { ReplayHardestStepInterface } from '../interfaces/replay-hardest-step.interface';

export const getReplayHardestStep = (techniqueEvents: readonly ChallengeTechniqueEventInterface[]): ReplayHardestStepInterface | null => {
    if (isEmptyArray(techniqueEvents)) {
        return null;
    }

    let hardestIndex = 0;

    for (let index = 1; index < techniqueEvents.length; index += 1) {
        if (seTechniqueRatings[techniqueEvents[index].technique] > seTechniqueRatings[techniqueEvents[hardestIndex].technique]) {
            hardestIndex = index;
        }
    }

    return { stepNumber: hardestIndex + 1, technique: techniqueEvents[hardestIndex].technique };
};
