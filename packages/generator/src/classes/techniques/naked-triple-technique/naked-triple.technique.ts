import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class NakedTripleTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.NakedTriple, 6, sudoku);
    }

    canApply(cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length < 2 || candidates.length > 3) {
            return false;
        }

        const rowCells = this.getRowCells(cell.y);
        const colCells = this.getColCells(cell.x);
        const groupCells = this.getGroupCells(cell);

        return (
            this.hasTripleInUnit(rowCells, candidates, cell) ||
            this.hasTripleInUnit(colCells, candidates, cell) ||
            this.hasTripleInUnit(groupCells, candidates, cell)
        );
    }

    private hasTripleInUnit(unitCells: CellInterface[], candidates: number[], currentCell: CellInterface): boolean {
        const potentialTripleCells: CellInterface[] = [];
        const allCandidates = new Set(candidates);

        for (const unitCell of unitCells) {
            if (unitCell.value === 0 && !(unitCell.x === currentCell.x && unitCell.y === currentCell.y)) {
                const unitCandidates = this.getCellCandidates(unitCell);

                if (
                    unitCandidates.length >= 2 &&
                    unitCandidates.length <= 3 &&
                    unitCandidates.every(candidate => allCandidates.has(candidate))
                ) {
                    potentialTripleCells.push(unitCell);
                    unitCandidates.forEach(candidate => allCandidates.add(candidate));
                }
            }
        }

        return potentialTripleCells.length >= 2 && allCandidates.size === 3;
    }
}
