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

    abstract canApply(field: FieldInterface, cell: CellInterface, candidates: number[]): boolean;

    protected getCellCandidates(cell: CellInterface, field: FieldInterface): number[] {
        return this.sudoku.getCellCandidates(cell, field);
    }

    protected isValueValidInCell(field: FieldInterface, cell: CellInterface, value: number): boolean {
        const testCell = { ...cell, value };
        return (
            !this.sudoku.hasValueInRow(field, testCell) &&
            !this.sudoku.hasValueInColumn(field, testCell) &&
            !this.sudoku.hasValueInGroup(field, testCell)
        );
    }

    protected *getEmptyCells(field: FieldInterface) {
        for (const row of field) {
            for (const cell of row) {
                if (cell.value === this.config.blankCellValue) {
                    yield cell;
                }
            }
        }
    }

    protected getRowCells(field: FieldInterface, rowIndex: number): CellInterface[] {
        return field[rowIndex];
    }

    protected getColCells(field: FieldInterface, colIndex: number): CellInterface[] {
        return field.map(row => row[colIndex]);
    }

    protected getGroupCells(field: FieldInterface, cell: CellInterface): CellInterface[] {
        const groupStartX = Math.floor(cell.x / this.config.fieldGroupWidth) * this.config.fieldGroupWidth;
        const groupStartY = Math.floor(cell.y / this.config.fieldGroupHeight) * this.config.fieldGroupHeight;
        const cells: CellInterface[] = [];

        for (let yCoord = groupStartY; yCoord < groupStartY + this.config.fieldGroupHeight; yCoord += 1) {
            for (let xCoord = groupStartX; xCoord < groupStartX + this.config.fieldGroupWidth; xCoord += 1) {
                cells.push(field[yCoord][xCoord]);
            }
        }

        return cells;
    }

    protected countEmptyCellsInRow(field: FieldInterface, rowIndex: number): number {
        return field[rowIndex].filter(cell => cell.value === this.config.blankCellValue).length;
    }

    protected countEmptyCellsInCol(field: FieldInterface, colIndex: number): number {
        return field.filter(row => row[colIndex].value === this.config.blankCellValue).length;
    }

    protected countEmptyCellsInGroup(field: FieldInterface, cell: CellInterface): number {
        return this.getGroupCells(field, cell).filter(groupCell => groupCell.value === this.config.blankCellValue).length;
    }
}
