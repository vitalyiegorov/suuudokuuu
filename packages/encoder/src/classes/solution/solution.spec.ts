/* eslint-disable @typescript-eslint/no-magic-numbers */
import { beforeEach, describe, expect, it } from '@jest/globals';

import { Solution } from './solution';

import type { SolutionStepInterface } from '../../interfaces/solution-step.interface';

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

            const cell = { x: 1, y: 2, value: 3 };
            const elapsedTime = 100;

            const result = solution.addStep(cell, elapsedTime);

            expect(result).toEqual({ cellIndex: 19, value: 3, ts: 100 });
            expect(solution.getSteps()).toHaveLength(1);
        });

        it('should calculate relative timestamp for subsequent steps', () => {
            expect.assertions(3);

            const cell1 = { x: 0, y: 0, value: 1 };
            const cell2 = { x: 1, y: 1, value: 2 };
            const cell3 = { x: 2, y: 2, value: 3 };

            solution.addStep(cell1, 100);
            solution.addStep(cell2, 250);
            const result = solution.addStep(cell3, 400);

            expect(result.ts).toBe(150);
            expect(solution.getSteps()).toHaveLength(3);
            expect(solution.getSteps()[2]).toEqual({ cellIndex: 20, value: 3, ts: 150 });
        });

        it('should handle zero elapsed time', () => {
            expect.assertions(1);

            const cell = { x: 0, y: 0, value: 1 };

            const result = solution.addStep(cell, 0);

            expect(result).toEqual({ cellIndex: 0, value: 1, ts: 0 });
        });

        it('should handle maximum grid coordinates', () => {
            expect.assertions(1);

            const cell = { x: 8, y: 8, value: 9 };

            const result = solution.addStep(cell, 999);

            expect(result).toEqual({ cellIndex: 80, value: 9, ts: 999 });
        });

        it('should cap timestamp at 8191 when time difference exceeds maximum', () => {
            expect.assertions(2);

            const cell1 = { x: 0, y: 0, value: 1 };
            const cell2 = { x: 1, y: 1, value: 2 };

            solution.addStep(cell1, 100);
            const result = solution.addStep(cell2, 10000);

            expect(result.ts).toBe(8191);
            expect(solution.getSteps()[1].ts).toBe(8191);
        });

        it('should handle multiple steps with timestamps exceeding maximum', () => {
            expect.assertions(3);

            solution.addStep({ x: 0, y: 0, value: 1 }, 0);
            solution.addStep({ x: 1, y: 1, value: 2 }, 9000);
            solution.addStep({ x: 2, y: 2, value: 3 }, 20000);

            const steps = solution.getSteps();
            expect(steps[0].ts).toBe(0);
            expect(steps[1].ts).toBe(8191);
            expect(steps[2].ts).toBe(8191);
        });
    });

    describe('stringify', () => {
        it('should return empty string for empty solution', () => {
            expect.assertions(1);

            expect(solution.stringify()).toBe('');
        });

        it('should convert single step to base64 encoded string', () => {
            expect.assertions(1);

            const cell = { x: 1, y: 2, value: 3 };
            solution.addStep(cell, 5);

            const stringified = solution.stringify();
            expect(stringified.length).toBeGreaterThan(0);
        });

        it('should convert multiple steps to base64 encoded string', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 100);
            solution.addStep({ x: 4, y: 5, value: 6 }, 223);
            solution.addStep({ x: 8, y: 8, value: 9 }, 1222);

            const stringified = solution.stringify();
            expect(stringified.length).toBeGreaterThan(0);
        });
    });

    describe('getSteps', () => {
        it('should return all added steps', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 100);
            solution.addStep({ x: 1, y: 1, value: 2 }, 200);

            const steps = solution.getSteps();

            expect(steps).toEqual([
                { cellIndex: 0, value: 1, ts: 100 },
                { cellIndex: 10, value: 2, ts: 100 }
            ]);
        });

        it('should return reference to internal array', () => {
            expect.assertions(2);

            const steps1 = solution.getSteps();
            solution.addStep({ x: 0, y: 0, value: 1 }, 100);
            const steps2 = solution.getSteps();

            expect(steps1).toBe(steps2);
            expect(steps1).toHaveLength(1);
        });
    });

    describe('getElapsedTime', () => {
        it('should return 0 for empty solution', () => {
            expect.assertions(1);

            expect(solution.getElapsedTime()).toBe(0);
        });

        it('should return total elapsed time from all steps', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 100);
            solution.addStep({ x: 1, y: 1, value: 2 }, 250);
            solution.addStep({ x: 2, y: 2, value: 3 }, 400);

            expect(solution.getElapsedTime()).toBe(400);
        });
    });

    describe('fromString', () => {
        it('should create empty solution from empty string', () => {
            expect.assertions(2);

            const result = Solution.fromString('');

            expect(result).toBeInstanceOf(Solution);
            expect(result.getSteps()).toEqual([]);
        });

        it('should handle null and undefined gracefully', () => {
            expect.assertions(2);

            expect(Solution.fromString(null as unknown as string).getSteps()).toEqual([]);
            expect(Solution.fromString(undefined as unknown as string).getSteps()).toEqual([]);
        });

        it('should skip steps with invalid cellIndex', () => {
            expect.assertions(1);

            const invalidData = String.fromCharCode(0xff, 0xff, 0xff);
            const parsed = Solution.fromString(invalidData);

            expect(parsed.getSteps()).toEqual([]);
        });

        it('should skip steps with invalid value', () => {
            expect.assertions(1);

            const invalidData = String.fromCharCode(0x00, 0x00, 0x00);
            const parsed = Solution.fromString(invalidData);

            expect(parsed.getSteps()).toEqual([]);
        });

        it('should handle data too short for a full step', () => {
            expect.assertions(1);

            const parsed = Solution.fromString(String.fromCharCode(0, 0));

            expect(parsed.getSteps()).toEqual([]);
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

            const steps: SolutionStepInterface[] = [{ cellIndex: 19, value: 3, ts: 100 }];

            const result = Solution.fromSteps(steps);

            expect(result.getSteps()).toEqual(steps);
        });

        it('should create solution from multiple steps', () => {
            expect.assertions(1);

            const steps: SolutionStepInterface[] = [
                { cellIndex: 0, value: 1, ts: 100 },
                { cellIndex: 49, value: 6, ts: 123 },
                { cellIndex: 80, value: 9, ts: 999 }
            ];

            const result = Solution.fromSteps(steps);

            expect(result.getSteps()).toEqual(steps);
        });

        it('should use provided array reference', () => {
            expect.assertions(1);

            const steps: SolutionStepInterface[] = [];
            const result = Solution.fromSteps(steps);

            steps.push({ cellIndex: 10, value: 1, ts: 100 });

            expect(result.getSteps()).toHaveLength(1);
        });
    });

    describe('round-trip conversion', () => {
        it('should maintain data integrity through stringify and fromString', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 0);
            solution.addStep({ x: 4, y: 5, value: 6 }, 123);
            solution.addStep({ x: 8, y: 8, value: 9 }, 1122);

            const stringified = solution.stringify();
            const parsed = Solution.fromString(stringified);

            expect(parsed.getSteps()).toEqual(solution.getSteps());
        });

        it('should handle edge cases in round-trip conversion', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 0);
            solution.addStep({ x: 8, y: 8, value: 9 }, 999);
            solution.addStep({ x: 4, y: 4, value: 5 }, 1998);

            const stringified = solution.stringify();
            const parsed = Solution.fromString(stringified);

            expect(parsed.stringify()).toBe(stringified);
        });
    });

    describe('edge cases', () => {
        it('should handle maximum timestamp value (8191)', () => {
            expect.assertions(2);

            solution.addStep({ x: 0, y: 0, value: 1 }, 8191);

            const stringified = solution.stringify();
            const parsed = Solution.fromString(stringified);
            expect(parsed.getSteps()).toEqual([{ cellIndex: 0, value: 1, ts: 8191 }]);
            expect(parsed.stringify()).toBe(stringified);
        });

        it('should handle consecutive steps with same elapsed time', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 100);
            solution.addStep({ x: 1, y: 1, value: 2 }, 100);
            solution.addStep({ x: 2, y: 2, value: 3 }, 100);

            expect(solution.getSteps()).toEqual([
                { cellIndex: 0, value: 1, ts: 100 },
                { cellIndex: 10, value: 2, ts: 0 },
                { cellIndex: 20, value: 3, ts: 0 }
            ]);
        });

        it('should handle all possible single-digit values', () => {
            expect.assertions(1);

            for (let i = 0; i <= 8; i += 1) {
                solution.addStep({ x: i, y: i, value: i + 1 }, i * 100);
            }

            expect(solution.getSteps()).toHaveLength(9);
        });
    });

    describe('timestamp overflow', () => {
        it('should cap timestamps at 8191', () => {
            expect.assertions(2);

            solution.addStep({ x: 0, y: 0, value: 1 }, 10000);

            const stringified = solution.stringify();
            expect(stringified.length).toBeGreaterThan(0);
            expect(solution.getSteps()[0].ts).toBe(8191);
        });

        it('should handle extreme time differences by capping at 8191', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 0);
            solution.addStep({ x: 1, y: 1, value: 2 }, 20000);

            expect(solution.getSteps()[1].ts).toBe(8191);
        });

        it('should maintain data integrity with capped timestamps', () => {
            expect.assertions(2);

            solution.addStep({ x: 5, y: 5, value: 5 }, 100);
            solution.addStep({ x: 6, y: 6, value: 6 }, 9000);
            solution.addStep({ x: 7, y: 7, value: 7 }, 9050);

            const steps = solution.getSteps();

            expect(steps[1].ts).toBe(8191);
            expect(steps[2].ts).toBe(759);
        });
    });

    describe('round-trip conversion with capped timestamps', () => {
        it('should maintain capped timestamps through serialization', () => {
            expect.assertions(2);

            solution.addStep({ x: 0, y: 0, value: 1 }, 0);
            solution.addStep({ x: 1, y: 1, value: 2 }, 9000);
            solution.addStep({ x: 2, y: 2, value: 3 }, 9100);

            const stringified = solution.stringify();
            const parsed = Solution.fromString(stringified);

            expect(parsed.getSteps()).toEqual([
                { cellIndex: 0, value: 1, ts: 0 },
                { cellIndex: 10, value: 2, ts: 8191 },
                { cellIndex: 20, value: 3, ts: 909 }
            ]);
            expect(parsed.stringify()).toBe(stringified);
        });
    });

    describe('binary encoding validation', () => {
        it('should correctly encode cellIndex in 7 bits', () => {
            expect.assertions(1);

            solution.addStep({ x: 8, y: 8, value: 9 }, 0);

            const stringified = solution.stringify();
            const parsed = Solution.fromString(stringified);
            expect(parsed.getSteps()[0].cellIndex).toBe(80);
        });

        it('should correctly encode value in 4 bits', () => {
            expect.assertions(9);

            for (let value = 1; value <= 9; value += 1) {
                const sol = new Solution();
                sol.addStep({ x: 0, y: 0, value }, 0);
                const stringified = sol.stringify();
                const parsed = Solution.fromString(stringified);
                expect(parsed.getSteps()[0].value).toBe(value);
            }
        });

        it('should correctly encode timestamp in 13 bits', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 8191);

            const stringified = solution.stringify();
            const parsed = Solution.fromString(stringified);
            expect(parsed.getSteps()[0].ts).toBe(8191);
        });

        it('should encode 3 bytes per step', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 0);

            expect(solution.stringify().length).toBe(4);
        });
    });

    describe('timestamp capping validation', () => {
        it('should cap at exactly 8191 seconds (~136 minutes)', () => {
            expect.assertions(4);

            solution.addStep({ x: 0, y: 0, value: 1 }, 0);
            solution.addStep({ x: 1, y: 1, value: 2 }, 8191);
            solution.addStep({ x: 2, y: 2, value: 3 }, 8192);
            solution.addStep({ x: 3, y: 3, value: 4 }, 20000);

            const steps = solution.getSteps();
            expect(steps[0].ts).toBe(0);
            expect(steps[1].ts).toBe(8191);
            expect(steps[2].ts).toBe(1);
            expect(steps[3].ts).toBe(8191);
        });

        it('should handle rapid consecutive moves', () => {
            expect.assertions(5);

            solution.addStep({ x: 0, y: 0, value: 1 }, 200);
            solution.addStep({ x: 1, y: 1, value: 2 }, 201);
            solution.addStep({ x: 2, y: 2, value: 3 }, 202);
            solution.addStep({ x: 3, y: 3, value: 4 }, 203);
            solution.addStep({ x: 4, y: 4, value: 5 }, 204);

            const steps = solution.getSteps();
            expect(steps[0].ts).toBe(200);
            expect(steps[1].ts).toBe(1);
            expect(steps[2].ts).toBe(1);
            expect(steps[3].ts).toBe(1);
            expect(steps[4].ts).toBe(1);
        });
    });
});
