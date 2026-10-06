import { describe, expect, it } from 'vitest';

import { compareOrdinal } from '../../../src/@generic/utils/compare-ordinal.util';

describe('compareOrdinal', () => {
    it('orders by UTF-16 code unit instead of locale collation', () => {
        expect.assertions(4);

        expect(compareOrdinal('B', 'a')).toBe(-1);
        expect(compareOrdinal('AIC_RING:1', 'AIC:1')).toBe(1);
        expect(compareOrdinal('1:2', '1:2')).toBe(0);
        expect(['B', '_', 'a', '1'].sort(compareOrdinal)).toStrictEqual(['1', 'B', '_', 'a']);
    });
});
