import { describe, expect, it } from '@jest/globals';

import { ColorSchemaEnum } from '../enum/color-schema.enum';
import { ThemeEnum } from '../enum/theme.enum';

import { getUnistylesThemeName } from './get-unistyles-theme-name.util';

describe('getUnistylesThemeName', () => {
    it('maps black-and-white light to bwLight', () => {
        expect(getUnistylesThemeName(ThemeEnum.BlackAndWhite, ColorSchemaEnum.Light)).toBe('bwLight');
    });

    it('maps colorful dark to colorfulDark', () => {
        expect(getUnistylesThemeName(ThemeEnum.Colorful, ColorSchemaEnum.Dark)).toBe('colorfulDark');
    });

    it('maps newspaper light to newspaperLight', () => {
        expect(getUnistylesThemeName(ThemeEnum.Newspaper, ColorSchemaEnum.Light)).toBe('newspaperLight');
    });
});
