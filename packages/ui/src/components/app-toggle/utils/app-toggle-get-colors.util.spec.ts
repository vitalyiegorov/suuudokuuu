import { describe, expect, it } from '@jest/globals';

import { DefaultUiTheme } from '../../../theme/constant/default-ui-theme.constant';

import { appToggleGetColors } from './app-toggle-get-colors.util';

describe('appToggleGetColors', () => {
    it('fills the track with the active accent and its paired foreground when checked', () => {
        const colors = appToggleGetColors(DefaultUiTheme, true);

        expect(colors.trackColor).toBe(DefaultUiTheme.colors.numpad.trackFilled);
        expect(colors.knobColor).toBe(DefaultUiTheme.colors.numpad.trackFilledText);
    });

    it('empties the track and outlines it with a hairline border when unchecked', () => {
        const colors = appToggleGetColors(DefaultUiTheme, false);

        expect(colors.trackColor).toBe('transparent');
        expect(colors.trackBorderColor).toBe(DefaultUiTheme.colors.surface.subtleHint);
        expect(colors.knobColor).toBe(DefaultUiTheme.colors.surface.subtleHint);
    });

    it('never resolves the same colour for the knob and its own track', () => {
        [true, false].forEach(checked => {
            const colors = appToggleGetColors(DefaultUiTheme, checked);

            expect(colors.knobColor).not.toBe(colors.trackColor);
        });
    });

    it('resolves a different track colour for the checked and unchecked states', () => {
        const checkedColors = appToggleGetColors(DefaultUiTheme, true);
        const uncheckedColors = appToggleGetColors(DefaultUiTheme, false);

        expect(checkedColors.trackColor).not.toBe(uncheckedColors.trackColor);
    });
});
