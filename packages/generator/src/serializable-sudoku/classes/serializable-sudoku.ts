import { GRID_SIZE } from '@suuudokuuu/solver-core';
import { DLXSolver } from '@suuudokuuu/solver-dlx';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { DifficultyEnum } from '../../@generic/enums/difficulty.enum';
import { defaultSudokuConfig } from '../../@generic/interfaces/sudoku-config.interface';
import { cloneField } from '../../@generic/utils/clone-field.util';
import { createEmptyField } from '../../@generic/utils/create-empty-field.util';
import { fieldToGrid } from '../../@generic/utils/field-to-grid.util';

import type { CellInterface } from '../../@generic/interfaces/cell.interface';
import type { FieldInterface } from '../../@generic/interfaces/field.interface';
import type { SudokuConfigInterface } from '../../@generic/interfaces/sudoku-config.interface';
import type { AvailableValuesType } from '../../@generic/types/available-values.type';

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
            if (config.difficultyBlankCells[difficulty] >= blankCellCount) {
                foundDifficulty = difficulty;
                break;
            }
        }

        return [field, foundDifficulty] as const;
    }

    static fromStrings<T extends SerializableSudoku>(
        this: new (config?: SudokuConfigInterface) => T,
        config: SudokuConfigInterface = defaultSudokuConfig,
        ...fieldStrings: string[]
    ): T {
        return SerializableSudoku.populateFromString(new this(config), fieldStrings.join(''), config);
    }

    static fromString<T extends SerializableSudoku>(
        this: new (config?: SudokuConfigInterface) => T,
        fieldString: string,
        config: SudokuConfigInterface = defaultSudokuConfig
    ): T {
        return SerializableSudoku.populateFromString(new this(config), fieldString, config);
    }

    protected static populateFromString<T extends SerializableSudoku>(game: T, fieldString: string, config: SudokuConfigInterface): T {
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
        const solvedGrid = new DLXSolver().solve(fieldToGrid(gameField));
        if (!isDefined(solvedGrid)) {
            throw new Error('Invalid string format: No solution found for the given field');
        }

        game.field = SerializableSudoku.applySolvedGrid(gameField, solvedGrid);
        game.gameField = gameField;
        game.config.difficulty = difficulty;
        game.calculateAvailableValues();

        return game;
    }

    private static applySolvedGrid(field: FieldInterface, grid: Uint8Array): FieldInterface {
        const solvedField = cloneField(field);

        for (let y = 0; y < GRID_SIZE; y += 1) {
            for (let x = 0; x < GRID_SIZE; x += 1) {
                solvedField[y][x].value = grid[y * GRID_SIZE + x];
            }
        }

        return solvedField;
    }
}
