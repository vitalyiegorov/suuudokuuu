import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';

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
    protected readonly fieldFillingValues: number[];

    protected constructor(
        readonly type: SolutionTechniqueEnum,
        readonly difficulty: number,
        protected readonly config: SudokuConfigInterface = defaultSudokuConfig
    ) {
        this.fieldFillingValues = Array.from({ length: this.config.fieldSize }, (_, idx) => idx + 1);
    }

    abstract canApply(field: FieldInterface, cell: CellInterface, candidates: number[]): boolean;

    findHint(field: FieldInterface, cell: CellInterface, candidates: number[]): TechniqueHint | null {
        if (cell.value !== this.config.blankCellValue || !this.canApply(field, cell, candidates)) {
            return null;
        }

        if (candidates.length === 0) {
            return null;
        }

        return {
            technique: this.type,
            cell,
            value: candidates[0]
        };
    }

    protected getCellCandidates(field: FieldInterface, cell: CellInterface): number[] {
        const candidates: number[] = [];

        for (const value of this.fieldFillingValues) {
            if (this.isValueValid(field, cell, value)) {
                candidates.push(value);
            }
        }

        return candidates;
    }

    protected isValueValid(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return (
            this.isValueValidInRow(field, cell.y, value) &&
            this.isValueValidInCol(field, cell.x, value) &&
            this.isValueValidInGroup(field, cell, value)
        );
    }

    protected isValueValidInRow(field: FieldInterface, rowIndex: number, value: number): boolean {
        return !field[rowIndex].some(cell => cell.value === value);
    }

    protected isValueValidInCol(field: FieldInterface, colIndex: number, value: number): boolean {
        return !field.some(row => row[colIndex].value === value);
    }

    protected isValueValidInGroup(field: FieldInterface, targetCell: CellInterface, value: number): boolean {
        const groupStartX = Math.floor(targetCell.x / this.config.fieldGroupWidth) * this.config.fieldGroupWidth;
        const groupStartY = Math.floor(targetCell.y / this.config.fieldGroupHeight) * this.config.fieldGroupHeight;

        for (let yCoord = groupStartY; yCoord < groupStartY + this.config.fieldGroupHeight; yCoord += 1) {
            for (let xCoord = groupStartX; xCoord < groupStartX + this.config.fieldGroupWidth; xCoord += 1) {
                if (field[yCoord][xCoord].value === value) {
                    return false;
                }
            }
        }

        return true;
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
