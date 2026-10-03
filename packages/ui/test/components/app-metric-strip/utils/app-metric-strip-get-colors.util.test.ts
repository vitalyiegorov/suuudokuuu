import { describe, expect, it } from 'vitest';

import { appMetricStripGetColors } from '../../../../src/components/app-metric-strip/utils/app-metric-strip-get-colors.util';
import { DefaultUiTheme } from '../../../../src/theme/constant/default-ui-theme.constant';


describe('appMetricStripGetColors', () => {
    it('uses an inverted black surface for the primary variant', () => {
        const colors = appMetricStripGetColors(DefaultUiTheme, 'primary');

        expect(colors.backgroundColor).toBe(DefaultUiTheme.colors.ink);
        expect(colors.textColor).toBe(DefaultUiTheme.colors.inkText);
    });

    it('uses the calm subtle surface for the secondary variant', () => {
        const colors = appMetricStripGetColors(DefaultUiTheme, 'secondary');

        expect(colors.backgroundColor).toBe(DefaultUiTheme.colors.surface.subtle);
        expect(colors.textColor).toBe(DefaultUiTheme.colors.surface.subtleText);
    });

    it('uses the page background for the ghost variant', () => {
        const colors = appMetricStripGetColors(DefaultUiTheme, 'ghost');

        expect(colors.backgroundColor).toBe(DefaultUiTheme.colors.background);
        expect(colors.textColor).toBe(DefaultUiTheme.colors.text.primary);
    });

    it('never pairs a resolved surface with its own colour as text', () => {
        const variants = ['primary', 'secondary', 'ghost'] as const;

        variants.forEach(variant => {
            const colors = appMetricStripGetColors(DefaultUiTheme, variant);

            expect(colors.textColor).not.toBe(colors.backgroundColor);
        });
    });
});
