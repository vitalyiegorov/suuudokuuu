import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('CollapsibleChromePage', () => {
    it('adds footer clearance only when a footer is rendered', () => {
        const source = readFileSync(join(__dirname, 'collapsible-chrome-page.tsx'), 'utf8');

        expect(source).toContain('const footerInset = isDefined(footer) ? CollapsibleChromePageFooterContentInset : 0');
    });

    it('reserves the tab bar height so tab screens can scroll past the bar', () => {
        const source = readFileSync(join(__dirname, 'collapsible-chrome-page.tsx'), 'utf8');

        expect(source).toContain('const tabBarInset = use(TabBarInsetContext)');
        expect(source).toContain('const contentInsetBottom = footerInset + tabBarInset');
    });

    it('keeps one shared header clearance for every collapsible screen', () => {
        const source = readFileSync(join(__dirname, 'collapsible-chrome-page.tsx'), 'utf8');

        expect(source).toContain('contentInsetTop={ScreenChromeContentInsetTop}');
    });
});
