import { describe, expect, it } from '@jest/globals';

import { techniqueComplexityConstant } from '../constants/technique-complexity.constant';
import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import { getChallengeTechniqueEvents } from './get-challenge-technique-events.util';

import type { SolutionStepInterface } from '@suuudokuuu/encoder';

const solvedBoard = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const givens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const BlankCell = '.';
const StepCount = 5;
const StepDuration = 10;
const TotalTime = 100;

const buildSteps = (count: number): SolutionStepInterface[] => {
    const steps: SolutionStepInterface[] = [];

    for (let cellIndex = 0; cellIndex < givens.length && steps.length < count; cellIndex += 1) {
        if (givens.charAt(cellIndex) === BlankCell) {
            steps.push({ cellIndex, value: parseInt(solvedBoard.charAt(cellIndex), 10), ts: StepDuration });
        }
    }

    return steps;
};

describe('getChallengeTechniqueEvents', () => {
    it('should return no events for an empty sudoku string', () => {
        expect.assertions(1);

        expect(getChallengeTechniqueEvents('', buildSteps(StepCount), TotalTime)).toStrictEqual([]);
    });

    it('should return no events for an empty step list', () => {
        expect.assertions(1);

        expect(getChallengeTechniqueEvents(givens, [], TotalTime)).toStrictEqual([]);
    });

    it('should return no events when the total time is not positive', () => {
        expect.assertions(2);

        expect(getChallengeTechniqueEvents(givens, buildSteps(StepCount), 0)).toStrictEqual([]);
        expect(getChallengeTechniqueEvents(givens, buildSteps(StepCount), -1)).toStrictEqual([]);
    });

    it('should produce one event per step', () => {
        expect.assertions(1);

        const events = getChallengeTechniqueEvents(givens, buildSteps(StepCount), TotalTime);

        expect(events).toHaveLength(StepCount);
    });

    it('should accumulate step durations into the cumulative time', () => {
        expect.assertions(1);

        const events = getChallengeTechniqueEvents(givens, buildSteps(StepCount), TotalTime);

        expect(events.map(event => event.cumulativeTime)).toStrictEqual([10, 20, 30, 40, 50]);
    });

    it('should express the position as the cumulative share of the total time', () => {
        expect.assertions(1);

        const events = getChallengeTechniqueEvents(givens, buildSteps(StepCount), TotalTime);

        expect(events.map(event => event.positionPercent)).toStrictEqual([10, 20, 30, 40, 50]);
    });

    it('should classify every step into a known technique and tier', () => {
        expect.assertions(2);

        const events = getChallengeTechniqueEvents(givens, buildSteps(StepCount), TotalTime);
        const knownTiers = Object.values(ChallengeTechniqueTierEnum);

        expect(events.every(event => knownTiers.includes(event.tier))).toBe(true);
        expect(events.every(event => event.technique in techniqueComplexityConstant)).toBe(true);
    });
});
