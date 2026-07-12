import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('ScreenChrome', () => {
    it('renders content before blur overlays so native blur can sample it', () => {
        const source = readFileSync(join(__dirname, 'screen-chrome.tsx'), 'utf8');

        const contentIndex = source.indexOf('<View style={contentStyles}>{children}</View>');
        const topOverlayIndex = source.indexOf('{topOverlay}');
        const bottomOverlayIndex = source.indexOf('{bottomOverlay}');
        const headerIndex = source.indexOf('{headerNode}');

        expect(contentIndex).toBeLessThan(topOverlayIndex);
        expect(contentIndex).toBeLessThan(bottomOverlayIndex);
        expect(topOverlayIndex).toBeLessThan(headerIndex);
        expect(bottomOverlayIndex).toBeLessThan(headerIndex);
    });
});
