import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { TechniqueManager, createTechniqueStrategies } from '@suuudokuuu/techniques';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

const createLadderOrder = (ladderMaxTechnique: SolutionTechniqueEnum): SolutionTechniqueEnum[] =>
    createTechniqueStrategies()
        .map(strategy => strategy.technique)
        .filter(technique => technique <= ladderMaxTechnique);

export const isSolvableWithLadder = (puzzleString: string, ladderMaxTechnique: SolutionTechniqueEnum): boolean => {
    const sudoku = Sudoku.fromString(puzzleString, defaultSudokuConfig);

    return new TechniqueManager(sudoku).solveLogically(createLadderOrder(ladderMaxTechnique)).outcome === 'solved';
};
