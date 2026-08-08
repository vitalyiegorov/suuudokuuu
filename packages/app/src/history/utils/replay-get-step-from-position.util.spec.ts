import { describe, expect, it } from '@jest/globals';

import { replayGetStepFromPosition } from './replay-get-step-from-position.util';

const RoundDownPosition = 24;
const RoundUpPosition = 26;
const RoundToStepSixPosition = 55;
const PositionBeyondRailWidth = 140;

describe('replayGetStepFromPosition', () => {
    it('returns the first step when the rail has no width', () => {
        expect(replayGetStepFromPosition(50, 0, 10)).toBe(0);
    });

    it('returns the first step when the replay has no steps', () => {
        expect(replayGetStepFromPosition(50, 100, 0)).toBe(0);
    });

    it('maps rail edges to the first and last steps', () => {
        expect(replayGetStepFromPosition(0, 100, 10)).toBe(0);
        expect(replayGetStepFromPosition(100, 100, 10)).toBe(10);
    });

    it('rounds to the nearest step', () => {
        expect(replayGetStepFromPosition(RoundDownPosition, 100, 10)).toBe(2);
        expect(replayGetStepFromPosition(RoundUpPosition, 100, 10)).toBe(3);
        expect(replayGetStepFromPosition(RoundToStepSixPosition, 100, 10)).toBe(6);
    });

    it('clamps positions outside the rail', () => {
        expect(replayGetStepFromPosition(-20, 100, 10)).toBe(0);
        expect(replayGetStepFromPosition(PositionBeyondRailWidth, 100, 10)).toBe(10);
    });
});
