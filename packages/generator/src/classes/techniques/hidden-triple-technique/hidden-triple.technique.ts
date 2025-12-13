import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { SudokuConfigInterface, defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class HiddenTripleTechnique extends BaseTechnique {
    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(SolutionTechniqueEnum.HiddenTriple, 7, config);
    }

    canApply(field: FieldInterface, cell: CellInterface, candidates: number[]): boolean {
        if (cell.value !== this.config.blankCellValue || candidates.length === 0) {
            return false;
        }

        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        for (const value of candidates) {
            if (this.hasHiddenTripleInUnit(field, rowCells, value, cell) ||
                this.hasHiddenTripleInUnit(field, colCells, value, cell) ||
                this.hasHiddenTripleInUnit(field, groupCells, value, cell)) {
                return true;
            }
        }

        return false;
    }

    // eslint-disable-next-line max-statements
    private hasHiddenTripleInUnit(field: FieldInterface, unitCells: CellInterface[], value: number, _currentCell: CellInterface): boolean {
        const valueCandidateCells: CellInterface[] = [];

        for (const unitCell of unitCells) {
            if (unitCell.value === 0) {
                const candidates = this.getCellCandidates(field, unitCell);

                if (candidates.includes(value)) {
                    valueCandidateCells.push(unitCell);
                }
            }
        }

        if (valueCandidateCells.length !== 3) {
            return false;
        }

        const allCandidates = new Set<number>();

        for (const cell of valueCandidateCells) {
            const cellCandidates = this.getCellCandidates(field, cell);

            cellCandidates.forEach(candidate => allCandidates.add(candidate));
        }

        const sharedValues: number[] = [];

        for (const candidate of allCandidates) {
            let count = 0;

            for (const cell of valueCandidateCells) {
                const cellCandidates = this.getCellCandidates(field, cell);

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
