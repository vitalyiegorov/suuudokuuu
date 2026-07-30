import { describe, expect, it } from '@jest/globals';

import { Breakpoints } from '../../theme/constant/breakpoints.constant';

import { appLayoutScreenIsWide } from './app-layout-screen-is-wide.util';

const DesktopViewportWidth = 1800;
const DesktopViewportHeight = 1200;
const IPadProLandscapeWidth = 1366;

describe('appLayoutScreenIsWide', () => {
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
    });
});
