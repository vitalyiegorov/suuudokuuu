import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class LockedCandidateTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.LockedCandidate, 5, sudoku);
    }

    getSolution(cell: CellInterface): number | null {
        const availableGroupCells = this.getGroupCells(cell).filter(
            cellItem => this.sudoku.isBlankCell(cellItem) && cellItem.x !== cell.x && cellItem.y !== cell.y
        );

        const availableRows = [...new Set(availableGroupCells.map(cellItem => cellItem.y))];
        const availableCols = [...new Set(availableGroupCells.map(cellItem => cellItem.x))];

        const results = new Set<number>();
        for (const candidate of this.sudoku.getCellCandidates(cell)) {
            for (const row of availableRows) {
                const lockedRowCells = this.getRowCells(row).filter(
                    rowCell =>
                        rowCell.group !== cell.group &&
                        this.sudoku.isBlankCell(rowCell) &&
                        this.sudoku.getCellCandidates(rowCell).includes(candidate)
                );

                if (lockedRowCells.length >= 2 && lockedRowCells.every(cell => cell.group === lockedRowCells[0].group)) {
                    results.add(candidate);
                }
            }

            for (const col of availableCols) {
                const lockedColCells = this.getColCells(col).filter(
                    colCell =>
                        colCell.group !== cell.group &&
                        this.sudoku.isBlankCell(colCell) &&
                        this.sudoku.getCellCandidates(colCell).includes(candidate)
                );
                if (lockedColCells.length >= 2 && lockedColCells.every(cell => cell.group === lockedColCells[0].group)) {
                    results.add(candidate);
                }
            }
        }

        return results.size === 1 ? [...results.values()][0] : null;
    }
}
