import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { describe, expect, it } from 'vitest';

import { getTimelineCellTechniques } from '../../src/current-run/utils/get-timeline-cell-techniques.util';

import type { TimelineEventType } from '../../src/current-run/type/timeline-event.type';

const events: TimelineEventType[] = [
    { kind: TimelineEventKindEnum.Cell, cellIndex: 1, value: 4, ts: 2, technique: SolutionTechniqueEnum.NakedSingle },
    { kind: TimelineEventKindEnum.Away, ts: 3 },
    { kind: TimelineEventKindEnum.Cell, cellIndex: 2, value: 7, ts: 1 },
    { kind: TimelineEventKindEnum.Cell, cellIndex: 3, value: 9, ts: 1, technique: SolutionTechniqueEnum.Guess }
];

describe('getTimelineCellTechniques', () => {
    it('should list one entry per cell event in timeline order', () => {
        expect.assertions(1);

        expect(getTimelineCellTechniques(events)).toStrictEqual([SolutionTechniqueEnum.NakedSingle, null, SolutionTechniqueEnum.Guess]);
    });

    it('should return nothing for a timeline without cell events', () => {
        expect.assertions(1);

        expect(getTimelineCellTechniques([{ kind: TimelineEventKindEnum.Away, ts: 3 }])).toStrictEqual([]);
    });
});
