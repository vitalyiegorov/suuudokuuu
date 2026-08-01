import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { techniqueComplexityConstant } from '../constants/technique-complexity.constant';
import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import { getChallengeTimelineMarks } from './get-challenge-timeline-marks.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';

const TickCount = 10;
const TotalTime = 100;

const buildEvent = (
    technique: SolutionTechniqueEnum,
    tier: ChallengeTechniqueTierEnum,
    cumulativeTime: number
): ChallengeTechniqueEventInterface => ({ cumulativeTime, technique, tier });

describe('getChallengeTimelineMarks', () => {
    it('should return a full set of empty marks when there are no events', () => {
        expect.assertions(2);

        const marks = getChallengeTimelineMarks([], TickCount, TotalTime);

        expect(marks).toHaveLength(TickCount);
        expect(marks.every(mark => mark.tier === null && mark.complexity === 0)).toBe(true);
    });

    it('should place an event in the slot matching its position', () => {
        expect.assertions(2);

        const marks = getChallengeTimelineMarks(
            [buildEvent(SolutionTechniqueEnum.XWing, ChallengeTechniqueTierEnum.Advanced, 0)],
            TickCount,
            TotalTime
        );

        expect(marks[0].tier).toBe(ChallengeTechniqueTierEnum.Advanced);
        expect(marks[0].complexity).toBe(techniqueComplexityConstant[SolutionTechniqueEnum.XWing]);
    });

    it('should return empty marks for a run without a reported time', () => {
        expect.assertions(1);

        const marks = getChallengeTimelineMarks(
            [buildEvent(SolutionTechniqueEnum.XWing, ChallengeTechniqueTierEnum.Advanced, 50)],
            TickCount,
            0
        );

        expect(marks.every(mark => mark.tier === null)).toBe(true);
    });

    it('should clamp an event at full position into the last slot', () => {
        expect.assertions(1);

        const marks = getChallengeTimelineMarks(
            [buildEvent(SolutionTechniqueEnum.XWing, ChallengeTechniqueTierEnum.Advanced, 100)],
            TickCount,
            TotalTime
        );

        expect(marks[TickCount - 1].tier).toBe(ChallengeTechniqueTierEnum.Advanced);
    });

    it('should give basic tier events no complexity so they render as short marks', () => {
        expect.assertions(2);

        const marks = getChallengeTimelineMarks(
            [buildEvent(SolutionTechniqueEnum.NakedSingle, ChallengeTechniqueTierEnum.Basic, 0)],
            TickCount,
            TotalTime
        );

        expect(marks[0].tier).toBe(ChallengeTechniqueTierEnum.Basic);
        expect(marks[0].complexity).toBe(0);
    });

    it('should let a sharper event win a slot already taken by a basic one', () => {
        expect.assertions(2);

        const marks = getChallengeTimelineMarks(
            [
                buildEvent(SolutionTechniqueEnum.NakedSingle, ChallengeTechniqueTierEnum.Basic, 0),
                buildEvent(SolutionTechniqueEnum.XWing, ChallengeTechniqueTierEnum.Advanced, 0)
            ],
            TickCount,
            TotalTime
        );

        expect(marks[0].tier).toBe(ChallengeTechniqueTierEnum.Advanced);
        expect(marks[0].complexity).toBe(techniqueComplexityConstant[SolutionTechniqueEnum.XWing]);
    });

    it('should keep the sharper event when a basic one arrives afterwards', () => {
        expect.assertions(1);

        const marks = getChallengeTimelineMarks(
            [
                buildEvent(SolutionTechniqueEnum.XWing, ChallengeTechniqueTierEnum.Advanced, 0),
                buildEvent(SolutionTechniqueEnum.NakedSingle, ChallengeTechniqueTierEnum.Basic, 0)
            ],
            TickCount,
            TotalTime
        );

        expect(marks[0].tier).toBe(ChallengeTechniqueTierEnum.Advanced);
    });
});
