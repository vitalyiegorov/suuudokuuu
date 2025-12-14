import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class NakedQuadTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.NakedQuad, 8, sudoku);
    }

    canApply(cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length < 2 || candidates.length > 4) {
            return false;
        }

        const rowCells = this.getRowCells(cell.y);
        const colCells = this.getColCells(cell.x);
        const groupCells = this.getGroupCells(cell);

        return (
            this.hasQuadInUnit(rowCells, candidates, cell) ||
            this.hasQuadInUnit(colCells, candidates, cell) ||
            this.hasQuadInUnit(groupCells, candidates, cell)
        );
    }

    private hasQuadInUnit(unitCells: CellInterface[], candidates: number[], currentCell: CellInterface): boolean {
        const potentialQuadCells: CellInterface[] = [];
        const allCandidates = new Set(candidates);

        for (const unitCell of unitCells) {
            if (unitCell.value === 0 && !(unitCell.x === currentCell.x && unitCell.y === currentCell.y)) {
                const unitCandidates = this.getCellCandidates(unitCell);

                if (
                    unitCandidates.length >= 2 &&
                    unitCandidates.length <= 4 &&
                    unitCandidates.every(candidate => allCandidates.has(candidate))
                ) {
                    potentialQuadCells.push(unitCell);
                    unitCandidates.forEach(candidate => allCandidates.add(candidate));
                }
            }
        }

        return potentialQuadCells.length >= 3 && allCandidates.size === 4;
    }
}
