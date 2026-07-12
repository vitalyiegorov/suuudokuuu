import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { TechniqueManager } from '@suuudokuuu/solver';

import { getCellKey } from '../../@generic/utils/get-cell-key.util';

import type { GameState } from '../../game/store/game.state';
import type { SolutionStepInterface } from '@suuudokuuu/encoder';
import type { MoveClassificationInterface } from '@suuudokuuu/solver';

export const getSudokuAtStep = (gameState: GameState, currentStep: number) => {
    const sudoku = Sudoku.fromString(gameState.sudokuString, defaultSudokuConfig);

    const steps = gameState.challengeSteps;
    let elapsedTime = 0;
    let highlightedCellKey = '';
    let solutionStep: SolutionStepInterface | null = null;
    let moveClassification: MoveClassificationInterface | null = null;

    for (let i = 0; i < currentStep && i < steps.length; i += 1) {
        const x = steps[i].cellIndex % defaultSudokuConfig.fieldSize;
        const y = Math.floor(steps[i].cellIndex / defaultSudokuConfig.fieldSize);
        const cell = { ...sudoku.Field[y][x], value: steps[i].value };

        if (i === currentStep - 1) {
            moveClassification = new TechniqueManager(sudoku).identifyMove(cell);
        }

        sudoku.Field[y][x] = cell;
        elapsedTime += steps[i].ts;
        highlightedCellKey = getCellKey({ x, y });
        solutionStep = steps[i];
    }

    return { sudoku, highlightedCellKey, elapsedTime, solutionStep, moveClassification };
};
