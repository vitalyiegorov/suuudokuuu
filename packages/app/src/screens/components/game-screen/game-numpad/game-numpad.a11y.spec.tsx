import { describe, expect, it } from '@jest/globals';
import { FieldEngine } from '@suuudokuuu/field-core';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { screen } from '@testing-library/react-native';

import { emptyFn } from '@rnw-community/shared';

import { renderWithGameContext } from '../../../../@generic/utils/render-with-game-context.mock';

import { GameNumpad } from './game-numpad';

const puzzleString = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const buildEngine = (): FieldEngine => new FieldEngine({ sudokuString: puzzleString, difficulty: DifficultyEnum.Medium });

const handleAvailableValuesRef = () => emptyFn;

const renderNumpad = async (engine: FieldEngine) =>
    renderWithGameContext(
        <GameNumpad
            availableValuesRefsHandler={handleAvailableValuesRef}
            onSelectValue={emptyFn}
            selectedCell={engine.getSnapshot().selectedCell}
        />,
        { engine }
    );

describe('GameNumpad accessibility', () => {
    it('should label a digit with the action and how many are left to place', async () => {
        expect.assertions(1);

        const engine = buildEngine();
        const remainingFives = 9 - engine.Sudoku.Field.flat().filter(cell => cell.value === 5).length;

        await renderNumpad(engine);

        expect(screen.getByLabelText(`Enter 5, ${remainingFives} left to place`)).toBeOnTheScreen();
    });

    it('should mark a digit disabled while no blank cell is selected', async () => {
        expect.assertions(1);

        await renderNumpad(buildEngine());

        expect(screen.getByLabelText(/^Enter 5,/u)).toBeDisabled();
    });

    it('should enable a digit once a blank cell is selected', async () => {
        expect.assertions(1);

        const engine = buildEngine();
        const [firstRow] = engine.Sudoku.Field;

        engine.selectCell(firstRow[2]);

        await renderNumpad(engine);

        expect(screen.getByLabelText(/^Enter 5,/u)).toBeEnabled();
    });

    it('should label a note digit and report whether the note is on', async () => {
        expect.assertions(2);

        const engine = buildEngine();
        const [firstRow] = engine.Sudoku.Field;
        const [, , blankCell] = firstRow;

        engine.toggleInputMode();
        engine.selectCell(blankCell);
        engine.toggleCandidate(blankCell, 4);

        await renderNumpad(engine);

        expect(screen.getByLabelText(/^Note 4,/u)).toHaveProp('accessibilityState', expect.objectContaining({ checked: true }));
        expect(screen.getByLabelText(/^Note 6,/u)).toHaveProp('accessibilityState', expect.objectContaining({ checked: false }));
    });
});
