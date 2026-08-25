import { describe, expect, it } from '@jest/globals';
import { FieldEngine } from '@suuudokuuu/field-core';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithGameContext } from '../../../@generic/utils/render-with-game-context.mock';

import { RedoButton } from './redo-button';
import { RedoButtonSelectors } from './redo-button.selectors';

const puzzleString = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const noteCellValue = 4;

const buildEngineWithUndoneNote = (): FieldEngine => {
    const engine = new FieldEngine({ sudokuString: puzzleString, difficulty: DifficultyEnum.Medium });

    engine.toggleCandidate(engine.Sudoku.Field[0][2], noteCellValue);
    engine.undo();

    return engine;
};

describe('RedoButton', () => {
    it('is disabled while nothing was taken back', async () => {
        expect.assertions(1);

        const engine = new FieldEngine({ sudokuString: puzzleString, difficulty: DifficultyEnum.Medium });

        await renderWithGameContext(<RedoButton sizeStyle={null} />, { engine });

        expect(screen.getByTestId(RedoButtonSelectors.Root)).toBeDisabled();
    });

    it('replays the step that was taken back', async () => {
        expect.assertions(2);

        const engine = buildEngineWithUndoneNote();

        await renderWithGameContext(<RedoButton sizeStyle={null} />, { engine });

        expect(engine.getCellCandidates(engine.Sudoku.Field[0][2])).toStrictEqual([]);

        await fireEvent.press(screen.getByTestId(RedoButtonSelectors.Root));

        expect(engine.getCellCandidates(engine.Sudoku.Field[0][2])).toStrictEqual([noteCellValue]);
    });

    it('is never offered in hardcore mode', async () => {
        expect.assertions(1);

        const engine = buildEngineWithUndoneNote();

        await renderWithGameContext(<RedoButton sizeStyle={null} />, { engine, game: { maxMistakes: 0 } });

        expect(screen.queryByTestId(RedoButtonSelectors.Root)).toBeNull();
    });

    it('is never offered during a challenge run', async () => {
        expect.assertions(1);

        await renderWithGameContext(<RedoButton sizeStyle={null} />, {
            engine: buildEngineWithUndoneNote(),
            game: { isChallengeRun: true }
        });

        expect(screen.queryByTestId(RedoButtonSelectors.Root)).toBeNull();
    });
});
