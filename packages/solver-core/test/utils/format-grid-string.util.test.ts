import { describe, expect, it } from 'vitest';

import { formatGridString } from '../../src/utils/format-grid-string.util';
import { parseGridString } from '../../src/utils/parse-grid-string.util';

describe('formatGridString', () => {
    it('round-trips with parseGridString', () => {
        const source = '123456789'.repeat(9);
        expect(formatGridString(parseGridString(source))).toBe(source);
    });
});
