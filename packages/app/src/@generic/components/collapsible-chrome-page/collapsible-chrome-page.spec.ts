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

        expect(source).toContain('const footerInset = isDefined(footer) ? CollapsibleChromePageFooterContentInset : 0');
    });

    it('reserves the tab bar height so tab screens can scroll past the bar', () => {
        const source = readFileSync(join(__dirname, 'collapsible-chrome-page.tsx'), 'utf8');

        expect(source).toContain('const tabBarInset = use(TabBarInsetContext)');
        expect(source).toContain('const contentInsetBottom = footerInset + tabBarInset');
    });

    it('renders both title layers inside the title slot, large before small, as the primitive expects', () => {
        const source = readFileSync(join(__dirname, 'collapsible-chrome-page.tsx'), 'utf8');
        const titleSlotStartIndex = source.indexOf('<CollapsibleHeaderTitleSlot>');
        const titleSlotEndIndex = source.indexOf('</CollapsibleHeaderTitleSlot>');
        const largeTitleIndex = source.indexOf('styles.largeTitle');
        const smallTitleIndex = source.indexOf('styles.smallTitle');

        expect(largeTitleIndex).toBeGreaterThan(titleSlotStartIndex);
        expect(smallTitleIndex).toBeGreaterThan(largeTitleIndex);
        expect(smallTitleIndex).toBeLessThan(titleSlotEndIndex);
    });

    it('always renders the balanced three-slot header so the primitive gets leading, title, and trailing', () => {
        const source = readFileSync(join(__dirname, 'collapsible-chrome-page.tsx'), 'utf8');

        expect(source.match(/<CollapsibleHeaderSlot>/gu)).toHaveLength(2);
        expect(source).toContain('<CollapsibleHeaderSlot>{leadingContent}</CollapsibleHeaderSlot>');
        expect(source).toContain('<CollapsibleHeaderSlot>{trailing}</CollapsibleHeaderSlot>');
    });
});
