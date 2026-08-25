import { describe, expect, it } from '@jest/globals';

import { BWLightTheme } from '../../../../theme/themes/bw.theme';

import { fieldCellGetBackgroundColor } from './field-cell-get-background-color.util';

import type { FieldCellBackgroundColorParamsInterface } from '../interface/field-cell-background-color-params.interface';

const baseParams: FieldCellBackgroundColorParamsInterface = {
    isActiveValue: false,
    isCellHighlighted: false,
    isEmpty: false,
    isPatternCell: false,
    isTargetCell: false,
    isWrong: false,
    showAreas: true,
    showFilledNumbers: true,
    showIdenticalNumbers: true,
    theme: BWLightTheme
};

describe('fieldCellGetBackgroundColor', () => {
    it('should mark the hint target cell before every other state', () => {
        expect.assertions(1);

        expect(fieldCellGetBackgroundColor({ ...baseParams, isTargetCell: true, isPatternCell: true, isWrong: true })).toBe(
            BWLightTheme.colors.accent
        );
    });

    it('should mark a hint pattern cell before the ordinary board states', () => {
        expect.assertions(1);

        expect(fieldCellGetBackgroundColor({ ...baseParams, isPatternCell: true, isWrong: true })).toBe(
            BWLightTheme.colors.candidate.fillSelected
        );
    });

    it('should flag a wrong value before anything else', () => {
        expect.assertions(1);

        expect(fieldCellGetBackgroundColor({ ...baseParams, isWrong: true, isActiveValue: true })).toBe(BWLightTheme.colors.board.error);
    });

    it('should highlight an identical value when that setting is on', () => {
        expect.assertions(2);

        expect(fieldCellGetBackgroundColor({ ...baseParams, isActiveValue: true })).toBe(BWLightTheme.colors.board.sameValue);
        expect(fieldCellGetBackgroundColor({ ...baseParams, isActiveValue: true, showIdenticalNumbers: false })).not.toBe(
            BWLightTheme.colors.board.sameValue
        );
    });

    it('should highlight the row, column and box only when areas are shown', () => {
        expect.assertions(2);

        expect(fieldCellGetBackgroundColor({ ...baseParams, isCellHighlighted: true })).toBe(BWLightTheme.colors.surface.subtle);
        expect(fieldCellGetBackgroundColor({ ...baseParams, isCellHighlighted: true, showAreas: false })).not.toBe(
            BWLightTheme.colors.surface.subtle
        );
    });

    it('should leave an empty cell plain', () => {
        expect.assertions(1);

        expect(fieldCellGetBackgroundColor({ ...baseParams, isEmpty: true })).toBe(BWLightTheme.colors.surface.raised);
    });

    it('should tint a filled cell only when filled numbers are shown', () => {
        expect.assertions(2);

        expect(fieldCellGetBackgroundColor(baseParams)).toBe(BWLightTheme.colors.board.filled);
        expect(fieldCellGetBackgroundColor({ ...baseParams, showFilledNumbers: false })).toBe(BWLightTheme.colors.surface.raised);
    });
});
