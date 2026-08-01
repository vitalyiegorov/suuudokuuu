import { TechniqueManager } from '@suuudokuuu/techniques';

import type { CellInterface, Sudoku } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export const classifyTimelineMove = (sudoku: Sudoku, cell: CellInterface): SolutionTechniqueEnum =>
    new TechniqueManager(sudoku).identifyMove(cell).technique;
