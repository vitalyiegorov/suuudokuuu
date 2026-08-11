import { describe, expect, it } from '@jest/globals';

import { getFieldClassName } from './get-field-class-name.util';

describe('getFieldClassName', () => {
    it('returns the base class name without a custom class name', () => {
        expect(getFieldClassName('field-board')).toBe('field-board');
    });

    it('ignores an empty custom class name', () => {
        expect(getFieldClassName('field-board', '')).toBe('field-board');
    });

    it('appends a custom class name', () => {
        expect(getFieldClassName('field-board', 'embed')).toBe('field-board embed');
    });
});
