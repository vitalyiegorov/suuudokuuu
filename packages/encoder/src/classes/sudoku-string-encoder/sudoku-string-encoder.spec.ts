/* eslint-disable @typescript-eslint/no-magic-numbers */
import { beforeEach, describe, expect, it } from '@jest/globals';

import { SudokuStringEncoder } from './sudoku-string-encoder';

describe('SudokuStringEncoder', () => {
    let encoder: SudokuStringEncoder;

    beforeEach(() => {
        encoder = new SudokuStringEncoder();
    });

    describe('encode', () => {
        it('should return empty string for invalid length input', () => {
            expect.assertions(3);

            expect(encoder.encode('')).toBe('');
            expect(encoder.encode('123')).toBe('');
            expect(encoder.encode('.'.repeat(80))).toBe('');
        });

        it('should return empty string for all-empty grid', () => {
            expect.assertions(1);

            expect(encoder.encode('.'.repeat(81))).toBe('');
        });

        it('should encode a simple grid with few clues', () => {
            expect.assertions(1);

            const sudokuString = `1${'.'.repeat(80)}`;
            const encoded = encoder.encode(sudokuString);

            expect(encoded.length).toBeGreaterThan(0);
        });

        it('should encode typical sudoku puzzle', () => {
            expect.assertions(1);

            const sudokuString = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';

            const encoded = encoder.encode(sudokuString);
            expect(encoded.length).toBeGreaterThan(0);
        });
    });

    describe('decode', () => {
        it('should return all-empty grid for empty string', () => {
            expect.assertions(2);

            const decoded = encoder.decode('');
            expect(decoded.length).toBe(81);
            expect(decoded).toBe('.'.repeat(81));
        });
    });

    describe('encode with steps', () => {
        it('should exclude solution steps from encoded clues', () => {
            expect.assertions(2);

            const sudokuString = `123456789${'.'.repeat(72)}`;
            const steps = [
                { cellIndex: 0, value: 1, ts: 0 },
                { cellIndex: 1, value: 2, ts: 10 }
            ];

            const encodedWithSteps = encoder.encode(sudokuString, steps);
            const encodedWithoutSteps = encoder.encode(sudokuString);

            expect(encodedWithSteps.length).toBeLessThan(encodedWithoutSteps.length);

            const decodedWithSteps = encoder.decode(encodedWithSteps);
            expect(decodedWithSteps[0]).toBe('.');
        });
    });

    describe('round-trip conversion', () => {
        it('should maintain data integrity through encode and decode', () => {
            expect.assertions(1);

            const original = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';

            const encoded = encoder.encode(original);
            const decoded = encoder.decode(encoded);

            expect(decoded).toBe(original);
        });

        it('should handle grid with all empty cells', () => {
            expect.assertions(1);

            const original = '.'.repeat(81);
            const encoded = encoder.encode(original);
            const decoded = encoder.decode(encoded);

            expect(decoded).toBe(original);
        });

        it('should handle fully filled grid', () => {
            expect.assertions(1);

            const original = '123456789456789123789123456234567891567891234891234567345678912678912345912345678';

            const encoded = encoder.encode(original);
            const decoded = encoder.decode(encoded);

            expect(decoded).toBe(original);
        });

        it('should handle grid with single clue', () => {
            expect.assertions(1);

            const original = `5${'.'.repeat(80)}`;
            const encoded = encoder.encode(original);
            const decoded = encoder.decode(encoded);

            expect(decoded).toBe(original);
        });

        it('should handle grid with clue at end', () => {
            expect.assertions(1);

            const original = `${'.'.repeat(80)}9`;
            const encoded = encoder.encode(original);
            const decoded = encoder.decode(encoded);

            expect(decoded).toBe(original);
        });

        it('should handle sparse grid', () => {
            expect.assertions(1);

            const chars = '.'.repeat(81).split('');
            chars[0] = '1';
            chars[40] = '5';
            chars[80] = '9';
            const original = chars.join('');

            const encoded = encoder.encode(original);
            const decoded = encoder.decode(encoded);

            expect(decoded).toBe(original);
        });
    });

    describe('compression efficiency', () => {
        it('should produce shorter output than original for sparse puzzle', () => {
            expect.assertions(1);

            const chars = '.'.repeat(81).split('');
            for (let i = 0; i < 25; i += 1) {
                chars[i * 3] = String((i % 9) + 1);
            }
            const original = chars.join('');

            const encoded = encoder.encode(original);

            expect(encoded.length).toBeLessThan(original.length);
        });

        it('should produce much shorter output for very sparse puzzle', () => {
            expect.assertions(1);

            const chars = '.'.repeat(81).split('');
            chars[0] = '1';
            chars[40] = '5';
            const original = chars.join('');

            const encoded = encoder.encode(original);

            expect(encoded.length).toBeLessThan(10);
        });
    });

    describe('all value positions', () => {
        it('should correctly encode and decode all cell positions', () => {
            expect.assertions(81);

            for (let i = 0; i < 81; i += 1) {
                const chars = '.'.repeat(81).split('');
                chars[i] = '5';
                const original = chars.join('');

                const encoded = encoder.encode(original);
                const decoded = encoder.decode(encoded);

                expect(decoded).toBe(original);
            }
        });

        it('should correctly encode and decode all values', () => {
            expect.assertions(9);

            for (let val = 1; val <= 9; val += 1) {
                const chars = '.'.repeat(81).split('');
                chars[0] = val.toString();
                const original = chars.join('');

                const encoded = encoder.encode(original);
                const decoded = encoder.decode(encoded);

                expect(decoded).toBe(original);
            }
        });
    });
});
