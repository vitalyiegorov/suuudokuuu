import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { SudokuConfigInterface, defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { BaseTechnique } from '../base-technique';

import type { CellInterface } from '../../../interfaces/cell.interface';
import type { FieldInterface } from '../../../interfaces/field.interface';

export class XWingTechnique extends BaseTechnique {
    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(SolutionTechniqueEnum.XWing, 12, config);
    }

    canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean {
        if (!candidates.includes(value)) {
            return false;
        }

        return this.hasXWingForValue(field, cell, value);
    }

    // eslint-disable-next-line max-statements
    private hasXWingForValue(field: FieldInterface, cell: CellInterface, value: number): boolean {
        const rowsWithValue = this.findRowsWithExactlyCandidates(field, value, 2);
        const colsWithValue = this.findColsWithExactlyCandidates(field, value, 2);

        if (rowsWithValue.length >= 2) {
            for (let idx1 = 0; idx1 < rowsWithValue.length - 1; idx1 += 1) {
                for (let idx2 = idx1 + 1; idx2 < rowsWithValue.length; idx2 += 1) {
                    const row1Positions = rowsWithValue[idx1];
                    const row2Positions = rowsWithValue[idx2];

                    if (row1Positions[0] === row2Positions[0] && row1Positions[1] === row2Positions[1]) {
                        // eslint-disable-next-line max-depth
                        if (
                            (cell.y === row1Positions[0] || cell.y === row2Positions[0]) &&
                            (cell.x === row1Positions[0] || cell.x === row1Positions[1])
                        ) {
                            return true;
                        }
                    }
                }
            }
        }

        if (colsWithValue.length >= 2) {
            for (let idx1 = 0; idx1 < colsWithValue.length - 1; idx1 += 1) {
                for (let idx2 = idx1 + 1; idx2 < colsWithValue.length; idx2 += 1) {
                    const col1Positions = colsWithValue[idx1];
                    const col2Positions = colsWithValue[idx2];

                    if (col1Positions[0] === col2Positions[0] && col1Positions[1] === col2Positions[1]) {
                        // eslint-disable-next-line max-depth
                        if (
                            (cell.x === col1Positions[0] || cell.x === col2Positions[0]) &&
                            (cell.y === col1Positions[0] || cell.y === col1Positions[1])
                        ) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    private findRowsWithExactlyCandidates(field: FieldInterface, value: number, count: number): number[][] {
        const rows: number[][] = [];

        for (let rowIdx = 0; rowIdx < this.config.fieldSize; rowIdx += 1) {
            const positions: number[] = [];

            for (let colIdx = 0; colIdx < this.config.fieldSize; colIdx += 1) {
                if (field[rowIdx][colIdx].value === 0) {
                    const candidates = this.getCellCandidates(field, field[rowIdx][colIdx]);

                    if (candidates.includes(value)) {
                        positions.push(colIdx);
                    }
                }
            }

            if (positions.length === count) {
                rows.push(positions);
            }
        }

        return rows;
    }

    private findColsWithExactlyCandidates(field: FieldInterface, value: number, count: number): number[][] {
        const cols: number[][] = [];

        for (let colIdx = 0; colIdx < this.config.fieldSize; colIdx += 1) {
            const positions: number[] = [];

            for (let rowIdx = 0; rowIdx < this.config.fieldSize; rowIdx += 1) {
                if (field[rowIdx][colIdx].value === 0) {
                    const candidates = this.getCellCandidates(field, field[rowIdx][colIdx]);

                    if (candidates.includes(value)) {
                        positions.push(rowIdx);
                    }
                }
            }

            if (positions.length === count) {
                cols.push(positions);
            }
        }

        return cols;
    }
}
