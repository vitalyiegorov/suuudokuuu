import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { getChallengeAwayRanges } from './get-challenge-away-ranges.util';

import type { GameTimelineEventInterface } from '../../game/interface/game-timeline-event.interface';

const cellEvent = (ts: number): GameTimelineEventInterface => ({ kind: TimelineEventKindEnum.Cell, cellIndex: 0, value: 1, ts });

describe('getChallengeAwayRanges', () => {
    it('should map an away and return pair to a percentage band', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            cellEvent(10),
            { kind: TimelineEventKindEnum.Away, ts: 10 },
            { kind: TimelineEventKindEnum.Return, ts: 20 },
            cellEvent(60)
        ];

        expect(getChallengeAwayRanges(events, 100)).toStrictEqual([{ durationSeconds: 20, endPercent: 40, startPercent: 20 }]);
    });

    it('should report every away period of a run', () => {
        expect.assertions(2);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Away, ts: 10 },
            { kind: TimelineEventKindEnum.Return, ts: 10 },
            { kind: TimelineEventKindEnum.Away, ts: 30 },
            { kind: TimelineEventKindEnum.Return, ts: 10 }
        ];
        const ranges = getChallengeAwayRanges(events, 100);

        expect(ranges).toHaveLength(2);
        expect(ranges.map(range => range.durationSeconds)).toStrictEqual([10, 10]);
    });

    it('should close an away period that never returned at the end of the run', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [cellEvent(40), { kind: TimelineEventKindEnum.Away, ts: 10 }];

        expect(getChallengeAwayRanges(events, 100)).toStrictEqual([{ durationSeconds: 50, endPercent: 100, startPercent: 50 }]);
    });

    it('should ignore a return without a matching away', () => {
        expect.assertions(1);

        expect(getChallengeAwayRanges([{ kind: TimelineEventKindEnum.Return, ts: 10 }], 100)).toStrictEqual([]);
    });

    it('should clamp a band that runs past the reported total time', () => {
        expect.assertions(1);

        const events: GameTimelineEventInterface[] = [
            { kind: TimelineEventKindEnum.Away, ts: 90 },
            { kind: TimelineEventKindEnum.Return, ts: 40 }
        ];

        expect(getChallengeAwayRanges(events, 100)).toStrictEqual([{ durationSeconds: 40, endPercent: 100, startPercent: 90 }]);
    });

    it('should return no bands for a run without a reported time', () => {
        expect.assertions(2);

        expect(getChallengeAwayRanges([{ kind: TimelineEventKindEnum.Away, ts: 10 }], 0)).toStrictEqual([]);
        expect(getChallengeAwayRanges([], 100)).toStrictEqual([]);
    });
});
