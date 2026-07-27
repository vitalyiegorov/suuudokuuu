import { describe, expect, it } from '@jest/globals';

import { BWLightTheme } from '../../../../theme/themes/bw.theme';

import { fieldCellGetBackgroundColor } from './field-cell-get-background-color.util';

import type { FieldCellBackgroundColorParamsInterface } from '../interface/field-cell-background-color-params.interface';

const baseParams: FieldCellBackgroundColorParamsInterface = {
    isActiveValue: false,
    isCellHighlighted: false,
    isEmpty: false,
    isWrong: false,
    showAreas: true,
    showFilledNumbers: true,
    showIdenticalNumbers: true,
    theme: BWLightTheme
};

describe('fieldCellGetBackgroundColor', () => {
    it('should flag a wrong value before anything else', () => {
        expect.assertions(1);

        expect(fieldCellGetBackgroundColor({ ...baseParams, isWrong: true, isActiveValue: true })).toBe(BWLightTheme.colors.cell.error);
    });

    it('should highlight an identical value when that setting is on', () => {
        expect.assertions(2);

        expect(fieldCellGetBackgroundColor({ ...baseParams, isActiveValue: true })).toBe(BWLightTheme.colors.cell.activeValue);
        expect(fieldCellGetBackgroundColor({ ...baseParams, isActiveValue: true, showIdenticalNumbers: false })).not.toBe(
            BWLightTheme.colors.cell.activeValue
        );
    });

    it('should highlight the row, column and box only when areas are shown', () => {
        expect.assertions(2);

        expect(fieldCellGetBackgroundColor({ ...baseParams, isCellHighlighted: true })).toBe(BWLightTheme.colors.cell.highlighted);
        expect(fieldCellGetBackgroundColor({ ...baseParams, isCellHighlighted: true, showAreas: false })).not.toBe(
            BWLightTheme.colors.cell.highlighted
        );
    });

    it('should leave an empty cell plain', () => {
        expect.assertions(1);

        expect(fieldCellGetBackgroundColor({ ...baseParams, isEmpty: true })).toBe(BWLightTheme.colors.white);
    });

    it('should tint a filled cell only when filled numbers are shown', () => {
        expect.assertions(2);

        expect(fieldCellGetBackgroundColor(baseParams)).toBe(BWLightTheme.colors.cell.filled);
        expect(fieldCellGetBackgroundColor({ ...baseParams, showFilledNumbers: false })).toBe(BWLightTheme.colors.white);
    });
});
