import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import { getTapeTechniqueEvents } from './get-tape-technique-events.util';

import type { GameTimelineEventInterface } from '../../game/interface/game-timeline-event.interface';

describe('getTapeTechniqueEvents', () => {
    it('should accumulate the time of every event before a placement', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Away, ts: 5 },
            { kind: TimelineEventKindEnum.Return, ts: 5 },
            { kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts: 10, technique: SolutionTechniqueEnum.NakedSingle }
        ];

        expect(getTapeTechniqueEvents(events).map(event => event.cumulativeTime)).toStrictEqual([20]);
    });

    it('should tier every classified placement', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts: 1, technique: SolutionTechniqueEnum.XWing }
        ];

        expect(getTapeTechniqueEvents(events)[0].tier).toBe(ChallengeTechniqueTierEnum.Advanced);
    });

    it('should skip placements that were never classified', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts: 1 },
            { kind: TimelineEventKindEnum.Mistake, cellIndex: 1, value: 2, ts: 1 }
        ];

        expect(getTapeTechniqueEvents(events)).toStrictEqual([]);
    });
});
