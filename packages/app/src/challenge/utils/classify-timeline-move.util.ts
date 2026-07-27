import { TechniqueManager } from '@suuudokuuu/solver';

import type { CellInterface, Sudoku } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/solver';

export const classifyTimelineMove = (sudoku: Sudoku, cell: CellInterface): SolutionTechniqueEnum =>
    new TechniqueManager(sudoku).identifyMove(cell).technique;
