/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';

import { getTapeAxisTime } from './get-tape-axis-time.util';

const TickCount = 44;

describe('getTapeAxisTime', () => {
    it('should follow every second while the run is shorter than the tick count', () => {
        expect.assertions(3);

        expect(getTapeAxisTime(0, TickCount)).toBe(0);
        expect(getTapeAxisTime(10, TickCount)).toBe(10);
        expect(getTapeAxisTime(43, TickCount)).toBe(43);
    });

    it('should hold the axis steady across ticks that cannot move a mark', () => {
        expect.assertions(1);

        expect(getTapeAxisTime(441, TickCount)).toBe(getTapeAxisTime(449, TickCount));
    });

    it('should advance the axis once a tick can move a mark by a whole slot', () => {
        expect.assertions(1);

        expect(getTapeAxisTime(440, TickCount)).toBeLessThan(getTapeAxisTime(480, TickCount));
    });

    it('should never report an axis shorter than the elapsed run', () => {
        expect.assertions(2);

        expect(getTapeAxisTime(441, TickCount)).toBeGreaterThanOrEqual(441);
        expect(getTapeAxisTime(4405, TickCount)).toBeGreaterThanOrEqual(4405);
    });

    it('should clamp a negative elapsed time to zero', () => {
        expect.assertions(1);

        expect(getTapeAxisTime(-5, TickCount)).toBe(0);
    });
});
