import { describe, expect, it } from '@jest/globals';

import { Breakpoints } from '../../theme/constant/breakpoints.constant';

import { appLayoutGetSizeClass } from './app-layout-get-size-class.util';

describe('appLayoutGetSizeClass', () => {
    it('returns wide when width meets the breakpoint and aspect ratio is landscape', () => {
        expect(appLayoutGetSizeClass(Breakpoints.lg, Breakpoints.md, Breakpoints.md)).toBe('wide');
    });

    it('returns compact when width is below the breakpoint even in landscape', () => {
        expect(appLayoutGetSizeClass(700, 400, Breakpoints.md)).toBe('compact');
    });

    it('returns compact when width meets the breakpoint but the aspect ratio is portrait', () => {
        expect(appLayoutGetSizeClass(800, 1200, Breakpoints.md)).toBe('compact');
    });

    it('returns compact for a square viewport at the breakpoint width', () => {
        expect(appLayoutGetSizeClass(Breakpoints.md, Breakpoints.md, Breakpoints.md)).toBe('compact');
    });

    it('returns wide at the inclusive width boundary when aspect ratio is landscape', () => {
        expect(appLayoutGetSizeClass(Breakpoints.md, Breakpoints.md / 2, Breakpoints.md)).toBe('wide');
    });
});
