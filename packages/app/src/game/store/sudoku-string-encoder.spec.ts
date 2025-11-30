/* eslint-disable @typescript-eslint/no-magic-numbers, lingui/no-unlocalized-strings, no-plusplus */
import { describe, expect, it } from '@jest/globals';

import { decodeSudokuString, encodeSudokuString } from './sudoku-string-encoder';

describe('Sudoku String Encoder', () => {
    describe('encodeSudokuString', () => {
        it('should return empty string for invalid length input', () => {
            expect.assertions(3);

            expect(encodeSudokuString('')).toBe('');
            expect(encodeSudokuString('123')).toBe('');
            expect(encodeSudokuString('.'.repeat(80))).toBe('');
        });

        it('should return empty string for all-empty grid', () => {
            expect.assertions(1);

            expect(encodeSudokuString('.'.repeat(81))).toBe('');
        });

        it('should encode a simple grid with few clues', () => {
            expect.assertions(1);

            const sudokuString = `1${  '.'.repeat(80)}`;
            const encoded = encodeSudokuString(sudokuString);

            expect(encoded.length).toBeGreaterThan(0);
        });

        it('should encode typical sudoku puzzle', () => {
            expect.assertions(1);

            const sudokuString = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';

            const encoded = encodeSudokuString(sudokuString);
            expect(encoded.length).toBeGreaterThan(0);
        });
    });

    describe('decodeSudokuString', () => {
        it('should return all-empty grid for empty string', () => {
            expect.assertions(2);

            const decoded = decodeSudokuString('');
            expect(decoded.length).toBe(81);
            expect(decoded).toBe('.'.repeat(81));
        });

        it('should return all-empty grid for invalid base64', () => {
            expect.assertions(2);

            const decoded = decodeSudokuString('!!!invalid!!!');
            expect(decoded.length).toBe(81);
            expect(decoded).toBe('.'.repeat(81));
        });
    });

    describe('round-trip conversion', () => {
        it('should maintain data integrity through encode and decode', () => {
            expect.assertions(1);

            const original = '...469123469123875123875469784596...596231784231784596658947312947312658312658...';

            const encoded = encodeSudokuString(original);
            const decoded = decodeSudokuString(encoded);

            expect(decoded).toBe(original);
        });

        it('should handle grid with all empty cells', () => {
            expect.assertions(1);

            const original = '.'.repeat(81);
            const encoded = encodeSudokuString(original);
            const decoded = decodeSudokuString(encoded);

            expect(decoded).toBe(original);
        });

        it('should handle fully filled grid', () => {
            expect.assertions(1);

            const original = '123456789456789123789123456234567891567891234891234567345678912678912345912345678';

            const encoded = encodeSudokuString(original);
            const decoded = decodeSudokuString(encoded);

            expect(decoded).toBe(original);
        });

        it('should handle grid with single clue', () => {
            expect.assertions(1);

            const original = `5${  '.'.repeat(80)}`;
            const encoded = encodeSudokuString(original);
            const decoded = decodeSudokuString(encoded);

            expect(decoded).toBe(original);
        });

        it('should handle grid with clue at end', () => {
            expect.assertions(1);

            const original = `${'.'.repeat(80)  }9`;
            const encoded = encodeSudokuString(original);
            const decoded = decodeSudokuString(encoded);

            expect(decoded).toBe(original);
        });

        it('should handle sparse grid', () => {
            expect.assertions(1);

            const chars = '.'.repeat(81).split('');
            chars[0] = '1';
            chars[40] = '5';
            chars[80] = '9';
            const original = chars.join('');

            const encoded = encodeSudokuString(original);
            const decoded = decodeSudokuString(encoded);

            expect(decoded).toBe(original);
        });
    });

    describe('compression efficiency', () => {
        it('should produce shorter output than original for sparse puzzle', () => {
            expect.assertions(1);

            const chars = '.'.repeat(81).split('');
            for (let i = 0; i < 25; i++) {
                chars[i * 3] = String((i % 9) + 1);
            }
            const original = chars.join('');

            const encoded = encodeSudokuString(original);

            expect(encoded.length).toBeLessThan(original.length);
        });

        it('should produce much shorter output for very sparse puzzle', () => {
            expect.assertions(1);

            const chars = '.'.repeat(81).split('');
            chars[0] = '1';
            chars[40] = '5';
            const original = chars.join('');

            const encoded = encodeSudokuString(original);

            expect(encoded.length).toBeLessThan(10);
        });
    });

    describe('all value positions', () => {
        it('should correctly encode and decode all cell positions', () => {
            expect.assertions(81);

            for (let i = 0; i < 81; i++) {
                const chars = '.'.repeat(81).split('');
                chars[i] = '5';
                const original = chars.join('');

                const encoded = encodeSudokuString(original);
                const decoded = decodeSudokuString(encoded);

                expect(decoded).toBe(original);
            }
        });

        it('should correctly encode and decode all values', () => {
            expect.assertions(9);

            for (let val = 1; val <= 9; val++) {
                const chars = '.'.repeat(81).split('');
                chars[0] = val.toString();
                const original = chars.join('');

                const encoded = encodeSudokuString(original);
                const decoded = decodeSudokuString(encoded);

                expect(decoded).toBe(original);
            }
        });
    });
});
