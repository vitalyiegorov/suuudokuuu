/* eslint-disable @typescript-eslint/no-magic-numbers */
import { beforeEach, describe, expect, it } from '@jest/globals';
import { BitOutputStream } from '@thi.ng/bitstream';

import { CELL_INDEX_BITS, TIMESTAMP_BITS, VALUE_BITS } from '../../constants/bit-encoding.constant';

import { Solution } from './solution';

import type { SolutionStepInterface } from '../../interfaces/solution-step.interface';

describe('Solution', () => {
    let solution: Solution;

    beforeEach(() => {
        solution = new Solution();
    });

    describe('addStep', () => {
        it('should add step with correct cellIndex calculation', () => {
            expect.assertions(2);

            const result = solution.addStep({ x: 1, y: 2, value: 3 }, 100);

            expect(result).toEqual({ cellIndex: 19, value: 3, ts: 100 });
            expect(solution.getSteps()).toHaveLength(1);
        });

        it('should calculate relative timestamp for subsequent steps', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 100);
            solution.addStep({ x: 1, y: 1, value: 2 }, 250);
            const result = solution.addStep({ x: 2, y: 2, value: 3 }, 400);

            expect(result.ts).toBe(150);
        });

        it('should cap timestamp at 255', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 100);
            const result = solution.addStep({ x: 1, y: 1, value: 2 }, 10000);

            expect(result.ts).toBe(255);
        });

        it('should clamp negative relative timestamp to zero', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 100);
            const result = solution.addStep({ x: 1, y: 1, value: 2 }, 50);

            expect(result.ts).toBe(0);
        });
    });

    describe('stringify', () => {
        it('should return empty string for empty solution', () => {
            expect.assertions(1);

            expect(solution.stringify()).toBe('');
        });

        it('should convert steps to base64 encoded string', () => {
            expect.assertions(1);

            solution.addStep({ x: 1, y: 2, value: 3 }, 5);

            expect(solution.stringify().length).toBeGreaterThan(0);
        });
    });

    describe('getElapsedTime', () => {
        it('should return total elapsed time from all steps', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 100);
            solution.addStep({ x: 1, y: 1, value: 2 }, 250);

            expect(solution.getElapsedTime()).toBe(250);
        });
    });

    describe('fromString', () => {
        it('should create empty solution from invalid input', () => {
            expect.assertions(1);

            expect(Solution.fromString('').getSteps()).toEqual([]);
        });

        it('should decode solution steps', () => {
            expect.assertions(1);

            const out = new BitOutputStream();

            out.write(19, CELL_INDEX_BITS);
            out.write(3, VALUE_BITS);
            out.write(100, TIMESTAMP_BITS);

            const steps = String.fromCharCode(...out.bytes());

            expect(Solution.fromString(steps).getSteps()).toEqual([{ cellIndex: 19, value: 3, ts: 100 }]);
        });
    });

    describe('fromSteps', () => {
        it('should create solution from steps array', () => {
            expect.assertions(1);

            const steps: SolutionStepInterface[] = [
                { cellIndex: 0, value: 1, ts: 100 },
                { cellIndex: 49, value: 6, ts: 123 }
            ];

            expect(Solution.fromSteps(steps).getSteps()).toEqual(steps);
        });
    });

    describe('round-trip conversion', () => {
        it('should maintain data integrity through stringify and fromString', () => {
            expect.assertions(1);

            solution.addStep({ x: 0, y: 0, value: 1 }, 0);
            solution.addStep({ x: 4, y: 5, value: 6 }, 123);
            solution.addStep({ x: 8, y: 8, value: 9 }, 250);

            const parsed = Solution.fromString(solution.stringify());

            expect(parsed.getSteps()).toEqual(solution.getSteps());
        });
    });
});
