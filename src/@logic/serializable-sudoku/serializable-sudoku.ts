import { isNotEmptyString } from '@rnw-community/shared';

import { type FieldInterface } from '../interfaces/field.interface';
import { type SudokuConfigInterface } from '../interfaces/sudoku-config.interface';

/**
 * HINT: Serialization inspired from https://github.com/robatron/sudoku.js
 */
export class SerializableSudoku {
    private readonly emptyStringValue: string = '.';
    private readonly fieldSeparator: string = '|';

    protected readonly blankCellValue: number;
    protected readonly fieldSize: number;
    protected readonly fieldGroupWidth: number;
    protected readonly fieldGroupHeight: number;

    protected field: FieldInterface = [];
    protected gameField: FieldInterface = [];

    get FullField(): FieldInterface {
        return this.field;
    }

    get Field(): FieldInterface {
        return this.gameField;
    }

    constructor(config: SudokuConfigInterface) {
        this.fieldSize = config.fieldSize;
        this.fieldGroupWidth = config.fieldGroupWidth;
        this.fieldGroupHeight = config.fieldGroupHeight;
        this.blankCellValue = config.blankCellValue;
    }

    toString(): string {
        const convertField = (field: FieldInterface) =>
            field.map(row => row.map(cell => (cell.value === this.blankCellValue ? this.emptyStringValue : cell.value)).join('')).join('');

        return `${convertField(this.field)}|${convertField(this.gameField)}`;
    }

    protected createEmptyField(): FieldInterface {
        return Array.from({ length: this.fieldSize }, (_, y) =>
            Array.from({ length: this.fieldSize }, (_, x) => ({
                y,
                x,
                value: this.blankCellValue,
                group: Math.floor(x / this.fieldGroupWidth) * this.fieldGroupWidth + Math.floor(y / this.fieldGroupHeight) + 1
            }))
        );
    }

    private convertFieldFromString(fieldString: string, field: FieldInterface): FieldInterface {
        return fieldString.split('').reduce((acc, stringValue, index) => {
            const x = index % this.fieldSize;
            const y = Math.floor(index / this.fieldSize);
            const value = stringValue === this.emptyStringValue ? this.blankCellValue : parseInt(stringValue, 10);

            acc[y][x] = { ...acc[y][x], value };

            return acc;
        }, field);
    }

    static fromString(fieldsString: string, config: SudokuConfigInterface): SerializableSudoku {
        const gameLogic = new SerializableSudoku(config);

        if (!isNotEmptyString(fieldsString)) {
            throw new Error('Invalid string format: Empty string passed');
        }

        const correctLength = gameLogic.fieldSize * gameLogic.fieldSize * 2 + gameLogic.fieldSeparator.length;
        if (fieldsString.length !== correctLength) {
            throw new Error(
                `Invalid string format: String length is wrong for the given configuration(${fieldsString.length}/${correctLength})})`
            );
        }

        if (!fieldsString.includes(gameLogic.fieldSeparator)) {
            throw new Error('Invalid string format: No field separator found');
        }

        const [fieldString, gameFieldString] = fieldsString.split(gameLogic.fieldSeparator);

        gameLogic.field = gameLogic.createEmptyField();
        gameLogic.gameField = gameLogic.createEmptyField();

        gameLogic.convertFieldFromString(fieldString, gameLogic.field);
        gameLogic.convertFieldFromString(gameFieldString, gameLogic.gameField);

        return gameLogic;
    }
}
