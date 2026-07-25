import { describe, expect, it } from '@jest/globals';

import { gameNextSuccessCellTrigger } from './game-next-success-cell-trigger.util';

describe('gameNextSuccessCellTrigger', () => {
    it('starts at generation one for the first triggered cell', () => {
        const trigger = gameNextSuccessCellTrigger({ key: '', generation: 0 }, '0-0');

        expect(trigger).toStrictEqual({ key: '0-0', generation: 1 });
    });

    it('always increments the generation, even when the same cell triggers again', () => {
        const firstTrigger = gameNextSuccessCellTrigger({ key: '', generation: 0 }, '3-3');

        const secondTrigger = gameNextSuccessCellTrigger(firstTrigger, '3-3');

        expect(secondTrigger).toStrictEqual({ key: '3-3', generation: 2 });
    });

    it('replaces the key when a different cell becomes the target', () => {
        const firstTrigger = gameNextSuccessCellTrigger({ key: '', generation: 0 }, '1-1');

        const secondTrigger = gameNextSuccessCellTrigger(firstTrigger, '2-2');

        expect(secondTrigger).toStrictEqual({ key: '2-2', generation: 2 });
    });

    it('produces a strictly increasing generation across a rapid burst of triggers', () => {
        const cellKeys = ['0-0', '0-1', '0-2', '1-0', '1-1'];

        const finalTrigger = cellKeys.reduce((previousTrigger, cellKey) => gameNextSuccessCellTrigger(previousTrigger, cellKey), {
            key: '',
            generation: 0
        });

        expect(finalTrigger).toStrictEqual({ key: '1-1', generation: 5 });
    });
});
