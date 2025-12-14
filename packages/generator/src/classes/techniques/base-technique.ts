import { Sudoku } from '../sudoku/sudoku';

import type { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';

export interface TechniqueHint {
    technique: SolutionTechniqueEnum;
    cell: CellInterface;
    value: number;
}

export abstract class BaseTechnique {
    protected readonly config: SudokuConfigInterface;

    protected constructor(
        readonly type: SolutionTechniqueEnum,
        readonly difficulty: number,
        protected readonly sudoku: Sudoku
    ) {
        this.config = sudoku.Config;
    }

    protected get field(): FieldInterface {
        return this.sudoku.Field;
    }

    protected getCellCandidates(cell: CellInterface): number[] {
        return this.sudoku.getCellCandidates(cell, this.field);
    }

    protected isValueValidInCell(cell: CellInterface, value: number): boolean {
        const testCell = { ...cell, value };

        return (
            !this.sudoku.hasValueInRow(this.field, testCell) &&
            !this.sudoku.hasValueInColumn(this.field, testCell) &&
            !this.sudoku.hasValueInGroup(this.field, testCell)
        );
    }

    protected *getEmptyCells() {
        for (const row of this.field) {
            for (const cell of row) {
                if (cell.value === this.config.blankCellValue) {
                    yield cell;
                }
            }
        }
    }

    protected getRowCells(rowIndex: number): CellInterface[] {
        return this.field[rowIndex];
    }

    protected getColCells(colIndex: number): CellInterface[] {
        return this.field.map(row => row[colIndex]);
    }

    protected getGroupCells(cell: CellInterface): CellInterface[] {
        const cells: CellInterface[] = [];

        for (const row of this.field) {
            for (const currentCell of row) {
                if (currentCell.group === cell.group) {
                    cells.push(currentCell);
                }
            }
        }

        return cells;
    }

    protected countEmptyCellsInRow(rowIndex: number): number {
        return this.field[rowIndex].filter(cell => cell.value === this.config.blankCellValue).length;
    }

    protected countEmptyCellsInCol(colIndex: number): number {
        return this.field.filter(row => row[colIndex].value === this.config.blankCellValue).length;
    }

    protected countEmptyCellsInGroup(cell: CellInterface): number {
        return this.getGroupCells(cell).filter(groupCell => groupCell.value === this.config.blankCellValue).length;
    }

    abstract canApply(cell: CellInterface, candidates: number[]): boolean;
}
