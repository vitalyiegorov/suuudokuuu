import { describe, expect, it } from '@jest/globals';

import { getVisibleMistakeCell } from './get-visible-mistake-cell.util';

const mistakeCell = { x: 4, y: 2, value: 6, group: 1 };
const mistakeRecord = { cell: mistakeCell, mistakes: 2, sudokuString: 'board-a' };

describe('getVisibleMistakeCell', () => {
    it('returns null without a record', () => {
        expect(getVisibleMistakeCell(null, { mistakes: 2, sudokuString: 'board-a' })).toBeNull();
    });

    it('returns the cell while the snapshot still matches the record', () => {
        expect(getVisibleMistakeCell(mistakeRecord, { mistakes: 2, sudokuString: 'board-a' })).toBe(mistakeCell);
    });

    it('hides the cell after another mistake', () => {
        expect(getVisibleMistakeCell(mistakeRecord, { mistakes: 3, sudokuString: 'board-a' })).toBeNull();
    });

    it('hides the cell after the board changed', () => {
        expect(getVisibleMistakeCell(mistakeRecord, { mistakes: 2, sudokuString: 'board-b' })).toBeNull();
    });
});
