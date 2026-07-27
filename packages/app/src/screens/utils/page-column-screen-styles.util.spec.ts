import { describe, expect, it } from '@jest/globals';

import { UnistylesThemesConstant } from '../../theme/constant/unistyles-themes.constant';

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
