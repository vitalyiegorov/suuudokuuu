import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class HiddenSingleGroupTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.HiddenSingleGroup, 3, sudoku);
    }

    getSolution(cell: CellInterface): number | null {
        const availableGroupCells = this.getGroupCells(cell).filter(
            cellItem => this.sudoku.isBlankCell(cellItem) && cellItem.x !== cell.x && cellItem.y !== cell.y
        );

        const groupRows = [...new Set(availableGroupCells.map(cellItem => cellItem.y))];
        const groupCols = [...new Set(availableGroupCells.map(cellItem => cellItem.x))];

        const results: number[] = [];
        for (const candidate of this.getCellCandidates(cell)) {
            const validRows = groupRows.filter(row => this.getRowCells(row).some(cell => cell.value === candidate));
            const validCols = groupCols.filter(col => this.getColCells(col).some(cell => cell.value === candidate));

            if (validRows.length === groupRows.length && validCols.length === groupCols.length) {
                results.push(candidate);
            }
        }

        return results.length === 1 ? results[0] : null;
    }
}
