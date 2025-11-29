/* eslint-disable @typescript-eslint/no-magic-numbers, lingui/no-unlocalized-strings */
import { beforeEach, describe, expect, it } from '@jest/globals';

import { Solution } from './solution';

import type { SolutionStepInterface } from '../interfaces/solution-step.interface';
import type { CellInterface } from '@suuudokuuu/generator';

describe('Solution', () => {
    let solution: Solution;

    beforeEach(() => {
        solution = new Solution();
    });

    describe('constructor', () => {
        it('should initialize with empty steps array', () => {
            expect.assertions(1);

            expect(solution.getSteps()).toEqual([]);
        });
    });

    describe('addStep', () => {
        it('should add first step with full elapsed time', () => {
            expect.assertions(2);

            const cell: CellInterface = { x: 1, y: 2, value: 3 } as CellInterface;
            const elapsedTime = 100;

            const result = solution.addStep(cell, elapsedTime);

            expect(result).toEqual({ x: 1, y: 2, value: 3, ts: 100 });
            expect(solution.getSteps()).toHaveLength(1);
        });

        it('should calculate relative timestamp for subsequent steps', () => {
            expect.assertions(3);

            const cell1: CellInterface = { x: 0, y: 0, value: 1 } as CellInterface;
            const cell2: CellInterface = { x: 1, y: 1, value: 2 } as CellInterface;
            const cell3: CellInterface = { x: 2, y: 2, value: 3 } as CellInterface;

            solution.addStep(cell1, 100);
            solution.addStep(cell2, 250);
            const result = solution.addStep(cell3, 400);

            expect(result.ts).toBe(150);
            expect(solution.getSteps()).toHaveLength(3);
            expect(solution.getSteps()[2]).toEqual({ x: 2, y: 2, value: 3, ts: 150 });
        });

        it('should handle zero elapsed time', () => {
            expect.assertions(1);

            const cell: CellInterface = { x: 0, y: 0, value: 1 } as CellInterface;

            const result = solution.addStep(cell, 0);

            expect(result).toEqual({ x: 0, y: 0, value: 1, ts: 0 });
        });

        it('should handle maximum grid coordinates', () => {
            expect.assertions(1);

            const cell: CellInterface = { x: 8, y: 8, value: 9 } as CellInterface;

            const result = solution.addStep(cell, 999);

            expect(result).toEqual({ x: 8, y: 8, value: 9, ts: 999 });
        });

        it('should cap timestamp at 999 when time difference exceeds maximum', () => {
            expect.assertions(3);

            const cell1: CellInterface = { x: 0, y: 0, value: 1 } as CellInterface;
            const cell2: CellInterface = { x: 1, y: 1, value: 2 } as CellInterface;

            solution.addStep(cell1, 100);
            const result = solution.addStep(cell2, 1500);

            // Time difference would be 1400, but should be capped at 999
            expect(result.ts).toBe(999);
            expect(solution.getSteps()[1].ts).toBe(999);
            expect(solution.stringify()).toBe('001100112999');
        });

        it('should handle multiple steps with timestamps exceeding maximum', () => {
            expect.assertions(4);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 0);
            solution.addStep({ x: 1, y: 1, value: 2 } as CellInterface, 2000);
            solution.addStep({ x: 2, y: 2, value: 3 } as CellInterface, 5000);

            const steps = solution.getSteps();
            expect(steps[0].ts).toBe(0);
            expect(steps[1].ts).toBe(999);
            expect(steps[2].ts).toBe(999);
            expect(solution.stringify()).toBe('001000112999223999');
        });
    });

    describe('stringify', () => {
        it('should return empty string for empty solution', () => {
            expect.assertions(1);

            expect(solution.stringify()).toBe('');
        });

        it('should convert single step to string with padded timestamp', () => {
            expect.assertions(1);

            const cell: CellInterface = { x: 1, y: 2, value: 3 } as CellInterface;
            solution.addStep(cell, 5);

            expect(solution.stringify()).toBe('123005');
        });

        it('should convert multiple steps to string', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 100);
            solution.addStep({ x: 4, y: 5, value: 6 } as CellInterface, 223);
            solution.addStep({ x: 8, y: 8, value: 9 } as CellInterface, 1222);

            expect(solution.stringify()).toBe('001100456123889999');
        });

        it('should pad timestamps with leading zeros', () => {
            expect.assertions(1);

            solution.addStep({ x: 1, y: 1, value: 1 } as CellInterface, 0);
            solution.addStep({ x: 2, y: 2, value: 2 } as CellInterface, 5);
            solution.addStep({ x: 3, y: 3, value: 3 } as CellInterface, 55);

            expect(solution.stringify()).toBe('111000222005333050');
        });
    });

    describe('getSteps', () => {
        it('should return all added steps', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 100);
            solution.addStep({ x: 1, y: 1, value: 2 } as CellInterface, 200);

            const steps = solution.getSteps();

            expect(steps).toEqual([
                { x: 0, y: 0, value: 1, ts: 100 },
                { x: 1, y: 1, value: 2, ts: 100 }
            ]);
        });

        it('should return reference to internal array', () => {
            expect.assertions(2);

            const steps1 = solution.getSteps();
            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 100);
            const steps2 = solution.getSteps();

            expect(steps1).toBe(steps2);
            expect(steps1).toHaveLength(1);
        });
    });

    describe('fromString', () => {
        it('should create empty solution from empty string', () => {
            expect.assertions(2);

            const result = Solution.fromString('');

            expect(result).toBeInstanceOf(Solution);
            expect(result.getSteps()).toEqual([]);
        });

        it('should parse single step correctly', () => {
            expect.assertions(1);

            const result = Solution.fromString('123005');

            expect(result.getSteps()).toEqual([{ x: 1, y: 2, value: 3, ts: 5 }]);
        });

        it('should parse multiple steps correctly', () => {
            expect.assertions(1);

            const result = Solution.fromString('001100456123889999');

            expect(result.getSteps()).toEqual([
                { x: 0, y: 0, value: 1, ts: 100 },
                { x: 4, y: 5, value: 6, ts: 123 },
                { x: 8, y: 8, value: 9, ts: 999 }
            ]);
        });

        it('should handle invalid string length', () => {
            expect.assertions(3);

            expect(Solution.fromString('12345').getSteps()).toEqual([]);
            expect(Solution.fromString('1234567').getSteps()).toEqual([]);
            expect(Solution.fromString('12345678901').getSteps()).toEqual([]);
        });

        it('should handle null and undefined gracefully', () => {
            expect.assertions(2);

            expect(Solution.fromString(null as unknown as string).getSteps()).toEqual([]);
            expect(Solution.fromString(undefined as unknown as string).getSteps()).toEqual([]);
        });

        it('should parse timestamps with leading zeros correctly', () => {
            expect.assertions(1);

            const result = Solution.fromString('111000222005333050');

            expect(result.getSteps()).toEqual([
                { x: 1, y: 1, value: 1, ts: 0 },
                { x: 2, y: 2, value: 2, ts: 5 },
                { x: 3, y: 3, value: 3, ts: 50 }
            ]);
        });
    });

    describe('fromSteps', () => {
        it('should create solution from empty array', () => {
            expect.assertions(2);

            const result = Solution.fromSteps([]);

            expect(result).toBeInstanceOf(Solution);
            expect(result.getSteps()).toEqual([]);
        });

        it('should create solution from single step', () => {
            expect.assertions(1);

            const steps: SolutionStepInterface[] = [{ x: 1, y: 2, value: 3, ts: 100 }];

            const result = Solution.fromSteps(steps);

            expect(result.getSteps()).toEqual(steps);
        });

        it('should create solution from multiple steps', () => {
            expect.assertions(1);

            const steps: SolutionStepInterface[] = [
                { x: 0, y: 0, value: 1, ts: 100 },
                { x: 4, y: 5, value: 6, ts: 123 },
                { x: 8, y: 8, value: 9, ts: 999 }
            ];

            const result = Solution.fromSteps(steps);

            expect(result.getSteps()).toEqual(steps);
        });

        it('should use provided array reference', () => {
            expect.assertions(1);

            const steps: SolutionStepInterface[] = [];
            const result = Solution.fromSteps(steps);

            steps.push({ x: 1, y: 1, value: 1, ts: 100 });

            expect(result.getSteps()).toHaveLength(1);
        });
    });

    describe('round-trip conversion', () => {
        it('should maintain data integrity through stringify and fromString', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 0);
            solution.addStep({ x: 4, y: 5, value: 6 } as CellInterface, 123);
            solution.addStep({ x: 8, y: 8, value: 9 } as CellInterface, 1122);

            const stringified = solution.stringify();
            const parsed = Solution.fromString(stringified);

            expect(parsed.getSteps()).toEqual(solution.getSteps());
        });

        it('should handle edge cases in round-trip conversion', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 0);
            solution.addStep({ x: 8, y: 8, value: 9 } as CellInterface, 999);
            solution.addStep({ x: 4, y: 4, value: 5 } as CellInterface, 1998);

            const stringified = solution.stringify();
            const parsed = Solution.fromString(stringified);

            expect(parsed.stringify()).toBe(stringified);
        });
    });

    describe('edge cases', () => {
        it('should handle maximum timestamp value (999)', () => {
            expect.assertions(2);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 999);

            expect(solution.stringify()).toBe('001999');
            expect(Solution.fromString('001999').getSteps()).toEqual([{ x: 0, y: 0, value: 1, ts: 999 }]);
        });

        it('should handle consecutive steps with same elapsed time', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 100);
            solution.addStep({ x: 1, y: 1, value: 2 } as CellInterface, 100);
            solution.addStep({ x: 2, y: 2, value: 3 } as CellInterface, 100);

            expect(solution.getSteps()).toEqual([
                { x: 0, y: 0, value: 1, ts: 100 },
                { x: 1, y: 1, value: 2, ts: 0 },
                { x: 2, y: 2, value: 3, ts: 0 }
            ]);
        });

        it('should handle all possible single-digit values', () => {
            expect.assertions(1);

            for (let i = 0; i <= 8; i += 1) {
                solution.addStep({ x: i, y: i, value: i + 1 } as CellInterface, i * 100);
            }

            expect(solution.getSteps()).toHaveLength(9);
        });
    });

    describe('timestamp overflow', () => {
        it('should cap timestamps at 999 to maintain 3-character format', () => {
            expect.assertions(3);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 1500);

            const stringified = solution.stringify();
            expect(stringified).toBe('001999');
            expect(stringified.length).toBe(6);
            expect(solution.getSteps()[0].ts).toBe(999);
        });

        it('should handle extreme time differences by capping at 999', () => {
            expect.assertions(2);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 0);
            solution.addStep({ x: 1, y: 1, value: 2 } as CellInterface, 10000);

            expect(solution.getSteps()[1].ts).toBe(999);
            expect(solution.stringify()).toBe('001000112999');
        });

        it('should maintain proper string format with capped timestamps', () => {
            expect.assertions(3);

            solution.addStep({ x: 5, y: 5, value: 5 } as CellInterface, 100);
            solution.addStep({ x: 6, y: 6, value: 6 } as CellInterface, 2000);
            solution.addStep({ x: 7, y: 7, value: 7 } as CellInterface, 2050);

            const stringified = solution.stringify();
            const steps = solution.getSteps();

            // Each step should be exactly 6 characters
            expect(stringified.length).toBe(18);
            expect(steps[1].ts).toBe(999);
            expect(steps[2].ts).toBe(50);
        });
    });

    describe('round-trip conversion with capped timestamps', () => {
        it('should maintain capped timestamps through serialization', () => {
            expect.assertions(2);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 0);
            solution.addStep({ x: 1, y: 1, value: 2 } as CellInterface, 5000);
            solution.addStep({ x: 2, y: 2, value: 3 } as CellInterface, 5100);

            const stringified = solution.stringify();
            const parsed = Solution.fromString(stringified);

            expect(parsed.getSteps()).toEqual([
                { x: 0, y: 0, value: 1, ts: 0 },
                { x: 1, y: 1, value: 2, ts: 999 },
                { x: 2, y: 2, value: 3, ts: 100 }
            ]);
            expect(parsed.stringify()).toBe(stringified);
        });
    });

    describe('private methods behavior', () => {
        it('should correctly format steps with stepToString', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 5);

            expect(solution.stringify()).toBe('001005');
        });

        it('should correctly parse steps with stepFromString', () => {
            expect.assertions(1);

            const parsed = Solution.fromString('789999');

            expect(parsed.getSteps()).toEqual([{ x: 7, y: 8, value: 9, ts: 999 }]);
        });
    });

    describe('timestamp capping validation', () => {
        it('should cap at exactly 999 seconds (16.65 minutes)', () => {
            expect.assertions(4);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 0);
            solution.addStep({ x: 1, y: 1, value: 2 } as CellInterface, 999);
            solution.addStep({ x: 2, y: 2, value: 3 } as CellInterface, 1000);
            solution.addStep({ x: 3, y: 3, value: 4 } as CellInterface, 2000);

            const steps = solution.getSteps();
            expect(steps[0].ts).toBe(0);
            expect(steps[1].ts).toBe(999);
            expect(steps[2].ts).toBe(1);
            expect(steps[3].ts).toBe(999);
        });

        it('should handle rapid consecutive moves', () => {
            expect.assertions(5);

            solution.addStep({ x: 0, y: 0, value: 1 } as CellInterface, 1000);
            solution.addStep({ x: 1, y: 1, value: 2 } as CellInterface, 1001);
            solution.addStep({ x: 2, y: 2, value: 3 } as CellInterface, 1002);
            solution.addStep({ x: 3, y: 3, value: 4 } as CellInterface, 1003);
            solution.addStep({ x: 4, y: 4, value: 5 } as CellInterface, 1004);

            const steps = solution.getSteps();
            expect(steps[0].ts).toBe(999);
            expect(steps[1].ts).toBe(1);
            expect(steps[2].ts).toBe(1);
            expect(steps[3].ts).toBe(1);
            expect(steps[4].ts).toBe(1);
        });
    });
});
