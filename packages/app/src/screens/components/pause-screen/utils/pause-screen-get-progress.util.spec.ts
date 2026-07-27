/* eslint-disable @typescript-eslint/no-magic-numbers */
import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { pauseScreenGetProgress } from './pause-screen-get-progress.util';

const givens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

describe('pauseScreenGetProgress', () => {
    it('should count the filled cells of a fresh puzzle', () => {
        expect.assertions(3);

        const progress = pauseScreenGetProgress(Sudoku.fromString(givens, defaultSudokuConfig));

        expect(progress.totalCells).toBe(81);
        expect(progress.filledCells).toBe(30);
        expect(progress.percent).toBe(37);
    });

    it('should report a full board as complete', () => {
        expect.assertions(2);

        const solved = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
        const progress = pauseScreenGetProgress(Sudoku.fromString(solved, defaultSudokuConfig));

        expect(progress.filledCells).toBe(81);
        expect(progress.percent).toBe(100);
    });

    it('should report no progress for a board without cells', () => {
        expect.assertions(2);

        const progress = pauseScreenGetProgress(new Sudoku(defaultSudokuConfig));

        expect(progress.totalCells).toBe(0);
        expect(progress.percent).toBe(0);
    });
});
