import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('SettingsScreen', () => {
    it('uses compact returnable bottom spacing so the footer does not float above dead space', () => {
        const source = readFileSync(join(__dirname, 'settings.screen.tsx'), 'utf8');

        expect(source).toContain('bottomContentPreset={ReturnableScreenChromeCompactBottomContentPreset}');
    });

    it('uses regular returnable top spacing so settings rows clear the header title', () => {
        const source = readFileSync(join(__dirname, 'settings.screen.tsx'), 'utf8');

        expect(source).not.toContain('topContentPreset={ReturnableScreenChromeCompactContentPreset}');
    });
});
