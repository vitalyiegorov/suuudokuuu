import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { DifficultyEnum } from '../../enums/difficulty.enum';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';
import { cloneField } from '../../util/clone-field.util';
import { createEmptyField } from '../../util/create-empty-field.util';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';
import type { AvailableValuesType } from '../../types/available-values.type';

/** HINT: Serialization inspired from https://github.com/robatron/sudoku.js */
export class SerializableSudoku {
    protected field: FieldInterface = [];
    protected gameField: FieldInterface = [];
    protected availableValues: AvailableValuesType = {};
    protected possibleValues: number[] = [];

    protected readonly emptyField: FieldInterface = [];

    private readonly emptyStringValue: string = '.';
    private readonly fieldSeparator: string = '|';

    constructor(protected config: SudokuConfigInterface = defaultSudokuConfig) {
        this.emptyField = createEmptyField(this.config);
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
        return this.config.difficulty;
    }

    getValueProgress(value: number): number {
        return this.availableValues[value].progress;
    }

    isValueAvailable(cell?: CellInterface): boolean {
        return (
            isDefined(cell) && isDefined(this.availableValues[cell.value]) && this.availableValues[cell.value].count < this.config.fieldSize
        );
    }

    toString(): string {
        const convertField = (field: FieldInterface): string =>
            field
                .map(row => row.map(cell => (cell.value === this.config.blankCellValue ? this.emptyStringValue : cell.value)).join(''))
                .join('');

        return `${convertField(this.field)}|${convertField(this.gameField)}`;
    }

    protected calculateAvailableValues(): void {
        const getValueProgress = (count: number): number => (count / this.config.fieldSize) * 100;

        this.availableValues = Array.from({ length: this.config.fieldSize }).reduce<AvailableValuesType>(
            (acc, _, index) => ({
                ...acc,
                [index + 1]: { count: 0, progress: 0 }
            }),
            {}
        );

        // TODO: Can we optimize and not recalculate full object every time?
        for (const row of this.gameField) {
            for (const { value } of row) {
                if (value !== this.config.blankCellValue) {
                    this.availableValues[value].count += 1;
                    this.availableValues[value].progress = getValueProgress(this.availableValues[value].count);
                }
            }
        }

        this.possibleValues = Object.keys(this.availableValues)
            .map(Number)
            .filter(key => this.availableValues[key].count < this.config.fieldSize)
            .map(key => key);
    }

    private setDifficultyByBlankCells(blankCellCount: number): void {
        for (const difficulty of Object.values(DifficultyEnum)) {
            if (this.config.difficultyBlankCells[difficulty] <= blankCellCount / (this.config.fieldSize * this.config.fieldSize)) {
                this.config.difficulty = difficulty;
                break;
            }
        }
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

    // eslint-disable-next-line max-statements
    static fromString(fieldsString: string, config: SudokuConfigInterface = defaultSudokuConfig): SerializableSudoku {
        const game = new this(config);
        game.field = cloneField(game.emptyField);
        game.gameField = cloneField(game.emptyField);

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
        game.convertFieldFromString(fieldString, game.field);
        const blankCellCount = game.convertFieldFromString(gameFieldString, game.gameField);

        game.setDifficultyByBlankCells(blankCellCount);
        game.calculateAvailableValues();

        return game;
    }
}
