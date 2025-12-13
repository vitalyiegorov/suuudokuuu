import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { SudokuConfigInterface, defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class NakedTripleTechnique extends BaseTechnique {
    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(SolutionTechniqueEnum.NakedTriple, 6, config);
    }

    canApply(field: FieldInterface, cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length < 2 || candidates.length > 3) {
            return false;
        }

        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        return (
            this.hasTripleInUnit(field, rowCells, candidates, cell) ||
            this.hasTripleInUnit(field, colCells, candidates, cell) ||
            this.hasTripleInUnit(field, groupCells, candidates, cell)
        );
    }

    private hasTripleInUnit(field: FieldInterface, unitCells: CellInterface[], candidates: number[], currentCell: CellInterface): boolean {
        const potentialTripleCells: CellInterface[] = [];
        const allCandidates = new Set(candidates);

        for (const unitCell of unitCells) {
            if (unitCell.value === 0 && !(unitCell.x === currentCell.x && unitCell.y === currentCell.y)) {
                const unitCandidates = this.getCellCandidates(field, unitCell);

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
