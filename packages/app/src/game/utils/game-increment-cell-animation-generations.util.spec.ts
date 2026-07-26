import { describe, expect, it } from '@jest/globals';

import { gameIncrementCellAnimationGenerations } from './game-increment-cell-animation-generations.util';

describe('gameIncrementCellAnimationGenerations', () => {
    it('starts touched cells at generation one from an empty state', () => {
        const nextGenerations = gameIncrementCellAnimationGenerations({}, new Set(['0-0', '0-1']));

        expect(nextGenerations).toStrictEqual({ '0-0': 1, '0-1': 1 });
    });

    it('merges into previous generations instead of replacing them', () => {
        const previousGenerations = { '0-0': 3, '5-5': 1 };

        const nextGenerations = gameIncrementCellAnimationGenerations(previousGenerations, new Set(['1-1']));

        expect(nextGenerations).toStrictEqual({ '0-0': 3, '5-5': 1, '1-1': 1 });
    });

    it('keeps untouched cells at their previous generation when a new batch lands', () => {
        const previousGenerations = gameIncrementCellAnimationGenerations({}, new Set(['0-0', '0-1']));

        const nextGenerations = gameIncrementCellAnimationGenerations(previousGenerations, new Set(['0-2']));

        expect(nextGenerations['0-0']).toBe(1);
        expect(nextGenerations['0-1']).toBe(1);
        expect(nextGenerations['0-2']).toBe(1);
    });

    it('increments a cell touched by two rapid overlapping batches instead of resetting it', () => {
        const firstBatch = gameIncrementCellAnimationGenerations({}, new Set(['4-4']));

        const secondBatch = gameIncrementCellAnimationGenerations(firstBatch, new Set(['4-4']));

        expect(secondBatch['4-4']).toBe(2);
    });

    it('never lowers a generation, so a stale re-render cannot look like the latest trigger', () => {
        const generations = [0, 1, 2, 3].reduce<Record<string, number>>(
            previousGenerations => gameIncrementCellAnimationGenerations(previousGenerations, new Set(['2-3'])),
            {}
        );

        expect(generations['2-3']).toBe(4);
    });

    it('does not mutate the previous generations object', () => {
        const previousGenerations = { '0-0': 1 };

        gameIncrementCellAnimationGenerations(previousGenerations, new Set(['0-0']));

        expect(previousGenerations).toStrictEqual({ '0-0': 1 });
    });
});
