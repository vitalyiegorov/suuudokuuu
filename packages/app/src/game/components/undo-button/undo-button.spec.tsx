import { describe, expect, it } from '@jest/globals';
import { FieldEngine } from '@suuudokuuu/field-core';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { fireEvent, screen } from '@testing-library/react-native';

import { isDefined } from '@rnw-community/shared';

import { createAppTestStore } from '../../../@generic/utils/create-app-test-store.mock';
import { renderWithGameContext } from '../../../@generic/utils/render-with-game-context.mock';

import { UndoButton } from './undo-button';
import { UndoButtonSelectors } from './undo-button.selectors';

import type { Sudoku } from '@suuudokuuu/generator';

const puzzleString = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

const buildEngine = (): FieldEngine => new FieldEngine({ sudokuString: puzzleString, difficulty: DifficultyEnum.Medium });

const placeFirstBlankCell = (engine: FieldEngine): void => {
    const findBlankCell = (sudoku: Sudoku) => sudoku.Field.flat().find(cell => sudoku.isBlankCell(cell));
    const blankCell = findBlankCell(engine.Sudoku);

    if (!isDefined(blankCell)) {
        throw new Error('Expected the fixture puzzle to contain a blank cell');
    }

    engine.selectCell(blankCell);
    engine.inputValue(engine.Sudoku.getCorrectValue(blankCell));
};

describe('UndoButton', () => {
    it('is disabled while the run has nothing to take back', async () => {
        expect.assertions(1);

        await renderWithGameContext(<UndoButton sizeStyle={null} />, { engine: buildEngine() });

        expect(screen.getByTestId(UndoButtonSelectors.Root)).toBeDisabled();
    });

    it('takes the last placement back through the engine and mirrors it into the run', async () => {
        expect.assertions(3);

        const engine = buildEngine();
        const store = createAppTestStore({ game: { difficulty: DifficultyEnum.Medium, sudokuString: puzzleString } });

        placeFirstBlankCell(engine);

        const placedSudokuString = engine.serialize().sudokuString;

        await renderWithGameContext(<UndoButton sizeStyle={null} />, { engine, store });

        await fireEvent.press(screen.getByTestId(UndoButtonSelectors.Root));

        expect(engine.serialize().sudokuString).toBe(puzzleString);
        expect(placedSudokuString).not.toBe(puzzleString);
        expect(store.getState().game.sudokuString).toBe(puzzleString);
    });

    it('is never offered during a challenge run', async () => {
        expect.assertions(1);

        const engine = buildEngine();

        placeFirstBlankCell(engine);

        await renderWithGameContext(<UndoButton sizeStyle={null} />, { engine, game: { isChallengeRun: true } });

        expect(screen.queryByTestId(UndoButtonSelectors.Root)).toBeNull();
    });
});
