import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { SolutionTechniqueEnum } from '@suuudokuuu/solver';

import { techniqueComplexityConstant } from '../constants/technique-complexity.constant';

import { getChallengeTapeMarks } from './get-challenge-tape-marks.util';

import type { GameTimelineEventInterface } from '../../game/interface/game-timeline-event.interface';

const TickCount = 10;

describe('getChallengeTapeMarks', () => {
    it('should return an empty slot per tick for an untouched run', () => {
        expect.assertions(2);

        const marks = getChallengeTapeMarks([], 0, TickCount);

        expect(marks).toHaveLength(TickCount);
        expect(marks.every(mark => mark.tier === null && !mark.isAway)).toBe(true);
    });

    it('should return empty slots while no time has elapsed', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts: 0, technique: SolutionTechniqueEnum.XWing }
        ];

        expect(getChallengeTapeMarks(events, 0, TickCount).every(mark => mark.tier === null)).toBe(true);
    });

    it('should place a placement at its share of the elapsed run', () => {
        expect.assertions(2);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts: 50, technique: SolutionTechniqueEnum.XWing }
        ];
        const marks = getChallengeTapeMarks(events, 100, TickCount);

        expect(marks[5].tier).not.toBeNull();
        expect(marks[5].complexity).toBe(techniqueComplexityConstant[SolutionTechniqueEnum.XWing]);
    });

    it('should compress earlier marks as the run grows', () => {
        expect.assertions(2);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts: 50, technique: SolutionTechniqueEnum.XWing }
        ];

        const halfwaySlot = getChallengeTapeMarks(events, 100, TickCount).findIndex(mark => mark.tier !== null);
        const compressedSlot = getChallengeTapeMarks(events, 500, TickCount).findIndex(mark => mark.tier !== null);

        expect(halfwaySlot).toBe(5);
        expect(compressedSlot).toBeLessThan(halfwaySlot);
    });

    it('should fill every slot an away period covers', () => {
        expect.assertions(2);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Away, ts: 20 },
            { kind: TimelineEventKindEnum.Return, ts: 40 }
        ];
        const marks = getChallengeTapeMarks(events, 100, TickCount);

        expect(marks.filter(mark => mark.isAway).length).toBeGreaterThan(1);
        expect(marks[0].isAway).toBe(false);
    });

    it('should keep an away band open while the player is still away', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [{ kind: TimelineEventKindEnum.Away, ts: 50 }];
        const marks = getChallengeTapeMarks(events, 100, TickCount);

        expect(marks[TickCount - 1].isAway).toBe(true);
    });

    it('should ignore local only event kinds', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Pencil, cellIndex: 1, value: 2, ts: 50 },
            { kind: TimelineEventKindEnum.InputMode, ts: 10 }
        ];

        expect(getChallengeTapeMarks(events, 100, TickCount).every(mark => mark.tier === null && !mark.isAway)).toBe(true);
    });

    it('should let a sharper placement win a slot shared with a basic one', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts: 50, technique: SolutionTechniqueEnum.NakedSingle },
            { kind: TimelineEventKindEnum.Cell, cellIndex: 1, value: 2, ts: 1, technique: SolutionTechniqueEnum.XWing }
        ];
        const marks = getChallengeTapeMarks(events, 100, TickCount);

        expect(marks[5].complexity).toBe(techniqueComplexityConstant[SolutionTechniqueEnum.XWing]);
    });

    it('should treat an unclassified placement as a basic mark', () => {
        expect.assertions(2);

        const events: GameTimelineEventInterface[] = [{ kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts: 50 }];
        const marks = getChallengeTapeMarks(events, 100, TickCount);

        expect(marks[5].tier).not.toBeNull();
        expect(marks[5].complexity).toBe(0);
    });
});
