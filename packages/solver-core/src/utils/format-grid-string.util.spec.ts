import { describe, expect, it } from '@jest/globals';

import { formatGridString } from './format-grid-string.util';
import { parseGridString } from './parse-grid-string.util';

describe('formatGridString', () => {
    it('round-trips with parseGridString', () => {
        const source = '123456789'.repeat(9);
        expect(formatGridString(parseGridString(source))).toBe(source);
    });
});
