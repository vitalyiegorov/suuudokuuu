/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { SolutionStepInterface } from '../../@generic/interfaces/solution-step.interface';

import { GameStateSerializer } from './game-state-serializer';

describe('GameStateSerializer', () => {
    const serializer = new GameStateSerializer();

    const validSudokuString = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

    const sampleSolutionSteps: SolutionStepInterface[] = [
        { cellIndex: 2, value: 4, ts: 100 },
        { cellIndex: 5, value: 6, ts: 150 },
        { cellIndex: 8, value: 2, ts: 200 }
    ];

    describe('encode', () => {
        it('should encode game state to a non-empty string', () => {
            expect.assertions(2);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);

            expect(encoded).toBeDefined();
            expect(encoded.length).toBeGreaterThan(0);
        });

        it('should produce different output for challenge vs non-challenge', () => {
            expect.assertions(1);

            const encodedNormal = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);
            const encodedChallenge = serializer.encode(validSudokuString, sampleSolutionSteps, 3, true);

            expect(encodedNormal).not.toBe(encodedChallenge);
        });

        it('should produce URL-safe encoded string without reserved characters', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);

            expect(encoded).toMatch(/^_[\w-]*$/u);
        });
    });

    describe('decode', () => {
        it('should throw error for empty string', () => {
            expect.assertions(1);

            expect(() => serializer.decode('')).toThrow('Failed to decompress game state');
        });

        it('should throw error on invalid string', () => {
            expect.assertions(1);

            expect(() => serializer.decode('invalid-gibberish-123')).toThrow('Failed to decompress game state');
        });

        it('should throw error for truncated data with less than 4 segments', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);
            const truncated = encoded.slice(0, Math.floor(encoded.length / 2));

            expect(() => serializer.decode(truncated)).toThrow();
        });
    });

    describe('elapsedTime', () => {
        it('should return elapsedTime as the 5th element of the tuple', () => {
            expect.assertions(2);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);
            const decoded = serializer.decode(encoded);

            expect(decoded.length).toBe(5);
            expect(typeof decoded[4]).toBe('number');
        });

        it('should calculate elapsedTime as sum of all step timestamps', () => {
            expect.assertions(1);

            const stepsWithKnownTime: SolutionStepInterface[] = [
                { cellIndex: 2, value: 4, ts: 50 },
                { cellIndex: 5, value: 6, ts: 75 },
                { cellIndex: 8, value: 2, ts: 100 }
            ];
            const expectedElapsedTime = 50 + 75 + 100;
            const encoded = serializer.encode(validSudokuString, stepsWithKnownTime, 3, true);
            const decoded = serializer.decode(encoded);

            expect(decoded[4]).toBe(expectedElapsedTime);
        });

        it('should return zero elapsedTime for empty solution steps', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, [], 3, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[4]).toBe(0);
        });

        it('should calculate total elapsed time from multiple steps within 8-bit range', () => {
            expect.assertions(1);

            const step1Ts = 100;
            const step2Ts = 150;
            const step3Ts = 200;
            const stepsWithTimeDiffs: SolutionStepInterface[] = [
                { cellIndex: 0, value: 1, ts: step1Ts },
                { cellIndex: 1, value: 2, ts: step2Ts },
                { cellIndex: 2, value: 3, ts: step3Ts }
            ];
            const expectedTotal = step1Ts + step2Ts + step3Ts;
            const encoded = serializer.encode(validSudokuString, stepsWithTimeDiffs, 3, true);
            const decoded = serializer.decode(encoded);

            expect(decoded[4]).toBe(expectedTotal);
        });

        it('should cap individual timestamps at 255 (8-bit max)', () => {
            expect.assertions(1);

            const maxTimestamp = 255;
            const stepsWithMaxTimestamp: SolutionStepInterface[] = [
                { cellIndex: 0, value: 1, ts: maxTimestamp },
                { cellIndex: 1, value: 2, ts: maxTimestamp }
            ];
            const encoded = serializer.encode(validSudokuString, stepsWithMaxTimestamp, 3, true);
            const decoded = serializer.decode(encoded);

            expect(decoded[4]).toBe(maxTimestamp * 2);
        });
    });

    describe('round-trip serialization', () => {
        it('should preserve sudokuString through encode/decode cycle', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[0]).toBe(validSudokuString);
        });

        it('should preserve maxMistakes through encode/decode cycle', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 5, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[2]).toBe(5);
        });

        it('should preserve isChallenge=false through encode/decode cycle', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[3]).toBe(false);
        });

        it('should preserve isChallenge=true through encode/decode cycle', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, true);
            const decoded = serializer.decode(encoded);

            expect(decoded[3]).toBe(true);
        });

        it('should preserve solution steps through encode/decode cycle for challenges', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, true);
            const decoded = serializer.decode(encoded);

            expect(decoded[1]).toEqual(sampleSolutionSteps);
        });

        it('should omit solution steps for non-challenge shares', () => {
            expect.assertions(2);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[1]).toEqual([]);
            expect(decoded[4]).toBe(0);
        });

        it('should handle empty solution steps', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, [], 3, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[0]).toBe(validSudokuString);
        });

        it('should handle maxMistakes of zero', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 0, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[2]).toBe(0);
        });

        it('should clamp maxMistakes above the encodable limit', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 999, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[2]).toBe(255);
        });

        it('should preserve the immortal maxMistakes preset', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 99, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[2]).toBe(99);
        });

        it('should handle solution steps with edge values', () => {
            expect.assertions(3);

            const complexSteps: SolutionStepInterface[] = [
                { cellIndex: 0, value: 1, ts: 255 },
                { cellIndex: 80, value: 9, ts: 255 },
                { cellIndex: 40, value: 5, ts: 128 }
            ];
            const encoded = serializer.encode(validSudokuString, complexSteps, 3, true);
            const decoded = serializer.decode(encoded);

            expect(decoded).not.toBeNull();
            expect(decoded[1]).toEqual(complexSteps);
            expect(decoded[2]).toBe(3);
        });
    });

    describe('legacy format compatibility', () => {
        const legacyGivens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
        const legacyPuzzle = 'CwJgXAAABQMgxASIIYCCBsBxAlATiwMAA0AdgfABMAzARIGQAhgZMIGoBdBAVkoBuAHgHkARgCQAwgIwAyMABmEAe4BCAAQAMYCWADMWtUA';
        const legacyChallenge =
            'CwJgXAAABQMgxASIIYCCBsBxAlATiwMAA0AdgfABMAzARIGQAhgZMIGoBdBAVkoBuAHgHkARgCQAwgIwAyMABmEAe4BCAAQkhwAEACBAAIAbABgA0+fAASAAwCOAGAAIAwQFAAHAAMATQBgAeEgAQgARDABj8ACQg+gAy2wBNAGAAaHMkAFDvYABDgHCAFEMeMV8AByEAIFt0xIBEIIAjACVvGABBgCj8iQBlMRZzAFH6WwAegGHbAAkAYxFvAHMAQABY7oAWsVcggHGAKlsAC-GAXAAOmYAT7wA-AEFzexBksQBRdwAJgDGATHtxkRQcgAUu8ADS7swQKUxBAJGAAMzwiRAA';

        it('should decode a legacy puzzle link', () => {
            expect.assertions(1);

            const decoded = serializer.decode(legacyPuzzle);

            expect(decoded).toEqual([legacyGivens, [], 3, false, 0]);
        });

        it('should decode a legacy challenge link', () => {
            expect.assertions(4);

            const decoded = serializer.decode(legacyChallenge);

            expect(decoded[0]).toBe(legacyGivens);
            expect(decoded[1]).toHaveLength(51);
            expect(decoded[3]).toBe(true);
            expect(decoded[4]).toBe(612);
        });
    });

    describe('length-prefixed parsing robustness', () => {
        it('should handle content that contains colon characters', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[0]).toBe(validSudokuString);
        });

        it('should handle content that contains pipe characters', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[0]).toBe(validSudokuString);
        });

        it('should produce consistent results across multiple encode/decode cycles', () => {
            expect.assertions(3);

            const encoded1 = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);
            const decoded1 = serializer.decode(encoded1);

            expect(decoded1).not.toBeNull();

            const [field1, steps1, maxMistakes1, isChallenge1] = decoded1;
            const encoded2 = serializer.encode(field1, steps1, maxMistakes1, isChallenge1);
            const decoded2 = serializer.decode(encoded2);

            expect(decoded1[0]).toBe(decoded2[0]);
            expect(decoded1[2]).toBe(decoded2[2]);
        });
    });
});
