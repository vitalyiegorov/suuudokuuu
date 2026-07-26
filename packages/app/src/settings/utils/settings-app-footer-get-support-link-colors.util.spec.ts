import { describe, expect, it } from '@jest/globals';

import { BWDarkTheme, BWLightTheme } from '../../theme/themes/bw.theme';
import { ColorfulDarkTheme, ColorfulLightTheme } from '../../theme/themes/colorful.theme';
import { NewspaperDarkTheme, NewspaperLightTheme } from '../../theme/themes/newspaper';

import { settingsAppFooterGetSupportLinkColors } from './settings-app-footer-get-support-link-colors.util';

const allThemes = [BWLightTheme, BWDarkTheme, ColorfulLightTheme, ColorfulDarkTheme, NewspaperLightTheme, NewspaperDarkTheme];

describe('settingsAppFooterGetSupportLinkColors', () => {
    it('pairs the raised surface with its own on-surface text colour in every theme', () => {
        allThemes.forEach(theme => {
            const colors = settingsAppFooterGetSupportLinkColors(theme);

            expect(colors.backgroundColor).toBe(theme.colors.surface.raised);
            expect(colors.textColor).toBe(theme.colors.surface.raisedText);
        });
    });

    it('never paints the support link text in the same colour as its background', () => {
        allThemes.forEach(theme => {
            const colors = settingsAppFooterGetSupportLinkColors(theme);

            expect(colors.textColor).not.toBe(colors.backgroundColor);
        });
    });
});
