import { describe, expect, it } from '@jest/globals';

import { DefaultUiTheme } from '../../../theme/constant/default-ui-theme.constant';

import { appMetricStripGetColors } from './app-metric-strip-get-colors.util';

describe('appMetricStripGetColors', () => {
    it('uses an inverted black surface for the primary variant', () => {
        const colors = appMetricStripGetColors(DefaultUiTheme, 'primary');

        expect(colors.backgroundColor).toBe(DefaultUiTheme.colors.black);
        expect(colors.textColor).toBe(DefaultUiTheme.colors.label.inverted);
    });

    it('uses the calm subtle surface for the secondary variant', () => {
        const colors = appMetricStripGetColors(DefaultUiTheme, 'secondary');

        expect(colors.backgroundColor).toBe(DefaultUiTheme.colors.surface.subtle);
        expect(colors.textColor).toBe(DefaultUiTheme.colors.surface.subtleText);
    });

    it('uses the page background for the ghost variant', () => {
        const colors = appMetricStripGetColors(DefaultUiTheme, 'ghost');

        expect(colors.backgroundColor).toBe(DefaultUiTheme.colors.background);
        expect(colors.textColor).toBe(DefaultUiTheme.colors.label.main);
    });

    it('never pairs a resolved surface with its own colour as text', () => {
        const variants = ['primary', 'secondary', 'ghost'] as const;

        variants.forEach(variant => {
            const colors = appMetricStripGetColors(DefaultUiTheme, variant);

            expect(colors.textColor).not.toBe(colors.backgroundColor);
        });
    });
});
