import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class HiddenSingleLineTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.HiddenSingle, 3, sudoku);
    }

    getSolution(cell: CellInterface): number | null {
        const availableRowCells = this.getRowCells(cell.y).filter(
            cellItem => this.sudoku.isBlankCell(cellItem) && !this.sudoku.isSameCell(cellItem, cell)
        );
        const availableColCells = this.getColCells(cell.x).filter(
            cellItem => this.sudoku.isBlankCell(cellItem) && !this.sudoku.isSameCell(cellItem, cell)
        );

        const cols = [...new Set(availableRowCells.map(cellItem => cellItem.x))];
        const rows = [...new Set(availableColCells.map(cellItem => cellItem.y))];

        const results: number[] = [];
        for (const candidate of this.sudoku.getCellCandidates(cell)) {
            const validCols = cols.filter(col => this.getColCells(col).some(cell => cell.value === candidate));
            const validRows = rows.filter(row => this.getRowCells(row).some(cell => cell.value === candidate));

            if (validCols.length === cols.length || validRows.length === rows.length) {
                results.push(candidate);
            }
        }

        return results.length === 1 ? results[0] : null;
    }
}
