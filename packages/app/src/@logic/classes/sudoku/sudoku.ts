import { isDefined } from '@rnw-community/shared';

import { type ScoredCellsInterface, emptyScoredCells } from '../../interfaces/scored-cells.interface';
import { SerializableSudoku } from '../serializable-sudoku/serializable-sudoku';
import { SudokuScoring } from '../sudoku-scoring/sudoku-scoring';

import type { DifficultyEnum } from '../../../@generic/enums/difficulty.enum';
import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';


// TODO: We can split this class into rules validator(or similar)
export class Sudoku extends SerializableSudoku {
    private readonly fieldFillingValues: number[];
    private readonly scoring: SudokuScoring;

    constructor(config: SudokuConfigInterface, scoring: SudokuScoring = new SudokuScoring(config.score)) {
        super(config);

        this.scoring = scoring;

        // TODO: Is there a better way to randomize array of numbers in JS? =)
        this.fieldFillingValues = Array.from({ length: this.fieldSize }, (_, i) => i + 1);
        for (let i = this.fieldFillingValues.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.fieldFillingValues[i], this.fieldFillingValues[j]] = [this.fieldFillingValues[j], this.fieldFillingValues[i]];
        }
    }

    create(difficulty: DifficultyEnum): void {
        this.difficulty = difficulty;
        this.field = this.createEmptyField();

        if (!this.fillRecursive()) {
            throw new Error('Unable to create a game field');
        }

        const getRandomPosition = (): number => Math.floor(Math.random() * this.fieldSize);

        const blankCellsCount = Math.ceil(this.config.difficultyBlankCellsPercentage[difficulty] * this.fieldSize * this.fieldSize);
        this.gameField = this.cloneField(this.field);

        // TODO: Can we improve this logic to make it more unique??
        for (let i = 0; i < blankCellsCount; i += 1) {
            this.gameField[getRandomPosition()][getRandomPosition()].value = this.blankCellValue;
        }

        this.calculateAvailableValues();
        this.calculatePossibleValues();
    }

    getScore(scoredCells: ScoredCellsInterface, elapsedTime: number, mistakes: number): number {
        return this.scoring.calculate(this.difficulty, scoredCells, mistakes, elapsedTime);
    }

    getValueProgress(value: number): number {
        return this.availableValues[value].progress;
    }

    getCorrectValue(cell?: CellInterface): number {
        return isDefined(cell) ? this.field[cell.y][cell.x].value : this.blankCellValue;
    }

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    isCellHighlighted(cell: CellInterface, selectedCell?: CellInterface): boolean {
        return isDefined(selectedCell) && (selectedCell.x === cell.x || selectedCell.y === cell.y || selectedCell.group === cell.group);
    }

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    isSameCell(cell: CellInterface, selectedCell?: CellInterface): boolean {
        return isDefined(selectedCell) && cell.x === selectedCell.x && cell.y === selectedCell.y;
    }

    isSameCellValue(cell: CellInterface, selectedCell?: CellInterface): boolean {
        return isDefined(selectedCell) && cell.value === selectedCell.value && cell.value !== this.blankCellValue;
    }

    isCorrectValue(cell?: CellInterface): boolean {
        return isDefined(cell) && this.field[cell.y][cell.x].value === cell.value;
    }

    isValueAvailable(cell?: CellInterface): boolean {
        return isDefined(cell) && isDefined(this.availableValues[cell.value]) && this.availableValues[cell.value].count < this.fieldSize;
    }

    isLastInCellGroupX(cell: CellInterface): boolean {
        return cell.x < this.fieldSize - 1 && (cell.x + 1) % this.fieldGroupWidth === 0;
    }

    isLastInCellGroupY(cell: CellInterface): boolean {
        return cell.y < this.fieldSize - 1 && (cell.y + 1) % this.fieldGroupHeight === 0;
    }

    isBlankCell(cell?: CellInterface): boolean {
        return isDefined(cell) && this.gameField[cell.y][cell.x].value === this.blankCellValue;
    }

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    isScoredCell(cell: CellInterface, scoredCell: ScoredCellsInterface): boolean {
        return (
            scoredCell.isWon ||
            scoredCell.x === cell.x ||
            scoredCell.y === cell.y ||
            scoredCell.group === cell.group ||
            scoredCell.values.includes(cell.value)
        );
    }

    // eslint-disable-next-line max-statements
    setCellValue(cell: CellInterface): ScoredCellsInterface {
        const scoredCells = { ...emptyScoredCells };
        if (this.isCorrectValue(cell)) {
            this.gameField[cell.y][cell.x].value = cell.value;
            const blankCell = { ...cell, value: this.blankCellValue };

            this.calculateAvailableValues();
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
                scoredCells.isWon = true;
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

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
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

    /**
     * TODO: Can we improve generation speed? =)
     * HINT: This algorithm is based on backtracking
     * inspired by https://dev.to/christinamcmahon/use-backtracking-algorithm-to-solve-sudoku-270
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

    // TODO: Can we avoid it and just use parent version with correct types?
    static override fromString(fieldsString: string, config: SudokuConfigInterface): Sudoku {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        return super.fromString(fieldsString, config) as Sudoku;
    }
}
