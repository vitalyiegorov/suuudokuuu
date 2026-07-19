import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('CompletedGameResultDetails', () => {
    it('keeps result metrics and the Ukraine support card together while accepting explicit test selectors', () => {
        const source = readFileSync(join(__dirname, 'completed-game-result-details.tsx'), 'utf8');

        expect(source).toContain('GameResultMetrics');
        expect(source).toContain('AppMetricCard');
        expect(source).toContain('UkraineSupportCard');
        expect(source).toContain('timeTestID');
        expect(source).toContain('mistakesTestID');
        expect(source).toContain('ukraineSupportTestID');
        expect(source).toContain('t`Time`');
        expect(source).toContain('t`Mistakes`');
    });
});
