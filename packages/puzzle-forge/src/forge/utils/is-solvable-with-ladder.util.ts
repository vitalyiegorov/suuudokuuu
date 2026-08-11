import { LogicalSolver, createTechniqueStrategies } from '@suuudokuuu/techniques';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const isSolvableWithLadder = (puzzleString: string, ladderMaxTechnique: SolutionTechniqueEnum): boolean =>
    new LogicalSolver(createTechniqueStrategies().filter(strategy => strategy.technique <= ladderMaxTechnique)).solve(puzzleString)
        .isSolved;
