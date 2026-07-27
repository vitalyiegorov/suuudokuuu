import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { isDefined } from '@rnw-community/shared';

import { getTechniqueTier } from './get-technique-tier.util';

import type { GameTimelineEventInterface } from '../../game/interface/game-timeline-event.interface';
import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

const PercentBase = 100;

export const getTapeTechniqueEvents = (events: GameTimelineEventInterface[], elapsedTime: number): ChallengeTechniqueEventInterface[] => {
    const techniqueEvents: ChallengeTechniqueEventInterface[] = [];
    let cumulativeTime = 0;

    for (const event of events) {
        cumulativeTime += event.ts;

        if (event.kind === TimelineEventKindEnum.Cell && isDefined(event.technique)) {
            techniqueEvents.push({
                cumulativeTime,
                positionPercent: elapsedTime > 0 ? (cumulativeTime / elapsedTime) * PercentBase : 0,
                technique: event.technique,
                tier: getTechniqueTier(event.technique)
            });
        }
    }

    return techniqueEvents;
};
