import { describe, expect, it } from '@jest/globals';

import { BWDarkTheme, BWLightTheme } from '../../theme/themes/bw.theme';

import { settingsAppFooterGetSupportLinkColors } from './settings-app-footer-get-support-link-colors.util';

describe('settingsAppFooterGetSupportLinkColors', () => {
    it('uses inverted foreground colors so the support link stays visible in light and dark themes', () => {
        expect(settingsAppFooterGetSupportLinkColors(BWLightTheme)).toEqual({
            backgroundColor: BWLightTheme.colors.black,
            borderColor: BWLightTheme.colors.black,
            textColor: BWLightTheme.colors.label.inverted
        });
        expect(settingsAppFooterGetSupportLinkColors(BWDarkTheme)).toEqual({
            backgroundColor: BWDarkTheme.colors.black,
            borderColor: BWDarkTheme.colors.black,
            textColor: BWDarkTheme.colors.label.inverted
        });
    });
});
