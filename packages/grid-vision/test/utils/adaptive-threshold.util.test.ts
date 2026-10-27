import { describe, expect, it } from 'vitest';

import { adaptiveThreshold } from '../../src/utils/adaptive-threshold.util';

const PAPER = 200;
const INK = 40;
const SIZE = 5;
const CENTER = 12;
const RADIUS = 2;
const SENSITIVITY = 0.15;

describe('adaptiveThreshold', () => {
    it('should mark only pixels darker than their local mean as ink', () => {
        const data = new Float32Array(SIZE * SIZE).fill(PAPER);

        data[CENTER] = INK;

        expect(Array.from(adaptiveThreshold({ width: SIZE, height: SIZE, data }, RADIUS, SENSITIVITY).data)).toEqual(
            Array.from(data, value => (value === INK ? 1 : 0))
        );
    });

    it('should ignore a smooth lighting gradient', () => {
        const data = Float32Array.from({ length: SIZE * SIZE }, (_, index) => PAPER - index);

        expect(adaptiveThreshold({ width: SIZE, height: SIZE, data }, RADIUS, SENSITIVITY).data.every(value => value === 0)).toBe(true);
    });
});
