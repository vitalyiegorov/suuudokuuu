import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';

import type { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';
import type { TechniqueResultInterface, TechniqueStrategyInterface } from '../../interfaces/technique-strategy.interface';

export abstract class BaseTechnique implements TechniqueStrategyInterface {
    protected readonly config: SudokuConfigInterface;
    protected readonly fieldFillingValues: number[];

    abstract readonly type: SolutionTechniqueEnum;
    abstract readonly difficulty: number;

    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        this.config = config;
        this.fieldFillingValues = Array.from({ length: this.config.fieldSize }, (_, idx) => idx + 1);
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
        return !field[rowIndex].some((cell) => cell.value === value);
    }

    protected isValueValidInCol(field: FieldInterface, colIndex: number, value: number): boolean {
        return !field.some((row) => row[colIndex].value === value);
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

    protected getEmptyCells(field: FieldInterface): CellInterface[] {
        const emptyCells: CellInterface[] = [];

        for (const row of field) {
            for (const cell of row) {
                if (cell.value === 0) {
                    emptyCells.push(cell);
                }
            }
        }

        return emptyCells;
    }

    protected getRowCells(field: FieldInterface, rowIndex: number): CellInterface[] {
        return field[rowIndex];
    }

    protected getColCells(field: FieldInterface, colIndex: number): CellInterface[] {
        return field.map((row) => row[colIndex]);
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

    abstract canApply(field: FieldInterface, cell: CellInterface, value: number, candidates: number[]): boolean;
    abstract findAll(field: FieldInterface): TechniqueResultInterface[];
}
