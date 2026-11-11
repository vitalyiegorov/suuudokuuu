import { describe, expect, it } from 'vitest';

import { getCellKey } from '../../../src/@generic/utils/get-cell-key.util';

describe('getCellKey', () => {
    it('keys a cell by row then column', () => {
        expect(getCellKey({ x: 8, y: 2 })).toBe('2-8');
    });
});
