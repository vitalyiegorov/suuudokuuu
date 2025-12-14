import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';

export class HiddenPairTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.HiddenPair, 5, sudoku);
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
                this.hasHiddenPairInUnit(rowCells, value) ||
                this.hasHiddenPairInUnit(colCells, value) ||
                this.hasHiddenPairInUnit(groupCells, value)
            ) {
                return true;
            }
        }

        return false;
    }

    private hasHiddenPairInUnit(unitCells: CellInterface[], value: number): boolean {
        const valueCandidateCells: CellInterface[] = [];

        for (const unitCell of unitCells) {
            if (unitCell.value === 0) {
                const candidates = this.getCellCandidates(unitCell);

                if (candidates.includes(value)) {
                    valueCandidateCells.push(unitCell);
                }
            }
        }

        if (valueCandidateCells.length !== 2) {
            return false;
        }

        const cell1Candidates = this.getCellCandidates(valueCandidateCells[0]);
        const cell2Candidates = this.getCellCandidates(valueCandidateCells[1]);

        const sharedValues = cell1Candidates.filter(candidate => cell2Candidates.includes(candidate));

        return sharedValues.length === 2 && sharedValues.includes(value);
    }
}
