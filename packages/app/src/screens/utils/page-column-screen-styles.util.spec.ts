import { describe, expect, it } from '@jest/globals';

import { UnistylesThemesConstant } from '../../theme/constant/unistyles-themes.constant';
import { BetaScreenStyles } from '../components/beta-screen/beta-screen.styles';
import { ThemeEditorScreenStyles } from '../components/theme-editor-screen/theme-editor-screen.styles';
import { ThemesScreenStyles } from '../components/themes-screen/themes-screen.styles';

import { historyContentScreenStyles } from './history-content-screen-styles.util';
import { pageColumnScrollViewStyle } from './page-column-screen-styles.util';

const theme = UnistylesThemesConstant.bwLight;

describe('pageColumnScrollViewStyle', () => {
    it('should cap a page column at the standard content width', () => {
        expect.assertions(2);

        const style = pageColumnScrollViewStyle(theme);

        expect(style.maxWidth).toBe(theme.contentWidth.standard);
        expect(style.width).toBe('100%');
    });
});

describe('historyContentScreenStyles', () => {
    it('should share the page column scroll view style', () => {
        expect.assertions(2);

        const styles = historyContentScreenStyles(theme);

        expect(styles.scrollView).toStrictEqual(pageColumnScrollViewStyle(theme));
        expect(styles.content.alignItems).toBe('center');
    });
});

describe('ThemesScreenStyles', () => {
    it('should cap the themes page column at the standard content width', () => {
        expect.assertions(2);

        expect(ThemesScreenStyles.scrollView.maxWidth).toBe(theme.contentWidth.standard);
        expect(ThemesScreenStyles.content.alignItems).toBe('center');
    });
});

describe('ThemeEditorScreenStyles', () => {
    it('should cap the theme editor page column at the standard content width', () => {
        expect.assertions(2);

        expect(ThemeEditorScreenStyles.scrollView.maxWidth).toBe(theme.contentWidth.standard);
        expect(ThemeEditorScreenStyles.content.alignItems).toBe('center');
    });
});

describe('BetaScreenStyles', () => {
    it('should cap the beta page column at the standard content width', () => {
        expect.assertions(2);

        expect(BetaScreenStyles.scrollView.maxWidth).toBe(theme.contentWidth.standard);
        expect(BetaScreenStyles.content.alignItems).toBe('center');
    });
});
