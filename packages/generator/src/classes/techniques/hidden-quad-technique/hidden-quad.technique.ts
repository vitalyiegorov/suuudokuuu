import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class HiddenQuadTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.HiddenQuad, 9, sudoku);
    }

    canApply(cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length === 0) {
            return false;
        }

        const rowCells = this.getRowCells(cell.y);
        const colCells = this.getColCells(cell.x);
        const groupCells = this.getGroupCells(cell);

        for (const value of candidates) {
            if (
                this.hasHiddenQuadInUnit(rowCells, value) ||
                this.hasHiddenQuadInUnit(colCells, value) ||
                this.hasHiddenQuadInUnit(groupCells, value)
            ) {
                return true;
            }
        }

        return false;
    }

    private hasHiddenQuadInUnit(unitCells: CellInterface[], value: number): boolean {
        const valueCandidateCells: CellInterface[] = [];

        for (const unitCell of unitCells) {
            if (unitCell.value === 0) {
                const candidates = this.getCellCandidates(unitCell);

                if (candidates.includes(value)) {
                    valueCandidateCells.push(unitCell);
                }
            }
        }

        if (valueCandidateCells.length !== 4) {
            return false;
        }

        const allCandidates = new Set<number>();

        for (const quadCell of valueCandidateCells) {
            const cellCandidates = this.getCellCandidates(quadCell);

            cellCandidates.forEach(candidate => allCandidates.add(candidate));
        }

        const sharedValues: number[] = [];

        for (const candidate of allCandidates) {
            let count = 0;

            for (const quadCell of valueCandidateCells) {
                const cellCandidates = this.getCellCandidates(quadCell);

                if (cellCandidates.includes(candidate)) {
                    count += 1;
                }
            }

            if (count === 4) {
                sharedValues.push(candidate);
            }
        }

        return sharedValues.length === 4 && sharedValues.includes(value);
    }
}
