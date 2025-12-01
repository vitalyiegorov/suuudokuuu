import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';

export interface TechniqueResultInterface {
    technique: SolutionTechniqueEnum;
    cell: CellInterface;
    value: number;
}

export class TechniqueIdentifier {
    private readonly config: SudokuConfigInterface;
    private readonly fieldFillingValues: number[];

    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        this.config = config;
        this.fieldFillingValues = Array.from({ length: this.config.fieldSize }, (_, i) => i + 1);
    }

    identify(field: FieldInterface, cell: CellInterface, value: number): SolutionTechniqueEnum {
        const candidates = this.getCellCandidates(field, cell);

        if (candidates.length === 1 && candidates[0] === value) {
            return SolutionTechniqueEnum.NakedSingle;
        }

        if (this.isHiddenSingle(field, cell, value)) {
            return SolutionTechniqueEnum.HiddenSingle;
        }

        return SolutionTechniqueEnum.Guess;
    }

    findNakedSingles(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const row of field) {
            for (const cell of row) {
                if (cell.value === this.config.blankCellValue) {
                    const candidates = this.getCellCandidates(field, cell);
                    if (candidates.length === 1) {
                        results.push({
                            technique: SolutionTechniqueEnum.NakedSingle,
                            cell,
                            value: candidates[0]
                        });
                    }
                }
            }
        }

        return results;
    }

    findHiddenSingles(field: FieldInterface): TechniqueResultInterface[] {
        const results: TechniqueResultInterface[] = [];

        for (const row of field) {
            for (const cell of row) {
                if (cell.value === this.config.blankCellValue) {
                    this.findHiddenSinglesForCell(field, cell, results);
                }
            }
        }

        return results;
    }

    getCellCandidates(field: FieldInterface, cell: CellInterface): number[] {
        const candidates: number[] = [];
        for (const value of this.fieldFillingValues) {
            const candidateCell = { ...cell, value };
            if (
                !this.hasValueInRow(field, candidateCell) &&
                !this.hasValueInColumn(field, candidateCell) &&
                !this.hasValueInGroup(field, candidateCell)
            ) {
                candidates.push(value);
            }
        }

        return candidates;
    }

    private findHiddenSinglesForCell(field: FieldInterface, cell: CellInterface, results: TechniqueResultInterface[]): void {
        const candidates = this.getCellCandidates(field, cell);
        for (const value of candidates) {
            if (this.isHiddenSingle(field, cell, value)) {
                results.push({
                    technique: SolutionTechniqueEnum.HiddenSingle,
                    cell,
                    value
                });
            }
        }
    }

    private isHiddenSingle(field: FieldInterface, cell: CellInterface, value: number): boolean {
        return (
            this.isOnlyPlaceInRow(field, cell, value) ||
            this.isOnlyPlaceInColumn(field, cell, value) ||
            this.isOnlyPlaceInGroup(field, cell, value)
        );
    }

    private isOnlyPlaceInRow(field: FieldInterface, cell: CellInterface, value: number): boolean {
        for (let x = 0; x < this.config.fieldSize; x += 1) {
            if (x !== cell.x && field[cell.y][x].value === this.config.blankCellValue) {
                const candidateCell = { ...field[cell.y][x], value };
                if (
                    !this.hasValueInRow(field, candidateCell) &&
                    !this.hasValueInColumn(field, candidateCell) &&
                    !this.hasValueInGroup(field, candidateCell)
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    private isOnlyPlaceInColumn(field: FieldInterface, cell: CellInterface, value: number): boolean {
        for (let y = 0; y < this.config.fieldSize; y += 1) {
            if (y !== cell.y && field[y][cell.x].value === this.config.blankCellValue) {
                const candidateCell = { ...field[y][cell.x], value };
                if (
                    !this.hasValueInRow(field, candidateCell) &&
                    !this.hasValueInColumn(field, candidateCell) &&
                    !this.hasValueInGroup(field, candidateCell)
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    private isOnlyPlaceInGroup(field: FieldInterface, cell: CellInterface, value: number): boolean {
        const boxStartY = cell.y - (cell.y % this.config.fieldGroupHeight);
        const boxStartX = cell.x - (cell.x % this.config.fieldGroupWidth);

        for (let dy = 0; dy < this.config.fieldGroupHeight; dy += 1) {
            for (let dx = 0; dx < this.config.fieldGroupWidth; dx += 1) {
                const y = boxStartY + dy;
                const x = boxStartX + dx;
                if ((y !== cell.y || x !== cell.x) && field[y][x].value === this.config.blankCellValue) {
                    const candidateCell = { ...field[y][x], value };
                    if (
                        !this.hasValueInRow(field, candidateCell) &&
                        !this.hasValueInColumn(field, candidateCell) &&
                        !this.hasValueInGroup(field, candidateCell)
                    ) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    private hasValueInRow(field: FieldInterface, cell: CellInterface): boolean {
        for (let x = 0; x < this.config.fieldSize; x += 1) {
            if (field[cell.y][x].value === cell.value) {
                return true;
            }
        }

        return false;
    }

    private hasValueInColumn(field: FieldInterface, cell: CellInterface): boolean {
        for (const row of field) {
            if (row[cell.x].value === cell.value) {
                return true;
            }
        }

        return false;
    }

    private hasValueInGroup(field: FieldInterface, cell: CellInterface): boolean {
        const boxStartY = cell.y - (cell.y % this.config.fieldGroupHeight);
        const boxStartX = cell.x - (cell.x % this.config.fieldGroupWidth);

        for (let y = 0; y < this.config.fieldGroupHeight; y += 1) {
            for (let x = 0; x < this.config.fieldGroupWidth; x += 1) {
                if (field[y + boxStartY][x + boxStartX].value === cell.value) {
                    return true;
                }
            }
        }

        return false;
    }
}
