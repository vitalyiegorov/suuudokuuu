import { describe, expect, it } from '@jest/globals';

import { replayGetStepProgress } from './replay-get-step-progress.util';

const StepPastEnd = 12;

describe('replayGetStepProgress', () => {
    it('returns no progress when replay has no steps', () => {
        expect(replayGetStepProgress(0, 0)).toBe(0);
    });

    it('returns bounded progress for the current replay step', () => {
        expect(replayGetStepProgress(5, 10)).toBe(0.5);
        expect(replayGetStepProgress(10, 10)).toBe(1);
        expect(replayGetStepProgress(StepPastEnd, 10)).toBe(1);
        expect(replayGetStepProgress(-1, 10)).toBe(0);
    });
});
