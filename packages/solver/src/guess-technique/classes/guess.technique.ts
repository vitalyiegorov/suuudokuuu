import { SolutionTechniqueEnum } from '../../@generic/enums/solution-technique.enum';

import type { TechniqueResultInterface } from '../../@generic/interfaces/technique-result.interface';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

export class GuessTechnique {
    readonly technique = SolutionTechniqueEnum.Guess;

    constructor(private readonly sudoku: Sudoku) {}

    findForCell(cell: CellInterface, value: number = this.sudoku.getCorrectValue(cell)): TechniqueResultInterface {
        return {
            technique: this.technique,
            cell,
            value,
            kind: 'guess',
            eliminations: [],
            reasonCells: [cell]
        };
    }
}
