import { describe, expect, it } from '@jest/globals';

import { BWLightTheme } from '../../theme/themes/bw.theme';

import { getIridescentColorStops } from './get-iridescent-color-stops.util';

describe('getIridescentColorStops', () => {
    it('returns a closed loop that starts and ends on the accent token', () => {
        const stops = getIridescentColorStops(BWLightTheme);

        expect(stops[0]).toBe(BWLightTheme.colors.accent);
        expect(stops.at(-1)).toBe(BWLightTheme.colors.accent);
    });

    it('routes through cool surface and selection tokens between the accent stops, never the danger token', () => {
        const stops = getIridescentColorStops(BWLightTheme);

        expect(stops[1]).toBe(BWLightTheme.colors.surface.raisedText);
        expect(stops[2]).toBe(BWLightTheme.colors.board.selected);
        expect(stops).not.toContain(BWLightTheme.colors.danger);
    });
});
