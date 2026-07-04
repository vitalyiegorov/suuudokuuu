import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { TechniqueResultInterface } from '../../../interfaces/technique-result.interface';
import type { Sudoku } from '../../sudoku/sudoku';

export class GuessTechniqueScanner {
    constructor(private readonly sudoku: Sudoku) {}

    findForCell(cell: CellInterface): TechniqueResultInterface {
        return {
            technique: SolutionTechniqueEnum.Guess,
            cell,
            value: this.sudoku.getCorrectValue(cell),
            kind: 'guess',
            eliminations: [],
            reasonCells: [cell]
        };
    }
}
