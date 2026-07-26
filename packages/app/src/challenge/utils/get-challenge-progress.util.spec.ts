import { describe, expect, it } from '@jest/globals';

import { getChallengeProgress } from './get-challenge-progress.util';

import type { SolutionStepInterface } from '@suuudokuuu/encoder';

const buildStep = (ts: number): SolutionStepInterface => ({ cellIndex: 0, value: 1, ts });

const TotalTime = 100;
const QuarterOfTotal = 25;
const HalfOfTotal = 50;
const TwoFifthsProgress = 0.4;

describe('getChallengeProgress', () => {
    it('should return empty indicators and no progress without steps', () => {
        expect.assertions(1);

        expect(getChallengeProgress([], TotalTime, 50)).toStrictEqual([[], 0]);
    });

    it('should place one indicator per step at its cumulative share of the total time', () => {
        expect.assertions(1);

        const [indicators] = getChallengeProgress(
            [buildStep(QuarterOfTotal), buildStep(QuarterOfTotal), buildStep(HalfOfTotal)],
            TotalTime,
            0
        );

        expect(indicators).toStrictEqual([QuarterOfTotal, HalfOfTotal, TotalTime]);
    });

    it('should report progress from the last step that finished before the elapsed time', () => {
        expect.assertions(1);

        const [, progress] = getChallengeProgress([buildStep(20), buildStep(20), buildStep(20)], TotalTime, 50);

        expect(progress).toBe(TwoFifthsProgress);
    });

    it('should report no progress when no step finished before the elapsed time', () => {
        expect.assertions(1);

        const [, progress] = getChallengeProgress([buildStep(60)], TotalTime, 10);

        expect(progress).toBe(0);
    });

    it('should treat a step landing exactly on the elapsed time as not yet passed', () => {
        expect.assertions(1);

        const [, progress] = getChallengeProgress([buildStep(50)], TotalTime, 50);

        expect(progress).toBe(0);
    });
});
