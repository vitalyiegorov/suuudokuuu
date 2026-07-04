import { Sudoku } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '@suuudokuuu/generator';

export class HiddenSingleGroupTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.HiddenSingle, 3, sudoku);
    }

    getSolution(cell: CellInterface): number | null {
        const otherGroupCells = this.getGroupCells(cell).filter(
            groupCell => this.sudoku.isBlankCell(groupCell) && !this.sudoku.isSameCell(groupCell, cell)
        );

        for (const candidate of this.sudoku.getCellCandidates(cell)) {
            if (otherGroupCells.every(groupCell => !this.sudoku.getCellCandidates(groupCell).includes(candidate))) {
                return candidate;
            }
        }

        return null;
    }
}
