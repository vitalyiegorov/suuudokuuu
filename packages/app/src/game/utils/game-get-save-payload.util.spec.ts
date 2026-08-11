import { describe, expect, it } from '@jest/globals';
import { FieldEngine } from '@suuudokuuu/field-core';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

import { classifyTimelineMove } from '../../challenge/utils/classify-timeline-move.util';

import { gameGetSavePayload } from './game-get-save-payload.util';

import type { CellInterface } from '@suuudokuuu/generator';

const puzzle = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
const scriptedMoveCount = 10;

const findBlankCell = (sudoku: Sudoku): CellInterface => {
    const blankCell = sudoku.Field.flat().find(cell => sudoku.isBlankCell(cell));

    if (!isDefined(blankCell)) {
        throw new Error('Expected the fixture puzzle to contain a blank cell');
    }

    return blankCell;
};

describe('gameGetSavePayload', () => {
    it('reproduces the legacy inline save payload for every move of a scripted engine sequence', () => {
        const engine = new FieldEngine({ sudokuString: puzzle, difficulty: DifficultyEnum.Medium });
        const legacySudoku = Sudoku.fromString(puzzle, { ...defaultSudokuConfig });

        for (let moveIndex = 0; moveIndex < scriptedMoveCount; moveIndex += 1) {
            const blankCell = findBlankCell(legacySudoku);
            const legacyCell = { ...blankCell, value: legacySudoku.getCorrectValue(blankCell) };
            const legacyTechnique = classifyTimelineMove(legacySudoku, legacyCell);
            const legacyScoredCells = legacySudoku.setCellValue(legacyCell);

            engine.selectCell(findBlankCell(engine.Sudoku));

            const move = engine.inputValue(legacyCell.value);

            if (!isDefined(move)) {
                throw new Error('Expected the engine to apply the scripted placement');
            }

            const payload = gameGetSavePayload(engine.Sudoku, move);

            expect(payload.correctCell).toStrictEqual(legacyCell);
            expect(payload.scoredCells).toStrictEqual(legacyScoredCells);
            expect(payload.technique).toBe(legacyTechnique);
            expect(payload.sudoku.toString()).toBe(legacySudoku.toString());
        }
    });
});
