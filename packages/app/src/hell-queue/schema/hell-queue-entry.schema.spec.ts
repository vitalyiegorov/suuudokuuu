import { describe, expect, it } from '@jest/globals';

import { HellQueueEntrySchema, HellQueueEntrySchemaVersion } from './hell-queue-entry.schema';

const HellQueueFieldStringLength = 81;
const eightyOneDigitField = '1'.repeat(HellQueueFieldStringLength);

const validHellQueueEntry = {
    id: eightyOneDigitField,
    puzzle: eightyOneDigitField,
    solution: eightyOneDigitField,
    givensCount: 17,
    createdAt: 1753833600000,
    generatorVersion: 1,
    schemaVersion: HellQueueEntrySchemaVersion
};

describe('HellQueueEntrySchema', () => {
    it('accepts a valid hell queue entry', () => {
        expect(HellQueueEntrySchema.safeParse(validHellQueueEntry).success).toBe(true);
    });

    it('rejects a puzzle string that is not 81 digits long', () => {
        expect(HellQueueEntrySchema.safeParse({ ...validHellQueueEntry, puzzle: '123' }).success).toBe(false);
    });

    it('rejects an 80-character puzzle string', () => {
        const eightyDigitField = '1'.repeat(HellQueueFieldStringLength - 1);

        expect(HellQueueEntrySchema.safeParse({ ...validHellQueueEntry, puzzle: eightyDigitField }).success).toBe(false);
    });

    it('rejects an 82-character puzzle string', () => {
        const eightyTwoDigitField = '1'.repeat(HellQueueFieldStringLength + 1);

        expect(HellQueueEntrySchema.safeParse({ ...validHellQueueEntry, puzzle: eightyTwoDigitField }).success).toBe(false);
    });

    it('rejects a solution string containing non-digit characters', () => {
        const solutionWithLetters = `${'1'.repeat(HellQueueFieldStringLength - 1)}x`;

        expect(HellQueueEntrySchema.safeParse({ ...validHellQueueEntry, solution: solutionWithLetters }).success).toBe(false);
    });

    it('rejects a givensCount below the minimum', () => {
        expect(HellQueueEntrySchema.safeParse({ ...validHellQueueEntry, givensCount: 16 }).success).toBe(false);
    });

    it('rejects a givensCount above the maximum', () => {
        expect(HellQueueEntrySchema.safeParse({ ...validHellQueueEntry, givensCount: 21 }).success).toBe(false);
    });

    it('rejects a non-integer givensCount', () => {
        expect(HellQueueEntrySchema.safeParse({ ...validHellQueueEntry, givensCount: 17.5 }).success).toBe(false);
    });

    it('rejects an unknown schema version', () => {
        const unknownSchemaVersion = 99;

        expect(HellQueueEntrySchema.safeParse({ ...validHellQueueEntry, schemaVersion: unknownSchemaVersion }).success).toBe(false);
    });

    it('rejects the next schema version as not yet supported', () => {
        const nextSchemaVersion = HellQueueEntrySchemaVersion + 1;

        expect(HellQueueEntrySchema.safeParse({ ...validHellQueueEntry, schemaVersion: nextSchemaVersion }).success).toBe(false);
    });

    it('rejects an id that does not match the puzzle', () => {
        const mismatchedId = '2'.repeat(HellQueueFieldStringLength);

        expect(HellQueueEntrySchema.safeParse({ ...validHellQueueEntry, id: mismatchedId }).success).toBe(false);
    });

    it('rejects extra unknown keys', () => {
        expect(HellQueueEntrySchema.safeParse({ ...validHellQueueEntry, extra: true }).success).toBe(false);
    });
});
