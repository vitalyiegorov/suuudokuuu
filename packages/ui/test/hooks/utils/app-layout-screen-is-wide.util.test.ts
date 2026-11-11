import { describe, expect, it } from 'vitest';

import { appLayoutScreenIsWide } from '../../../src/hooks/utils/app-layout-screen-is-wide.util';
import { Breakpoints } from '../../../src/theme/constant/breakpoints.constant';

const DesktopViewportWidth = 1800;
const DesktopViewportHeight = 1200;
const IPadProLandscapeWidth = 1366;

describe('appLayoutScreenIsWide', () => {
    it('returns true when width meets the breakpoint and aspect ratio is landscape', () => {
        expect(appLayoutScreenIsWide({ width: Breakpoints.lg, height: Breakpoints.md })).toBe(true);
    });

    it('returns true at the inclusive width boundary when aspect ratio is landscape', () => {
        expect(appLayoutScreenIsWide({ width: Breakpoints.md, height: Breakpoints.md / 2 })).toBe(true);
    });

    it('returns true for a large desktop viewport taller than a portrait tablet', () => {
        expect(appLayoutScreenIsWide({ width: DesktopViewportWidth, height: DesktopViewportHeight })).toBe(true);
    });

    it('returns true for iPad Pro landscape', () => {
        expect(appLayoutScreenIsWide({ width: IPadProLandscapeWidth, height: Breakpoints.lg })).toBe(true);
    });

    it('returns false for a portrait iPad', () => {
        expect(appLayoutScreenIsWide({ width: Breakpoints.md, height: Breakpoints.lg })).toBe(false);
    });

    it('returns false when width is below the breakpoint even in landscape', () => {
        expect(appLayoutScreenIsWide({ width: Breakpoints.sm, height: Breakpoints.xs })).toBe(false);
        expect(appLayoutScreenIsWide({ width: 700, height: 400 })).toBe(false);
    });

    it('returns false when width meets the breakpoint but the aspect ratio is portrait', () => {
        expect(appLayoutScreenIsWide({ width: 800, height: 1200 })).toBe(false);
    });

    it('returns false for a square viewport at the breakpoint width', () => {
        expect(appLayoutScreenIsWide({ width: Breakpoints.md, height: Breakpoints.md })).toBe(false);
    });
});
