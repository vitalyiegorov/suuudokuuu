import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('ReplayControls', () => {
    it('keeps replay controls scoped to manual step navigation', () => {
        const source = readFileSync(join(__dirname, 'replay-controls.tsx'), 'utf8');

        expect(source).not.toContain('LucidePlay');
        expect(source).not.toContain('1×');
    });
});
