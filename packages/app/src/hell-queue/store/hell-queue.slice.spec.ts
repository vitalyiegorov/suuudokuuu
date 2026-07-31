import { describe, expect, it } from '@jest/globals';

import { HellQueueEntrySchemaVersion } from '../schema/hell-queue-entry.schema';

import { hellQueueConsumeAction, hellQueueEnqueueAction } from './hell-queue.actions';
import { hellQueueSlice } from './hell-queue.slice';
import { initialHellQueueState } from './hell-queue.state';

import type { HellQueueState } from './hell-queue.state';
import type { HellQueueEntryInterface } from '../interfaces/hell-queue-entry.interface';

const HellQueueFieldStringLength = 81;

const buildEntry = (id: string): HellQueueEntryInterface => ({
    id,
    puzzle: id,
    solution: id,
    givensCount: 17,
    createdAt: 1,
    generatorVersion: 1,
    schemaVersion: HellQueueEntrySchemaVersion
});

const firstEntry = buildEntry('1'.repeat(HellQueueFieldStringLength));
const secondEntry = buildEntry('2'.repeat(HellQueueFieldStringLength));

describe('hellQueueSlice', () => {
    it('enqueues a new entry', () => {
        const state = hellQueueSlice.reducer(initialHellQueueState, hellQueueEnqueueAction(firstEntry));

        expect(state.entries).toEqual([firstEntry]);
    });

    it('appends additional entries in order', () => {
        const seeded = hellQueueSlice.reducer(initialHellQueueState, hellQueueEnqueueAction(firstEntry));
        const state = hellQueueSlice.reducer(seeded, hellQueueEnqueueAction(secondEntry));

        expect(state.entries).toEqual([firstEntry, secondEntry]);
    });

    it('does not enqueue a duplicate id', () => {
        const seeded = hellQueueSlice.reducer(initialHellQueueState, hellQueueEnqueueAction(firstEntry));
        const duplicate = { ...firstEntry, givensCount: 18 };
        const state = hellQueueSlice.reducer(seeded, hellQueueEnqueueAction(duplicate));

        expect(state.entries).toEqual([firstEntry]);
    });

    it('does not enqueue past capacity', () => {
        const fullState: HellQueueState = {
            entries: Array.from({ length: 10 }, (_unusedValue, index) => buildEntry(String(index).repeat(HellQueueFieldStringLength)))
        };
        const overCapacityEntry = buildEntry('a'.repeat(HellQueueFieldStringLength));

        const state = hellQueueSlice.reducer(fullState, hellQueueEnqueueAction(overCapacityEntry));

        expect(state.entries).toEqual(fullState.entries);
    });

    it('consumes exactly the matching entry', () => {
        const seeded = hellQueueSlice.reducer(initialHellQueueState, hellQueueEnqueueAction(firstEntry));
        const withSecond = hellQueueSlice.reducer(seeded, hellQueueEnqueueAction(secondEntry));
        const state = hellQueueSlice.reducer(withSecond, hellQueueConsumeAction({ id: firstEntry.id }));

        expect(state.entries).toEqual([secondEntry]);
    });

    it('is a no-op when consuming an absent id', () => {
        const seeded = hellQueueSlice.reducer(initialHellQueueState, hellQueueEnqueueAction(firstEntry));
        const state = hellQueueSlice.reducer(seeded, hellQueueConsumeAction({ id: 'missing-id' }));

        expect(state.entries).toEqual(seeded.entries);
    });

    it('is a no-op when consuming the same id twice', () => {
        const seeded = hellQueueSlice.reducer(initialHellQueueState, hellQueueEnqueueAction(firstEntry));
        const consumedOnce = hellQueueSlice.reducer(seeded, hellQueueConsumeAction({ id: firstEntry.id }));
        const consumedTwice = hellQueueSlice.reducer(consumedOnce, hellQueueConsumeAction({ id: firstEntry.id }));

        expect(consumedTwice.entries).toEqual([]);
        expect(consumedTwice.entries).toEqual(consumedOnce.entries);
    });
});
