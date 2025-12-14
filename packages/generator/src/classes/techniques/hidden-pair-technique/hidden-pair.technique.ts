import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class HiddenPairTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.HiddenPair, 5, sudoku);
    }

    canApply(field: FieldInterface, cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length === 0) {
            return false;
        }

        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        for (const value of candidates) {
            if (this.hasHiddenPairInUnit(field, rowCells, value, cell) ||
                this.hasHiddenPairInUnit(field, colCells, value, cell) ||
                this.hasHiddenPairInUnit(field, groupCells, value, cell)) {
                return true;
            }
        }

        return false;
    }

    private hasHiddenPairInUnit(field: FieldInterface, unitCells: CellInterface[], value: number, _currentCell: CellInterface): boolean {
        const valueCandidateCells: CellInterface[] = [];

        for (const unitCell of unitCells) {
            if (unitCell.value === 0) {
                const candidates = this.getCellCandidates(unitCell, field);

                if (candidates.includes(value)) {
                    valueCandidateCells.push(unitCell);
                }
            }
        }

        if (valueCandidateCells.length !== 2) {
            return false;
        }

        const cell1Candidates = this.getCellCandidates(valueCandidateCells[0], field);
        const cell2Candidates = this.getCellCandidates(valueCandidateCells[1], field);

        const sharedValues = cell1Candidates.filter(candidate => cell2Candidates.includes(candidate));

        return sharedValues.length === 2 && sharedValues.includes(value);
    }
}
