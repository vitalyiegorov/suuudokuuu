import { describe, expect, it } from '@jest/globals';

import { DefaultUiTheme } from '../../../theme/constant/default-ui-theme.constant';

import { appButtonGetColors } from './app-button-get-colors.util';

describe('appButtonGetColors', () => {
    it('keeps action colors separate from progress colors', () => {
        const primaryColors = appButtonGetColors(DefaultUiTheme, 'primary');
        const donationColors = appButtonGetColors(DefaultUiTheme, 'donation');

        expect(primaryColors.backgroundColor).toBe(DefaultUiTheme.colors.ink);
        expect(donationColors.backgroundColor).toBe(DefaultUiTheme.colors.surface.raised);
        expect(primaryColors.backgroundColor).not.toBe(DefaultUiTheme.colors.numpad.trackFilled);
        expect(donationColors.backgroundColor).not.toBe(DefaultUiTheme.colors.numpad.trackFilled);
    });

    it('uses calm themed surfaces for secondary actions', () => {
        const secondaryColors = appButtonGetColors(DefaultUiTheme, 'secondary');

        expect(secondaryColors.backgroundColor).toBe(DefaultUiTheme.colors.surface.subtle);
        expect(secondaryColors.borderColor).toBe(DefaultUiTheme.colors.surface.border);
        expect(secondaryColors.textColor).toBe(DefaultUiTheme.colors.surface.subtleText);
    });

    it('uses destructive text without filling danger actions', () => {
        const dangerColors = appButtonGetColors(DefaultUiTheme, 'danger');

        expect(dangerColors.backgroundColor).toBe(DefaultUiTheme.colors.background);
        expect(dangerColors.borderColor).toBe(DefaultUiTheme.colors.surface.border);
        expect(dangerColors.textColor).toBe(DefaultUiTheme.colors.danger);
    });

    it('keeps inverted actions on readable light surfaces', () => {
        const invertedColors = appButtonGetColors(DefaultUiTheme, 'inverted');

        expect(invertedColors.backgroundColor).toBe(DefaultUiTheme.colors.surface.raised);
        expect(invertedColors.borderColor).toBe(DefaultUiTheme.colors.surface.border);
        expect(invertedColors.textColor).toBe(DefaultUiTheme.colors.surface.raisedText);
    });

    it('keeps glass actions fully transparent for native glass surfaces', () => {
        const glassColors = appButtonGetColors(DefaultUiTheme, 'glass');

        expect(glassColors.backgroundColor).toBe('transparent');
        expect(glassColors.borderColor).toBe('transparent');
        expect(glassColors.textColor).toBe(DefaultUiTheme.colors.inkText);
    });

    it('uses transparent page colors for ghost actions', () => {
        const ghostColors = appButtonGetColors(DefaultUiTheme, 'ghost');

        expect(ghostColors.backgroundColor).toBe(DefaultUiTheme.colors.background);
        expect(ghostColors.borderColor).toBe(DefaultUiTheme.colors.surface.border);
        expect(ghostColors.textColor).toBe(DefaultUiTheme.colors.text.primary);
    });
});
