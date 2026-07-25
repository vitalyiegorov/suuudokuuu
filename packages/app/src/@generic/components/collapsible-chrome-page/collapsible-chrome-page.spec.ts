import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('CollapsibleChromePage', () => {
    it('keeps native bounce behavior and one shared header clearance', () => {
        const source = readFileSync(join(__dirname, 'collapsible-chrome-page.tsx'), 'utf8');

        expect(source).toContain('alwaysBounceVertical = true');
        expect(source).toContain('bounces = true');
        expect(source).toContain('contentInsetTop={ScreenChromeContentInsetTop}');
        expect(source).not.toContain('topContentPreset');
        expect(source).not.toContain('bottomContentPreset');
    });

    it('adds footer clearance only when a footer is rendered', () => {
        const source = readFileSync(join(__dirname, 'collapsible-chrome-page.tsx'), 'utf8');

        expect(source).toContain('const contentInsetBottom = isDefined(footer) ? CollapsibleChromePageFooterContentInset : 0');
    });

    it('renders the small title above the full header row rather than inside the title slot', () => {
        const source = readFileSync(join(__dirname, 'collapsible-chrome-page.tsx'), 'utf8');
        const titleSlotEndIndex = source.indexOf('</CollapsibleHeaderTitleSlot>');
        const smallTitleIndex = source.indexOf('<CollapsibleHeaderSmallTitle>');

        expect(smallTitleIndex).toBeGreaterThan(titleSlotEndIndex);
    });

    it('balances the default back slot with an empty trailing slot', () => {
        const source = readFileSync(join(__dirname, 'collapsible-chrome-page.tsx'), 'utf8');

        const trailingContentIndex = source.indexOf('const trailingContent = isDefined(trailing)');
        const emptyTrailingSlotIndex = source.indexOf('<CollapsibleHeaderTrailing />');

        expect(emptyTrailingSlotIndex).toBeGreaterThan(trailingContentIndex);
        expect(source).toContain('{trailingContent}');
    });
});
