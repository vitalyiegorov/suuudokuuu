import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class NakedPairTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.NakedPair, 4, sudoku);
    }

    canApply(cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue) {
            return false;
        }

        if (candidates.length !== 2) {
            return false;
        }

        const rowCells = this.getRowCells(cell.y);
        const colCells = this.getColCells(cell.x);
        const groupCells = this.getGroupCells(cell);

        return (
            this.hasPairInUnit(rowCells, candidates, cell) ||
            this.hasPairInUnit(colCells, candidates, cell) ||
            this.hasPairInUnit(groupCells, candidates, cell)
        );
    }

    private hasPairInUnit(unitCells: CellInterface[], candidates: number[], currentCell: CellInterface): boolean {
        let pairCount = 0;

        for (const unitCell of unitCells) {
            if (unitCell.value === this.config.blankCellValue && !(unitCell.x === currentCell.x && unitCell.y === currentCell.y)) {
                const unitCandidates = this.getCellCandidates(unitCell);

                if (unitCandidates.length === 2 && unitCandidates.every(candidate => candidates.includes(candidate))) {
                    pairCount += 1;
                }
            }
        }

        return pairCount === 1;
    }
}
