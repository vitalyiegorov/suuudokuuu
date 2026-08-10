import { describe, expect, it } from '@jest/globals';

import { BWLightTheme } from '../../theme/themes/bw.theme';

import { getIridescentColorStops } from './get-iridescent-color-stops.util';

describe('getIridescentColorStops', () => {
    it('returns a closed loop that starts and ends on the accent token', () => {
        const stops = getIridescentColorStops(BWLightTheme);

        expect(stops[0]).toBe(BWLightTheme.colors.accent);
        expect(stops.at(-1)).toBe(BWLightTheme.colors.accent);
    });

    it('routes through the primary text and danger tokens between the accent stops', () => {
        const stops = getIridescentColorStops(BWLightTheme);

        expect(stops[1]).toBe(BWLightTheme.colors.text.primary);
        expect(stops[2]).toBe(BWLightTheme.colors.danger);
    });
});
