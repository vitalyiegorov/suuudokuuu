import { describe, expect, it } from '@jest/globals';

import { SolutionStepInterface } from '../../interfaces/solution-step.interface';

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

        it('should produce URL-safe encoded string', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);

            expect(encoded).toMatch(/^[A-Za-z0-9+\-$]*$/u);
        });
    });

    describe('decode', () => {
        it('should return null for empty string', () => {
            expect.assertions(1);

            expect(() => serializer.decode('')).toThrow();
        });

        it('should throw error on invalid string', () => {
            expect.assertions(1);

            expect(() => serializer.decode('invalid-gibberish-123')).toThrow();
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

        it('should preserve solution steps through encode/decode cycle', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 3, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[1]).toEqual(sampleSolutionSteps);
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

        it('should handle large maxMistakes value', () => {
            expect.assertions(1);

            const encoded = serializer.encode(validSudokuString, sampleSolutionSteps, 999, false);
            const decoded = serializer.decode(encoded);

            expect(decoded[2]).toBe(999);
        });

        it('should handle solution steps with edge values', () => {
            expect.assertions(3);

            const complexSteps: SolutionStepInterface[] = [
                { cellIndex: 0, value: 1, ts: 255 },
                { cellIndex: 80, value: 9, ts: 255 },
                { cellIndex: 40, value: 5, ts: 128 }
            ];
            const encoded = serializer.encode(validSudokuString, complexSteps, 3, false);
            const decoded = serializer.decode(encoded);

            expect(decoded).not.toBeNull();
            expect(decoded[1]).toEqual(complexSteps);
            expect(decoded[2]).toBe(3);
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
