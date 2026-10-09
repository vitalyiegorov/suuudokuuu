import { describe, expect, it } from 'vitest';

import { getWitnessPoint } from '../../src/utils/get-witness-point.util';

describe('getWitnessPoint', () => {
    it('centers a candidate inside its cell on the 27 by 27 witness grid', () => {
        expect(getWitnessPoint({ x: 0, y: 0 }, 1)).toEqual({ x: 0.5, y: 0.5 });
        expect(getWitnessPoint({ x: 0, y: 0 }, 5)).toEqual({ x: 1.5, y: 1.5 });
        expect(getWitnessPoint({ x: 8, y: 8 }, 9)).toEqual({ x: 26.5, y: 26.5 });
    });
});
