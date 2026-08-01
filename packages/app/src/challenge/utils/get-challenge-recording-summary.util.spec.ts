import { describe, expect, it } from '@jest/globals';
import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import { getChallengeRecordingSummary } from './get-challenge-recording-summary.util';

import type { GameTimelineEventInterface } from '../../game/interface/game-timeline-event.interface';

const placement = (ts: number, technique: SolutionTechniqueEnum): GameTimelineEventInterface => ({
    kind: TimelineEventKindEnum.Cell,
    cellIndex: 0,
    value: 1,
    ts,
    technique
});
const pencil = (ts: number): GameTimelineEventInterface => ({ kind: TimelineEventKindEnum.Pencil, cellIndex: 3, value: 7, ts });
const screenshot = (ts: number): GameTimelineEventInterface => ({ kind: TimelineEventKindEnum.Screenshot, ts });

describe('getChallengeRecordingSummary', () => {
    describe('techniques', () => {
        it('should report no techniques for an empty recording', () => {
            expect.assertions(1);

            expect(getChallengeRecordingSummary([], 60).techniqueEvents).toStrictEqual([]);
        });

        it('should report a single classified placement with its tier and cumulative time', () => {
            expect.assertions(1);

            const events = [pencil(4), placement(6, SolutionTechniqueEnum.NakedSingle)];

            expect(getChallengeRecordingSummary(events, 60).techniqueEvents).toStrictEqual([
                { cumulativeTime: 10, technique: SolutionTechniqueEnum.NakedSingle, tier: ChallengeTechniqueTierEnum.Basic }
            ]);
        });

        it('should report every classified placement of a longer recording', () => {
            expect.assertions(1);

            const events = [
                placement(5, SolutionTechniqueEnum.NakedSingle),
                placement(5, SolutionTechniqueEnum.XWing),
                { kind: TimelineEventKindEnum.Cell, cellIndex: 1, value: 2, ts: 5 } satisfies GameTimelineEventInterface
            ];

            expect(getChallengeRecordingSummary(events, 60).techniqueEvents.map(event => event.technique)).toStrictEqual([
                SolutionTechniqueEnum.NakedSingle,
                SolutionTechniqueEnum.XWing
            ]);
        });
    });

    describe('exits', () => {
        it('should report a clean run when the player never left the app', () => {
            expect.assertions(3);

            const summary = getChallengeRecordingSummary([placement(10, SolutionTechniqueEnum.NakedSingle)], 60);

            expect(summary.exitCount).toBe(0);
            expect(summary.awaySeconds).toBe(0);
            expect(summary.awayRanges).toStrictEqual([]);
        });

        it('should report one exit with its away duration and timeline band', () => {
            expect.assertions(3);

            const events: GameTimelineEventInterface[] = [
                placement(20, SolutionTechniqueEnum.NakedSingle),
                { kind: TimelineEventKindEnum.Away, ts: 10 },
                { kind: TimelineEventKindEnum.Return, ts: 30 }
            ];
            const summary = getChallengeRecordingSummary(events, 60);

            expect(summary.exitCount).toBe(1);
            expect(summary.awaySeconds).toBe(30);
            expect(summary.awayRanges).toStrictEqual([{ durationSeconds: 30, endPercent: 100, startPercent: 50 }]);
        });

        it('should total the away time of many exits', () => {
            expect.assertions(2);

            const events: GameTimelineEventInterface[] = [
                { kind: TimelineEventKindEnum.Away, ts: 10 },
                { kind: TimelineEventKindEnum.Return, ts: 20 },
                { kind: TimelineEventKindEnum.Away, ts: 10 },
                { kind: TimelineEventKindEnum.Return, ts: 40 }
            ];
            const summary = getChallengeRecordingSummary(events, 100);

            expect(summary.exitCount).toBe(2);
            expect(summary.awaySeconds).toBe(60);
        });

        it('should round a fractional away total to whole seconds', () => {
            expect.assertions(1);

            const events: GameTimelineEventInterface[] = [{ kind: TimelineEventKindEnum.Away, ts: 1 }];

            expect(getChallengeRecordingSummary(events, 2.9).awaySeconds).toBe(2);
        });
    });

    describe('pencil actions', () => {
        it('should report no pencil actions when the player never used pencil mode', () => {
            expect.assertions(1);

            expect(getChallengeRecordingSummary([placement(10, SolutionTechniqueEnum.NakedSingle)], 60).pencilCount).toBe(0);
        });

        it('should count a single pencil action', () => {
            expect.assertions(1);

            expect(getChallengeRecordingSummary([pencil(10)], 60).pencilCount).toBe(1);
        });

        it('should count every pencil action of the recording', () => {
            expect.assertions(1);

            const events = [pencil(5), pencil(5), placement(5, SolutionTechniqueEnum.NakedSingle), pencil(5)];

            expect(getChallengeRecordingSummary(events, 60).pencilCount).toBe(3);
        });

        it('should not count mistakes as pencil actions', () => {
            expect.assertions(1);

            const events: GameTimelineEventInterface[] = [{ kind: TimelineEventKindEnum.Mistake, cellIndex: 2, value: 5, ts: 5 }];

            expect(getChallengeRecordingSummary(events, 60).pencilCount).toBe(0);
        });
    });

    describe('screenshots', () => {
        it('should report no screenshots when the player never captured the board', () => {
            expect.assertions(1);

            expect(getChallengeRecordingSummary([placement(10, SolutionTechniqueEnum.NakedSingle)], 60).screenshotCount).toBe(0);
        });

        it('should count a single screenshot', () => {
            expect.assertions(1);

            expect(getChallengeRecordingSummary([screenshot(10)], 60).screenshotCount).toBe(1);
        });

        it('should count every screenshot of the recording', () => {
            expect.assertions(1);

            const events = [screenshot(5), placement(5, SolutionTechniqueEnum.NakedSingle), screenshot(5), screenshot(5)];

            expect(getChallengeRecordingSummary(events, 60).screenshotCount).toBe(3);
        });

        it('should keep screenshots separate from pencil actions', () => {
            expect.assertions(2);

            const summary = getChallengeRecordingSummary([screenshot(5), pencil(5)], 60);

            expect(summary.screenshotCount).toBe(1);
            expect(summary.pencilCount).toBe(1);
        });
    });
});
