/* eslint-disable @typescript-eslint/no-magic-numbers */
import { beforeEach, describe, expect, it } from '@jest/globals';

import { SudokuStringEncoder } from './sudoku-string-encoder';

describe('SudokuStringEncoder', () => {
    let encoder: SudokuStringEncoder;

    beforeEach(() => {
        encoder = new SudokuStringEncoder();
    });

    describe('encode', () => {
        it('should return empty string for invalid input', () => {
            expect.assertions(2);

            expect(encoder.encode('')).toBe('');
            expect(encoder.encode('.'.repeat(80))).toBe('');
        });

        it('should encode sudoku puzzle to base64', () => {
            expect.assertions(1);

            const sudokuString = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';
            expect(encoder.encode(sudokuString).length).toBeGreaterThan(0);
        });

        it('should exclude solution steps from encoded clues', () => {
            expect.assertions(1);

            const sudokuString = `123456789${'.'.repeat(72)}`;
            const steps = [{ cellIndex: 0, value: 1, ts: 0 }];

            const decodedWithSteps = encoder.decode(encoder.encode(sudokuString, steps));
            expect(decodedWithSteps[0]).toBe('.');
        });
    });

    describe('decode', () => {
        it('should return all-empty grid for empty string', () => {
            expect.assertions(1);

            expect(encoder.decode('')).toBe('.'.repeat(81));
        });
    });

    describe('round-trip conversion', () => {
        it('should maintain data integrity through encode and decode', () => {
            expect.assertions(1);

            const original = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';
            expect(encoder.decode(encoder.encode(original))).toBe(original);
        });
    });
});
