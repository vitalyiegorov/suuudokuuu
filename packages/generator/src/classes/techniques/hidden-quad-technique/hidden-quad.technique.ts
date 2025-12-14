import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class HiddenQuadTechnique extends BaseTechnique {
    constructor(sudoku: Sudoku) {
        super(SolutionTechniqueEnum.HiddenQuad, 9, sudoku);
    }

    canApply(field: FieldInterface, cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length === 0) {
            return false;
        }

        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        for (const value of candidates) {
            if (this.hasHiddenQuadInUnit(field, rowCells, value, cell) ||
                this.hasHiddenQuadInUnit(field, colCells, value, cell) ||
                this.hasHiddenQuadInUnit(field, groupCells, value, cell)) {
                return true;
            }
        }

        return false;
    }

    // eslint-disable-next-line max-statements
    private hasHiddenQuadInUnit(field: FieldInterface, unitCells: CellInterface[], value: number, _currentCell: CellInterface): boolean {
        const valueCandidateCells: CellInterface[] = [];

        for (const unitCell of unitCells) {
            if (unitCell.value === 0) {
                const candidates = this.getCellCandidates(unitCell, field);

                if (candidates.includes(value)) {
                    valueCandidateCells.push(unitCell);
                }
            }
        }

        if (valueCandidateCells.length !== 4) {
            return false;
        }

        const allCandidates = new Set<number>();

        for (const cell of valueCandidateCells) {
            const cellCandidates = this.getCellCandidates(cell, field);

            cellCandidates.forEach(candidate => allCandidates.add(candidate));
        }

        const sharedValues: number[] = [];

        for (const candidate of allCandidates) {
            let count = 0;

            for (const cell of valueCandidateCells) {
                const cellCandidates = this.getCellCandidates(cell, field);

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
