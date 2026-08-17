import { describe, expect, it } from '@jest/globals';

import { getCeilingReason } from './get-ceiling-reason.util';

describe('getCeilingReason', () => {
    it('should report a contradiction ahead of a truncated search', () => {
        expect.assertions(1);

        expect(getCeilingReason({ outcome: 'contradiction', wasSearchCapped: true })).toBe('contradiction');
    });

    it('should report a contradiction when no search was truncated', () => {
        expect.assertions(1);

        expect(getCeilingReason({ outcome: 'contradiction', wasSearchCapped: false })).toBe('contradiction');
    });

    it('should report a truncated search for a stuck solve that hit a scan cap', () => {
        expect.assertions(1);

        expect(getCeilingReason({ outcome: 'stuck', wasSearchCapped: true })).toBe('search-capped');
    });

    it('should report the ladder running out for a stuck solve that never hit a scan cap', () => {
        expect.assertions(1);

        expect(getCeilingReason({ outcome: 'stuck', wasSearchCapped: false })).toBe('beyond-ladder');
    });
});
