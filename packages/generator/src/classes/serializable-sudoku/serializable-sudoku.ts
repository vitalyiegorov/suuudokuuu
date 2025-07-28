import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { DifficultyEnum } from '../../enums/difficulty.enum';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';
import { createEmptyField } from '../../util/create-empty-field.util';
import { DLXSolver } from '../dlx/dlx-solver';

import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';
import type { AvailableValuesType } from '../../types/available-values.type';

/** HINT: Serialization inspired from https://github.com/robatron/sudoku.js */
export class SerializableSudoku {
    private static readonly emptyStringValue: string = '.';

    protected field: FieldInterface = [];
    protected gameField: FieldInterface = [];
    protected availableValues: AvailableValuesType = {};
    protected possibleValues: number[] = [];

    protected readonly emptyField: FieldInterface = [];

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
                .map(row =>
                    row.map(cell => (cell.value === this.config.blankCellValue ? SerializableSudoku.emptyStringValue : cell.value)).join('')
                )
                .join('');

        return convertField(this.gameField);
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

    static convertFieldFromString(fieldString: string, config: SudokuConfigInterface): [field: FieldInterface, difficulty: DifficultyEnum] {
        let blankCellCount = 0;

        const field = createEmptyField(config);
        fieldString.split('').reduce((acc, stringValue, index) => {
            const x = index % config.fieldSize;
            const y = Math.floor(index / config.fieldSize);
            const value = stringValue === SerializableSudoku.emptyStringValue ? config.blankCellValue : parseInt(stringValue, 10);

            acc[y][x] = { ...acc[y][x], value };

            if (value === config.blankCellValue) {
                blankCellCount += 1;
            }

            return acc;
        }, field);

        let foundDifficulty = DifficultyEnum.Newbie;
        for (const difficulty of Object.values(DifficultyEnum)) {
            if (config.difficultyBlankCells[difficulty] <= blankCellCount / (config.fieldSize * config.fieldSize)) {
                foundDifficulty = difficulty;
                break;
            }
        }

        return [field, foundDifficulty] as const;
    }

    // eslint-disable-next-line max-statements
    static fromString(fieldString: string, config: SudokuConfigInterface = defaultSudokuConfig): SerializableSudoku {
        const game = new this(config);

        if (!isNotEmptyString(fieldString)) {
            throw new Error('Invalid string format: Empty string passed');
        }

        const correctLength = game.config.fieldSize * game.config.fieldSize;
        if (fieldString.length !== correctLength) {
            throw new Error(
                `Invalid string format: String length is wrong for the given configuration(${fieldString.length}/${correctLength})})`
            );
        }

        const [gameField, difficulty] = SerializableSudoku.convertFieldFromString(fieldString, config);
        const field = new DLXSolver().solve(gameField);
        if (!isDefined(field)) {
            throw new Error('Invalid string format: No solution found for the given field');
        }

        game.field = field;
        game.gameField = gameField;
        game.config.difficulty = difficulty;
        game.calculateAvailableValues();

        return game;
    }
}
