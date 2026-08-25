import { describe, expect, it } from '@jest/globals';
import { i18n } from '@lingui/core';

import { gameGetCellAccessibilityLabel } from './game-get-cell-accessibility-label.util';

import type { GameCellAccessibilityLabelParamsInterface } from '../interface/game-cell-accessibility-label-params.interface';

const label = (params: GameCellAccessibilityLabelParamsInterface): string => i18n._(gameGetCellAccessibilityLabel(params));

const blankCell = { x: 4, y: 2, value: 0, group: 1 };
const filledCell = { x: 4, y: 2, value: 7, group: 1 };

describe('gameGetCellAccessibilityLabel', () => {
    it('should place the cell with one-based row and column coordinates', () => {
        expect.assertions(2);

        const cellLabel = label({ candidates: [], cell: filledCell, isEmpty: false, isWrong: false });

        expect(cellLabel).toContain('Row 3');
        expect(cellLabel).toContain('column 5');
    });

    it('should read the placed value of a filled cell', () => {
        expect.assertions(1);

        expect(label({ candidates: [], cell: filledCell, isEmpty: false, isWrong: false })).toBe('Row 3, column 5, 7');
    });

    it('should call an empty cell empty', () => {
        expect.assertions(1);

        expect(label({ candidates: [], cell: blankCell, isEmpty: true, isWrong: false })).toBe('Row 3, column 5, empty');
    });

    it('should list the notes of an empty cell that shows candidates', () => {
        expect.assertions(1);

        expect(label({ candidates: [2, 5, 9], cell: blankCell, isEmpty: true, isWrong: false })).toBe(
            'Row 3, column 5, empty, notes 2, 5, 9'
        );
    });

    it('should announce a wrong value ahead of every other state', () => {
        expect.assertions(1);

        expect(label({ candidates: [2, 5], cell: filledCell, isEmpty: false, isWrong: true })).toBe('Row 3, column 5, 7, wrong');
    });

    it('should produce a distinct label for every cell of a row', () => {
        expect.assertions(1);

        const rowLabels = new Set(
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(x => label({ candidates: [], cell: { ...blankCell, x }, isEmpty: true, isWrong: false }))
        );

        expect(rowLabels.size).toBe(9);
    });
});
