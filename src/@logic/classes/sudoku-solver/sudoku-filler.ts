import { isDefined } from '@rnw-community/shared';

import { type DifficultyEnum } from '../../../@generic';
import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';
import { type SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';

export class SudokuFiller {
    constructor(protected readonly config: SudokuConfigInterface) {}

    createFullField(): FieldInterface {
        const fullField = this.createEmptyField();
        if (!this.fillRecursive(fullField, this.getRandomFillingValues())) {
            throw new Error('Unable to create a game field');
        }

        return fullField;
    }

    createGameField(fullField: FieldInterface, difficulty: DifficultyEnum): FieldInterface {
        const getRandomPosition = (): number => Math.floor(Math.random() * this.config.fieldSize);

        const blankCellsCount = this.getBlankCellsFromDifficulty(difficulty);

        const blankField = this.cloneField(fullField);
        for (let i = 0; i < blankCellsCount; i += 1) {
            blankField[getRandomPosition()][getRandomPosition()].value = this.config.blankCellValue;
        }

        return blankField;
    }

    getBlankCellsFromDifficulty(difficulty: DifficultyEnum): number {
        return Math.ceil(this.config.difficultyBlankCellsPercentage[difficulty] * this.config.fieldSize * this.config.fieldSize);
    }

    isBlankCell(cell?: CellInterface): boolean {
        return isDefined(cell) && cell.value === this.config.blankCellValue;
    }

    isCoordinatesInGroup(cell: CellInterface, y: number, x: number): boolean {
        const { startY, startX, endY, endX } = this.getGroupCoordinates(cell);

        return y >= startY && y < endY && x >= startX && x < endX;
    }
    // eslint-disable-next-line class-methods-use-this

    isSameCellValue(cell: CellInterface, selectedCell?: CellInterface): boolean {
        return isDefined(selectedCell) && cell.value === selectedCell.value && cell.value !== this.config.blankCellValue;
    }

    // eslint-disable-next-line class-methods-use-this
    protected cloneField(field: FieldInterface): FieldInterface {
        return field.map(row => row.map(cell => ({ ...cell })));
    }

    // TODO: Groups are numbered vertically
    protected createEmptyField(): FieldInterface {
        return Array.from({ length: this.config.fieldSize }, (_, y) =>
            Array.from({ length: this.config.fieldSize }, (__, x) => ({
                y,
                x,
                value: this.config.blankCellValue,
                group:
                    Math.floor(x / this.config.fieldGroupWidth) * this.config.fieldGroupWidth +
                    Math.floor(y / this.config.fieldGroupHeight) +
                    1
            }))
        );
    }

    private getRandomFillingValues(): number[] {
        // TODO: Is there a better way to randomize array of numbers in JS? =)
        const values = Array.from({ length: this.config.fieldSize }, (_, i) => i + 1);
        for (let i = this.config.fieldSize - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [values[i], values[j]] = [values[j], values[i]];
        }

        return values;
    }

    /**
     * TODO: Can we improve generation speed? =)
     * HINT: This algorithm is based on backtracking
     * HINT: Inspired by https://dev.to/christinamcmahon/use-backtracking-algorithm-to-solve-sudoku-270
     */
    private fillRecursive(field: FieldInterface, values: number[]): boolean {
        const [needsFilling, emptyY, emptyX] = this.hasBlankCells(field);

        if (!needsFilling) {
            return true;
        }

        for (const value of values) {
            const cell = { ...field[emptyY][emptyX], value };

            if (!this.hasValueInRow(field, cell) && !this.hasValueInColumn(field, cell) && !this.hasValueInGroup(field, cell)) {
                field[emptyY][emptyX] = cell;

                // TODO: We can shuffle filling values to better randomize puzzle generation
                if (this.fillRecursive(field, values)) {
                    return true;
                }

                field[emptyY][emptyX].value = this.config.blankCellValue;
            }
        }

        return false;
    }

    private getGroupCoordinates(cell: CellInterface): { startY: number; startX: number; endY: number; endX: number } {
        // TODO: To optimize we potentially can precalculate all groups coordinates once
        const startY = cell.y - (cell.y % this.config.fieldGroupHeight);
        const startX = cell.x - (cell.x % this.config.fieldGroupWidth);
        const endY = startY + this.config.fieldGroupHeight;
        const endX = startX + this.config.fieldGroupWidth;

        return { startY, startX, endY, endX };
    }

    private hasBlankCells(field: FieldInterface): [hasBlankCells: boolean, lastY: number, lastX: number] {
        let y = 0;
        let x = 0;

        for (y = 0; y < field.length; y += 1) {
            for (x = 0; x < field[y].length; x += 1) {
                if (this.isBlankCell(field[y][x])) {
                    return [true, y, x];
                }
            }
        }

        return [false, y, x];
    }

    private hasValueInRow(field: FieldInterface, cell: CellInterface): boolean {
        for (let x = 0; x < this.config.fieldSize; x += 1) {
            if (this.isSameCellValue(field[cell.y][x], cell)) {
                return true;
            }
        }

        return false;
    }

    private hasValueInColumn(field: FieldInterface, cell: CellInterface): boolean {
        for (const row of field) {
            if (this.isSameCellValue(row[cell.x], cell)) {
                return true;
            }
        }

        return false;
    }

    private hasValueInGroup(field: FieldInterface, cell: CellInterface): boolean {
        const { startY, startX } = this.getGroupCoordinates(cell);

        for (let y = 0; y < this.config.fieldGroupHeight; y += 1) {
            for (let x = 0; x < this.config.fieldGroupWidth; x += 1) {
                if (this.isSameCellValue(field[y + startY][x + startX], cell)) {
                    return true;
                }
            }
        }

        return false;
    }
}
