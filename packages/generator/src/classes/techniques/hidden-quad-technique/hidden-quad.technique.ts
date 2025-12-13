import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { SudokuConfigInterface, defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class HiddenQuadTechnique extends BaseTechnique {
    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(SolutionTechniqueEnum.HiddenQuad, 9, config);
    }

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (!candidates.includes(value)) {
            return false;
        }

        const rowCells = this.getRowCells(field, cell.y);
        const colCells = this.getColCells(field, cell.x);
        const groupCells = this.getGroupCells(field, cell);

        return (
            this.hasHiddenQuadInUnit(field, rowCells, value, cell) ||
            this.hasHiddenQuadInUnit(field, colCells, value, cell) ||
            this.hasHiddenQuadInUnit(field, groupCells, value, cell)
        );
    }

    // eslint-disable-next-line max-statements
    private hasHiddenQuadInUnit(field: FieldInterface, unitCells: CellInterface[], value: number, _currentCell: CellInterface): boolean {
        const valueCandidateCells: CellInterface[] = [];

        for (const unitCell of unitCells) {
            if (unitCell.value === 0) {
                const candidates = this.getCellCandidates(field, unitCell);

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

            if (count === 4) {
                sharedValues.push(candidate);
            }
        }

        return sharedValues.length === 4 && sharedValues.includes(value);
    }
}
