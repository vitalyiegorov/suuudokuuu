import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

import { classifyTimelineMove } from '../../challenge/utils/classify-timeline-move.util';

import { gameGetPreMoveSudoku } from './game-get-pre-move-sudoku.util';

import type { CellInterface } from '@suuudokuuu/generator';

const puzzle = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
const scriptedMoveCount = 12;

const findBlankCell = (sudoku: Sudoku): CellInterface => {
    const blankCell = sudoku.Field.flat().find(cell => sudoku.isBlankCell(cell));

    if (!isDefined(blankCell)) {
        throw new Error('Expected the fixture puzzle to contain a blank cell');
    }

    return blankCell;
};

describe('gameGetPreMoveSudoku', () => {
    it('rebuilds the exact board string that preceded a placement', () => {
        const sudoku = Sudoku.fromString(puzzle, { ...defaultSudokuConfig });
        const blankCell = findBlankCell(sudoku);
        const preMoveString = sudoku.toString();
        const correctCell = { ...blankCell, value: sudoku.getCorrectValue(blankCell) };

        sudoku.setCellValue(correctCell);

        expect(gameGetPreMoveSudoku(sudoku.toString(), correctCell).toString()).toBe(preMoveString);
    });

    it('classifies every scripted move exactly like the live pre-move board does', () => {
        const sudoku = Sudoku.fromString(puzzle, { ...defaultSudokuConfig });

        for (let moveIndex = 0; moveIndex < scriptedMoveCount; moveIndex += 1) {
            const blankCell = findBlankCell(sudoku);
            const correctCell = { ...blankCell, value: sudoku.getCorrectValue(blankCell) };
            const liveTechnique = classifyTimelineMove(sudoku, correctCell);

            sudoku.setCellValue(correctCell);

            const rebuiltTechnique = classifyTimelineMove(gameGetPreMoveSudoku(sudoku.toString(), correctCell), correctCell);

            expect(rebuiltTechnique).toBe(liveTechnique);
        }
    });
});
