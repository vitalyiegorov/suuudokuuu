import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { DifficultyEnum } from '../../../@generic/enums/difficulty.enum';


import type { FieldInterface } from '../../interfaces/field.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';
import type { AvailableValuesType } from '../../types/available-values.type';

/**
 * HINT: Serialization inspired from https://github.com/robatron/sudoku.js
 */
export class SerializableSudoku {
    protected readonly blankCellValue: number;
    protected readonly fieldSize: number;
    protected readonly fieldGroupWidth: number;
    protected readonly fieldGroupHeight: number;

    protected difficulty: DifficultyEnum;
    protected field: FieldInterface = [];
    protected gameField: FieldInterface = [];
    protected availableValues: AvailableValuesType = {};
    protected possibleValues: number[] = [];

    private readonly emptyStringValue: string = '.';
    private readonly fieldSeparator: string = '|';

    constructor(protected readonly config: SudokuConfigInterface) {
        this.fieldSize = config.fieldSize;
        this.fieldGroupWidth = config.fieldGroupWidth;
        this.fieldGroupHeight = config.fieldGroupHeight;
        this.blankCellValue = config.blankCellValue;
        this.difficulty = config.difficulty;
    }

    get FullField(): FieldInterface {
        return this.field;
    }

    get Field(): FieldInterface {
        return this.gameField;
    }

    get PossibleValues(): number[] {
        return this.possibleValues;
    }

    get Difficulty(): DifficultyEnum {
        return this.difficulty;
    }

    toString(): string {
        const convertField = (field: FieldInterface) =>
            field.map(row => row.map(cell => (cell.value === this.blankCellValue ? this.emptyStringValue : cell.value)).join('')).join('');

        return `${convertField(this.field)}|${convertField(this.gameField)}`;
    }

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    protected cloneField(field: FieldInterface): FieldInterface {
        return field.map(row => row.map(cell => ({ ...cell })));
    }

    protected calculateAvailableValues(): void {
        const getValueProgress = (count: number) => (count / this.fieldSize) * 100;

        // TODO: Can we optimize and not recalculate full object every time?
        this.availableValues = {};
        for (const row of this.gameField) {
            for (const col of row) {
                const { value } = col;
                if (value !== this.blankCellValue) {
                    if (isDefined(this.availableValues[value])) {
                        this.availableValues[value].count += 1;
                        this.availableValues[value].progress = getValueProgress(this.availableValues[value].count);
                    } else {
                        this.availableValues[value] = { count: 1, progress: getValueProgress(1) };
                    }
                }
            }
        }
    }

    protected calculatePossibleValues(): void {
        this.possibleValues = Object.keys(this.availableValues)
            .map(Number)
            .filter(key => this.availableValues[key].count < this.fieldSize)
            .map(key => key);
    }

    protected createEmptyField(): FieldInterface {
        return Array.from({ length: this.fieldSize }, (_, y) =>
            Array.from({ length: this.fieldSize }, (__, x) => ({
                y,
                x,
                value: this.blankCellValue,
                group: Math.floor(x / this.fieldGroupWidth) * this.fieldGroupWidth + Math.floor(y / this.fieldGroupHeight) + 1
            }))
        );
    }

    private setDifficultyByBlankCells(blankCellCount: number): void {
        for (const difficulty of Object.values(DifficultyEnum)) {
            if (this.config.difficultyBlankCellsPercentage[difficulty] <= blankCellCount / (this.fieldSize * this.fieldSize)) {
                this.difficulty = difficulty;
                break;
            }
        }
    }

    private convertFieldFromString(fieldString: string, field: FieldInterface): number {
        let blankCellCount = 0;

        fieldString.split('').reduce((acc, stringValue, index) => {
            const x = index % this.fieldSize;
            const y = Math.floor(index / this.fieldSize);
            const value = stringValue === this.emptyStringValue ? this.blankCellValue : parseInt(stringValue, 10);

            acc[y][x] = { ...acc[y][x], value };

            if (value === this.blankCellValue) {
                blankCellCount += 1;
            }

            return acc;
        }, field);

        return blankCellCount;
    }

    // eslint-disable-next-line max-statements
    static fromString(fieldsString: string, config: SudokuConfigInterface) {
        const game = new this(config);

        if (!isNotEmptyString(fieldsString)) {
            throw new Error('Invalid string format: Empty string passed');
        }

        const correctLength = game.fieldSize * game.fieldSize * 2 + game.fieldSeparator.length;
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
        game.setDifficultyByBlankCells(blankCellCount);

        game.calculateAvailableValues();
        game.calculatePossibleValues();

        return game;
    }
}
