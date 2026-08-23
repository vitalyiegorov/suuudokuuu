import { describe, expect, it } from '@jest/globals';
import { FieldEngine } from '@suuudokuuu/field-core';
import { DifficultyEnum } from '@suuudokuuu/generator';

import { gameGetFieldStatePayload } from './game-get-field-state-payload.util';

const puzzleString = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

describe('gameGetFieldStatePayload', () => {
    it('mirrors the serialized grid and notes of the engine', () => {
        expect.assertions(2);

        const engine = new FieldEngine({ sudokuString: puzzleString, difficulty: DifficultyEnum.Medium });
        const [firstRow] = engine.Sudoku.Field;
        const [, , noteCell] = firstRow;

        engine.toggleCandidate(noteCell, 4);

        const payload = gameGetFieldStatePayload(engine);

        expect(payload.sudokuString).toBe(engine.serialize().sudokuString);
        expect(payload.candidates).toStrictEqual({ '0-2': [4] });
    });
});
