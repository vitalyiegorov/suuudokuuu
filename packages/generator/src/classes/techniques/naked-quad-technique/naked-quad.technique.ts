import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { SudokuConfigInterface, defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class NakedQuadTechnique extends BaseTechnique {
    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(SolutionTechniqueEnum.NakedQuad, 8, config);
    }

    canApply(field: FieldInterface, cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length < 2 || candidates.length > 4) {
            return false;
        }

        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        return (
            this.hasQuadInUnit(field, rowCells, candidates, cell) ||
            this.hasQuadInUnit(field, colCells, candidates, cell) ||
            this.hasQuadInUnit(field, groupCells, candidates, cell)
        );
    }

    private hasQuadInUnit(field: FieldInterface, unitCells: CellInterface[], candidates: number[], currentCell: CellInterface): boolean {
        const potentialQuadCells: CellInterface[] = [];
        const allCandidates = new Set(candidates);

        for (const unitCell of unitCells) {
            if (unitCell.value === 0 && !(unitCell.x === currentCell.x && unitCell.y === currentCell.y)) {
                const unitCandidates = this.getCellCandidates(field, unitCell);

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
