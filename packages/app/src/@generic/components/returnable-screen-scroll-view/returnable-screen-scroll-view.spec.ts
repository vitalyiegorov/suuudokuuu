import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('ReturnableScreenScrollView', () => {
    it('uses native bounce behavior by default so returnable pages stay fluid', () => {
        const source = readFileSync(join(__dirname, 'returnable-screen-scroll-view.tsx'), 'utf8');

        expect(source).toContain('alwaysBounceVertical = true');
        expect(source).toContain('bounces = true');
    });

    it('supports compact top spacing for dense returnable screens', () => {
        const source = readFileSync(join(__dirname, 'returnable-screen-scroll-view.tsx'), 'utf8');

        expect(source).toContain('topContentPreset = ReturnableScreenChromeRegularContentPreset');
        expect(source).toContain('ReturnableScreenChromeTopContentInsetByPreset[topContentPreset]');
    });

    it('supports bottom spacing presets without changing the full-glass default', () => {
        const source = readFileSync(join(__dirname, 'returnable-screen-scroll-view.tsx'), 'utf8');

        expect(source).toContain('bottomContentPreset = ReturnableScreenChromeFullBottomContentPreset');
        expect(source).toContain('ReturnableScreenChromeBottomContentInsetByPreset[bottomContentPreset]');
    });
});
