import { describe, expect, it } from '@jest/globals';

import { BWLightTheme } from '../../../../theme/themes/bw.theme';
import { ColorblindSafeLightTheme } from '../../../../theme/themes/colorblind-safe.theme';

import { fieldCellGetOutlineStyle } from './field-cell-get-outline-style.util';

describe('fieldCellGetOutlineStyle', () => {
    it('outlines a wrong cell in ink when the theme carries the non-color cue', () => {
        expect(fieldCellGetOutlineStyle({ isWrong: true, theme: ColorblindSafeLightTheme })).toEqual({
            borderColor: ColorblindSafeLightTheme.colors.ink,
            borderWidth: 3
        });
    });

    it('leaves a correct cell untouched in the same theme', () => {
        expect(fieldCellGetOutlineStyle({ isWrong: false, theme: ColorblindSafeLightTheme })).toBeNull();
    });

    it('leaves a wrong cell untouched in a theme without the cue', () => {
        expect(fieldCellGetOutlineStyle({ isWrong: true, theme: BWLightTheme })).toBeNull();
    });
});
