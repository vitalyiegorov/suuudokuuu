import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { withTimelineCellTechniques } from './with-timeline-cell-techniques.util';

import type { TimelineEventInterface } from '@suuudokuuu/encoder';

const events: TimelineEventInterface[] = [
    { kind: TimelineEventKindEnum.Cell, cellIndex: 1, value: 4, ts: 2 },
    { kind: TimelineEventKindEnum.Away, ts: 3 },
    { kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 7, ts: 1 }
];

describe('withTimelineCellTechniques', () => {
    it('should attach one stored technique per cell event', () => {
        expect.assertions(1);

        expect(withTimelineCellTechniques(events, [SolutionTechniqueEnum.XWing, SolutionTechniqueEnum.Guess])).toStrictEqual([
            { kind: TimelineEventKindEnum.Cell, cellIndex: 1, value: 4, ts: 2, technique: SolutionTechniqueEnum.XWing },
            { kind: TimelineEventKindEnum.Away, ts: 3 },
            { kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 7, ts: 1, technique: SolutionTechniqueEnum.Guess }
        ]);
    });

    it('should leave legacy events untouched when no stream was stored', () => {
        expect.assertions(1);

        expect(withTimelineCellTechniques(events, null)).toStrictEqual(events);
    });

    it('should skip entries that are unknown or outside the technique enum', () => {
        expect.assertions(1);

        expect(withTimelineCellTechniques(events, [null, 99])).toStrictEqual(events);
    });
});
