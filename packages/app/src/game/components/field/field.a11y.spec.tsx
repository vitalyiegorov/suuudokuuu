import { describe, expect, it } from '@jest/globals';
import { FieldEngine } from '@suuudokuuu/field-core';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { screen } from '@testing-library/react-native';

import { emptyFn } from '@rnw-community/shared';

import { renderWithGameContext } from '../../../@generic/utils/render-with-game-context.mock';

import { Field } from './field';

const puzzleString = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const BoardCellCount = 81;

const buildEngine = (): FieldEngine => new FieldEngine({ sudokuString: puzzleString, difficulty: DifficultyEnum.Medium });

const renderField = async (engine: FieldEngine) =>
    renderWithGameContext(<Field cellMargin={2} cellSize={40} onSelect={emptyFn} ref={null} />, { engine });

describe('Field accessibility', () => {
    it('should expose every board cell as a labelled accessibility element', async () => {
        expect.assertions(1);

        await renderField(buildEngine());

        expect(screen.getAllByRole('button')).toHaveLength(BoardCellCount);
    });

    it('should name a given cell by its position and value', async () => {
        expect.assertions(1);

        await renderField(buildEngine());

        expect(screen.getByLabelText('Row 1, column 1, 5')).toBeOnTheScreen();
    });

    it('should name a blank cell as empty', async () => {
        expect.assertions(1);

        await renderField(buildEngine());

        expect(screen.getByLabelText('Row 1, column 3, empty')).toBeOnTheScreen();
    });

    it('should list the notes a blank cell displays', async () => {
        expect.assertions(1);

        const engine = buildEngine();
        const [firstRow] = engine.Sudoku.Field;
        const [, , blankCell] = firstRow;

        engine.selectCell(blankCell);
        engine.toggleCandidate(blankCell, 4);
        engine.toggleCandidate(blankCell, 8);

        await renderField(engine);

        expect(screen.getByLabelText('Row 1, column 3, empty, notes 4, 8')).toBeOnTheScreen();
    });

    it('should mark only the selected cell as selected', async () => {
        expect.assertions(2);

        const engine = buildEngine();
        const [firstRow] = engine.Sudoku.Field;

        engine.selectCell(firstRow[2]);

        await renderField(engine);

        expect(screen.getByLabelText('Row 1, column 3, empty')).toBeSelected();
        expect(screen.getByLabelText('Row 1, column 1, 5')).not.toBeSelected();
    });

    it('should name the board itself', async () => {
        expect.assertions(1);

        await renderField(buildEngine());

        expect(screen.getByLabelText('Sudoku board, 9 by 9 cells')).toBeOnTheScreen();
    });
});
