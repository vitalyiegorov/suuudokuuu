import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('SettingsScreen', () => {
    it('uses the chrome page safe-area spacing without a legacy bottom preset', () => {
        const source = readFileSync(join(__dirname, 'settings.screen.tsx'), 'utf8');

        expect(source).not.toContain('bottomContentPreset');
    });

    it('uses the shared chrome header clearance without a legacy top preset', () => {
        const source = readFileSync(join(__dirname, 'settings.screen.tsx'), 'utf8');

        expect(source).not.toContain('topContentPreset');
    });
});
