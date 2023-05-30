import { isDefined } from '@rnw-community/shared';

import { type DifficultyEnum, getDifficulty } from '../../@generic/enums/difficulty.enum';
import type { CellInterface } from '../interfaces/cell.interface';
import type { FieldInterface } from '../interfaces/field.interface';
import { type ScoredCellsInterface, emptyScoredCells } from '../interfaces/scored-cells.interface';
import type { SudokuConfigInterface } from '../interfaces/sudoku-config.interface';
import { SerializableSudoku } from '../serializable-sudoku/serializable-sudoku';
import type { AvailableValues } from '../types/available-values.type';

// TODO: We can split this class into rules validator(or similar)
export class Sudoku extends SerializableSudoku {
    private readonly fieldFillingValues: number[];
    private availableValues: AvailableValues = {};
    private possibleValues: number[] = [];

    constructor(config: SudokuConfigInterface) {
        super(config);

        // TODO: Is there a better way to randomize array of numbers in JS? =)
        this.fieldFillingValues = Array.from({ length: this.fieldSize }, (_, i) => i + 1);
        for (let i = this.fieldFillingValues.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.fieldFillingValues[i], this.fieldFillingValues[j]] = [this.fieldFillingValues[j], this.fieldFillingValues[i]];
        }
    }

    get PossibleValues(): number[] {
        return [...this.possibleValues];
    }

    get AvailableValues(): AvailableValues {
        return { ...this.availableValues };
    }

    create(difficulty: DifficultyEnum): void {
        this.field = this.createEmptyField();

        if (!this.fillRecursive()) {
            throw new Error('Unable to create a game field');
        }

        const getRandomPosition = (): number => Math.floor(Math.random() * this.fieldSize);

        // TODO: Can we improve this logic to make it more unique??
        this.gameField = this.cloneField(this.field);
        for (let i = 0; i < getDifficulty(difficulty, this.fieldSize); i += 1) {
            this.gameField[getRandomPosition()][getRandomPosition()].value = this.blankCellValue;
        }

        this.calculateAvailableValues();
        this.calculatePossibleValues();
    }

    isCorrectValue(cell: CellInterface): boolean {
        return this.field[cell.y][cell.x].value === cell.value;
    }

    // eslint-disable-next-line max-statements
    setCellValue(cell: CellInterface): ScoredCellsInterface {
        const scoredCells = { ...emptyScoredCells };
        if (this.isCorrectValue(cell)) {
            this.gameField[cell.y][cell.x].value = cell.value;
            const blankCell = { ...cell, value: this.blankCellValue };

            this.availableValues[cell.value] += 1;
            this.calculatePossibleValues();

            if (!this.hasValueInColumn(this.gameField, blankCell)) {
                scoredCells.x = cell.x;
            }

            if (!this.hasValueInRow(this.gameField, blankCell)) {
                scoredCells.y = cell.y;
            }

            if (!this.hasValueInGroup(this.gameField, blankCell)) {
                scoredCells.group = cell.group;
            }

            // HINT: No possible values left - winner!
            if (this.possibleValues.length === 0) {
                scoredCells.values = this.fieldFillingValues;
                // HINT: This value is completed!
            } else if (!this.possibleValues.includes(cell.value)) {
                scoredCells.values = [cell.value];
            }

            return scoredCells;
        }
        throw new Error('Cell value is wrong');
    }

    private hasBlankCells(): [hasBlankCells: boolean, lastY: number, lastX: number] {
        let y = 0;
        let x = 0;

        for (y = 0; y < this.field.length; y += 1) {
            for (x = 0; x < this.field[y].length; x += 1) {
                if (this.field[y][x].value === this.blankCellValue) {
                    return [true, y, x];
                }
            }
        }

        return [false, y, x];
    }

    private hasValueInRow(field: FieldInterface, cell: CellInterface): boolean {
        for (let x = 0; x < this.fieldSize; x += 1) {
            if (field[cell.y][x].value === cell.value) {
                return true;
            }
        }

        return false;
    }

    // eslint-disable-next-line class-methods-use-this
    private hasValueInColumn(field: FieldInterface, cell: CellInterface): boolean {
        for (const row of field) {
            if (row[cell.x].value === cell.value) {
                return true;
            }
        }

        return false;
    }

    private hasValueInGroup(field: FieldInterface, cell: CellInterface): boolean {
        const boxStartY = cell.y - (cell.y % this.fieldGroupHeight);
        const boxStartX = cell.x - (cell.x % this.fieldGroupWidth);

        for (let y = 0; y < this.fieldGroupHeight; y += 1) {
            for (let x = 0; x < this.fieldGroupWidth; x += 1) {
                if (field[y + boxStartY][x + boxStartX].value === cell.value) {
                    return true;
                }
            }
        }

        return false;
    }

    private calculatePossibleValues(): void {
        this.possibleValues = Object.keys(this.availableValues)
            .map(Number)
            .filter(key => this.availableValues[key] < this.fieldSize)
            .map(key => key);
    }

    /**
     * TODO: Can we improve generation speed? =)
     * HINT: This algorithm is based on backtracking
     * ispired by https://dev.to/christinamcmahon/use-backtracking-algorithm-to-solve-sudoku-270
     */
    private fillRecursive(): boolean {
        const [needsFilling, emptyY, emptyX] = this.hasBlankCells();

        if (!needsFilling) {
            return true;
        }

        for (const value of this.fieldFillingValues) {
            const cell = { ...this.field[emptyY][emptyX], value };

            if (
                !this.hasValueInRow(this.field, cell) &&
                !this.hasValueInColumn(this.field, cell) &&
                !this.hasValueInGroup(this.field, cell)
            ) {
                this.field[emptyY][emptyX] = cell;

                if (this.fillRecursive()) {
                    return true;
                }

                this.field[emptyY][emptyX].value = this.blankCellValue;
            }
        }

        return false;
    }

    private calculateAvailableValues(): void {
        this.availableValues = {};

        for (const row of this.gameField) {
            for (const col of row) {
                const { value } = col;
                if (value !== this.blankCellValue) {
                    this.availableValues[value] = isDefined(this.availableValues[value]) ? this.availableValues[value] + 1 : 1;
                }
            }
        }
    }
}
