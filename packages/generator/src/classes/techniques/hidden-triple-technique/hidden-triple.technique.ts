import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class HiddenTripleTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.HiddenTriple, 7, sudoku);
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
                this.hasHiddenTripleInUnit(rowCells, value) ||
                this.hasHiddenTripleInUnit(colCells, value) ||
                this.hasHiddenTripleInUnit(groupCells, value)
            ) {
                return true;
            }
        }

        return false;
    }

    private hasHiddenTripleInUnit(unitCells: CellInterface[], value: number): boolean {
        const valueCandidateCells: CellInterface[] = [];

        for (const unitCell of unitCells) {
            if (unitCell.value === 0) {
                const candidates = this.getCellCandidates(unitCell);

                if (candidates.includes(value)) {
                    valueCandidateCells.push(unitCell);
                }
            }
        }

        if (valueCandidateCells.length !== 3) {
            return false;
        }

        const allCandidates = new Set<number>();

        for (const tripleCell of valueCandidateCells) {
            const cellCandidates = this.getCellCandidates(tripleCell);

            cellCandidates.forEach(candidate => allCandidates.add(candidate));
        }

        const sharedValues: number[] = [];

        for (const candidate of allCandidates) {
            let count = 0;

            for (const tripleCell of valueCandidateCells) {
                const cellCandidates = this.getCellCandidates(tripleCell);

                if (cellCandidates.includes(candidate)) {
                    count += 1;
                }
            }

            if (count === 3) {
                sharedValues.push(candidate);
            }
        }

        return sharedValues.length === 3 && sharedValues.includes(value);
    }
}
