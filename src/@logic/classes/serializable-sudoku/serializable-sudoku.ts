import { isNotEmptyString } from '@rnw-community/shared';

import { DifficultyEnum } from '../../../@generic/enums/difficulty.enum';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';
import { type AvailableValuesType } from '../../types/available-values.type';

/**
 * HINT: Serialization inspired from https://github.com/robatron/sudoku.js
 */
export class SerializableSudoku {
    protected field: FieldInterface = [];
    protected gameField: FieldInterface = [];
    protected availableValues: AvailableValuesType = {};
    protected possibleValues: number[] = [];

    private readonly emptyStringValue: string = '.';
    private readonly fieldSeparator: string = '|';

    constructor(protected readonly config: SudokuConfigInterface) {}

    get FullField(): FieldInterface {
        return this.field;
    }

    get Field(): FieldInterface {
        return this.gameField;
    }

    // eslint-disable-next-line max-statements
    static fromString(fieldsString: string, config: SudokuConfigInterface) {
        const game = new this(config);

        if (!isNotEmptyString(fieldsString)) {
            throw new Error('Invalid string format: Empty string passed');
        }

        const correctLength = game.config.fieldSize * game.config.fieldSize * 2 + game.fieldSeparator.length;
        if (fieldsString.length !== correctLength) {
            throw new Error(
                `Invalid string format: String length is wrong for the given configuration(${fieldsString.length}/${correctLength})})`
            );
        }

        if (!fieldsString.includes(game.fieldSeparator)) {
            throw new Error('Invalid string format: No field separator found');
        }

        const [fieldString, gameFieldString] = fieldsString.split(game.fieldSeparator);

        game.field = game.createEmptyField();
        game.gameField = game.cloneField(game.field);

        game.convertFieldFromString(fieldString, game.field);
        const blankCellCount = game.convertFieldFromString(gameFieldString, game.gameField);

        // TODO: Do we need it here?
        game.getDifficultyByBlankCells(blankCellCount);

        return game;
    }

    toString(): string {
        const convertField = (field: FieldInterface) =>
            field
                .map(row => row.map(cell => (cell.value === this.config.blankCellValue ? this.emptyStringValue : cell.value)).join(''))
                .join('');

        return `${convertField(this.field)}|${convertField(this.gameField)}`;
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

    private getDifficultyByBlankCells(blankCellCount: number): DifficultyEnum {
        for (const difficulty of Object.values(DifficultyEnum)) {
            if (
                this.config.difficultyBlankCellsPercentage[difficulty] <=
                blankCellCount / (this.config.fieldSize * this.config.fieldSize)
            ) {
                return difficulty;
            }
        }

        throw new Error('Cannot identify difficulty by blank cells count');
    }

    private convertFieldFromString(fieldString: string, field: FieldInterface): number {
        let blankCellCount = 0;

        fieldString.split('').reduce((acc, stringValue, index) => {
            const x = index % this.config.fieldSize;
            const y = Math.floor(index / this.config.fieldSize);
            const value = stringValue === this.emptyStringValue ? this.config.blankCellValue : parseInt(stringValue, 10);

            acc[y][x] = { ...acc[y][x], value };

            if (value === this.config.blankCellValue) {
                blankCellCount += 1;
            }

            return acc;
        }, field);

        return blankCellCount;
    }
}
