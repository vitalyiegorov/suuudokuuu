import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';

import type { GameState } from '../../game/store/game.state';

export const getSudokuAtStep = (gameState: GameState, currentStep: number) => {
    const sudoku = Sudoku.fromString(gameState.sudokuString, defaultSudokuConfig);

    const steps = gameState.challengeSteps;
    let elapsedTime = 0;
    let highlightedCellKey = '';

    for (let i = 0; i < currentStep && i < steps.length; i += 1) {
        const x = steps[i].cellIndex % defaultSudokuConfig.fieldSize;
        const y = Math.floor(steps[i].cellIndex / defaultSudokuConfig.fieldSize);

        sudoku.Field[y][x] = { ...sudoku.Field[y][x], value: steps[i].value };
        elapsedTime += steps[i].ts;
        highlightedCellKey = getCellKey({ x, y });
    }

    return { sudoku, highlightedCellKey, elapsedTime };
};
