import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import {
    getAutoCellCandidates,
    getCandidatesWithElimination,
    getCandidatesWithoutValue,
    getToggledCandidates
} from './candidate-mutation.util';

const board = ['.3.678912', '672195348', '198342567', '859761423', '426853791', '713924856', '961537284', '287419635', '345286179'];

const boardString = board.join('');

describe('getToggledCandidates', () => {
    it('appends a value that is not present yet', () => {
        expect(getToggledCandidates({}, { x: 0, y: 0, value: 0, group: 0 }, 5)).toEqual({ '0-0': [5] });
    });

    it('removes a value that is already present', () => {
        const candidates = getToggledCandidates({ '0-0': [5, 3] }, { x: 0, y: 0, value: 0, group: 0 }, 5);

        expect(candidates).toEqual({ '0-0': [3] });
    });
});

describe('getCandidatesWithoutValue', () => {
    it('returns null when the cell has no matching note', () => {
        expect(getCandidatesWithoutValue({}, { x: 0, y: 0, value: 0, group: 0 }, 5)).toBeNull();
    });

    it('removes the value when it is present', () => {
        const candidates = getCandidatesWithoutValue({ '0-0': [5, 3] }, { x: 0, y: 0, value: 0, group: 0 }, 5);

        expect(candidates).toEqual({ '0-0': [3] });
    });
});

describe('getCandidatesWithElimination', () => {
    it('records a new elimination', () => {
        const eliminatedCandidates = getCandidatesWithElimination({}, { x: 0, y: 0, value: 0, group: 0 }, 5);

        expect(eliminatedCandidates).toEqual({ '0-0': [5] });
    });

    it('returns null when the value is already eliminated', () => {
        expect(getCandidatesWithElimination({ '0-0': [5] }, { x: 0, y: 0, value: 0, group: 0 }, 5)).toBeNull();
    });
});

describe('getAutoCellCandidates', () => {
    it('subtracts eliminated candidates from the computed set', () => {
        const sudoku = Sudoku.fromString(boardString, { ...defaultSudokuConfig });
        const [[cell]] = sudoku.Field;

        expect(getAutoCellCandidates(sudoku, {}, cell)).toEqual([5]);
        expect(getAutoCellCandidates(sudoku, { '0-0': [5] }, cell)).toEqual([]);
    });
});
