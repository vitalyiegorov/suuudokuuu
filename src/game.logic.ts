import { isDefined } from '@rnw-community/shared';

import { BlankCellValueConstant, type CellInterface, type FieldInterface } from './game';
import { type ScoredCellsInterface } from './game/interfaces/scored-cells.interface';
import { createCell } from './game/utils/create-cell.util';

type AvailableValues = Record<number, number>;

export class GameLogic {
    private readonly emptyStringValue = '.';
    private readonly blankCellValue = BlankCellValueConstant;

    private readonly fieldSize: number;
    private readonly fieldGroupWidth: number;
    private readonly fieldGroupHeight: number;
    private readonly fieldFillingValues: number[];

    public field: FieldInterface = [];
    public availableValues: AvailableValues = {};
    public possibleValues: number[] = [];

    constructor(fieldSize: number, fieldGroupWidth: number, fieldGroupHeight: number) {
        this.fieldSize = fieldSize;
        this.fieldGroupWidth = fieldGroupWidth;
        this.fieldGroupHeight = fieldGroupHeight;

        // TODO: Is there a better way to randomize array of numbers in JS? =)
        this.fieldFillingValues = Array.from({ length: this.fieldSize }, (_, i) => i + 1);
        for (let i = this.fieldFillingValues.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.fieldFillingValues[i], this.fieldFillingValues[j]] = [this.fieldFillingValues[j], this.fieldFillingValues[i]];
        }

        this.createEmptyField();
    }

    setCellValue(y: number, x: number, value: number): ScoredCellsInterface {
        const scoredCells: ScoredCellsInterface = { x: 0, y: 0, group: 0, values: [] };

        if (this.field[y][x].value === value) {
            this.field[y][x].value = value;
            const cell = this.field[y][x];

            this.availableValues[value] = this.availableValues[value]--;
            this.calculatePossibleValues();

            if (!this.hasValueInColumn(this.field[y][x])) {
                scoredCells.x = x;
            }

            if (!this.hasValueInRow(cell)) {
                scoredCells.y = y;
            }

            if (!this.hasValueInGroup(cell)) {
                scoredCells.group = cell.group;
            }

            if (!this.possibleValues.includes(value)) {
                scoredCells.values = [value];
            }

            if (!this.hasBlankCells()[0]) {
                scoredCells.values = this.fieldFillingValues;
            }

            return scoredCells;
        } else {
            throw new Error('Cell value is wrong');
        }
    }

    toString(): string {
        return this.field
            .map(row => row.map(cell => (cell.value === this.blankCellValue ? this.emptyStringValue : cell.value)).join(''))
            .join('');
    }

    hasBlankCells(): [hasBlankCells: boolean, lastY: number, lastX: number] {
        let y = 0;
        let x = 0;

        for (y = 0; y < this.field.length; y++) {
            for (x = 0; x < this.field[y].length; x++) {
                if (this.field[y][x].value === this.blankCellValue) {
                    return [true, y, x];
                }
            }
        }

        return [false, y, x];
    }

    hasValueInRow(cell: CellInterface): boolean {
        for (let x = 0; x < this.field.length; x++) {
            if (this.field[cell.y][x].value === cell.value) {
                return true;
            }
        }

        return false;
    }

    hasValueInColumn(cell: CellInterface): boolean {
        for (let y = 0; y < this.field.length; y++) {
            if (this.field[y][cell.x].value === cell.value) {
                return true;
            }
        }

        return false;
    }

    hasValueInGroup(cell: CellInterface): boolean {
        const boxStartY = cell.y - (cell.y % this.fieldGroupHeight);
        const boxStartX = cell.x - (cell.x % this.fieldGroupWidth);

        for (let y = 0; y < this.fieldGroupHeight; y++) {
            for (let x = 0; x < this.fieldGroupWidth; x++) {
                if (this.field[y + boxStartY][x + boxStartX].value === cell.value) {
                    return true;
                }
            }
        }

        return false;
    }

    fill(): void {
        if (this.fillRecursive()) {
            throw new Error('Unable to create a game field');
        }

        this.calculateAvailableValues();
    }

    private calculatePossibleValues(): void {
        this.possibleValues = Object.keys(this.availableValues)
            .map(Number)
            .filter(key => this.availableValues[key] > 0)
            .map(key => this.availableValues[key]);
    }

    private fillRecursive(): boolean {
        const [needsFilling, y, x] = this.hasBlankCells();

        if (!needsFilling) {
            return true;
        }

        for (const value of this.fieldFillingValues) {
            const newCell: CellInterface = createCell(x, y, value);

            if (!this.hasValueInRow(newCell) && !this.hasValueInColumn(newCell) && !this.hasValueInGroup(newCell)) {
                this.field[y][x] = newCell;

                if (this.fillRecursive()) {
                    return true;
                }

                this.field[y][x].value = this.blankCellValue;
            }
        }

        return false;
    }

    private calculateAvailableValues(): void {
        this.availableValues = {};

        for (let y = 0; y < this.field.length; y++) {
            for (let x = 0; x < this.field[y].length; x++) {
                const value = this.field[y][x].value;
                if (value !== this.blankCellValue) {
                    this.availableValues[value] = isDefined(this.availableValues[value]) ? this.availableValues[value] + 1 : 1;
                }
            }
        }
    }

    private createEmptyField() {
        this.field = Array.from({ length: this.fieldSize }, (_, y) =>
            Array.from({ length: this.fieldSize }, (_, x) => ({
                y,
                x,
                value: this.blankCellValue,
                group: Math.floor(x / this.fieldGroupWidth) * this.fieldGroupWidth + Math.floor(y / this.fieldGroupHeight) + 1
            }))
        );
    }

    static fromString(fieldString: string, fieldSize: number, fieldGroupWidth: number, fieldGroupHeight: number): GameLogic {
        const gameLogic = new GameLogic(fieldSize, fieldGroupWidth, fieldGroupHeight);

        fieldString.split('').reduce((acc, stringValue, index) => {
            const x = index % gameLogic.fieldSize;
            const y = Math.floor(index / gameLogic.fieldSize);
            const value = stringValue === gameLogic.emptyStringValue ? gameLogic.blankCellValue : parseInt(stringValue, 10);

            acc[y][x] = { ...acc[y][x], value };

            return acc;
        }, gameLogic.field);

        gameLogic.calculateAvailableValues();

        return gameLogic;
    }
}
