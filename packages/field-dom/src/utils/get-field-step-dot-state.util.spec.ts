import { describe, expect, it } from '@jest/globals';

import { getFieldStepDotState } from './get-field-step-dot-state.util';

describe('getFieldStepDotState', () => {
    it('marks the current dot as active', () => {
        expect(getFieldStepDotState(2, 2)).toBe('active');
    });

    it('marks passed dots as done', () => {
        expect(getFieldStepDotState(0, 2)).toBe('done');
    });

    it('marks upcoming dots as pending', () => {
        expect(getFieldStepDotState(3, 2)).toBe('pending');
    });
});
