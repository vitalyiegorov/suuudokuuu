import { type Observable, Subject, distinctUntilChanged, filter, interval, scan, takeWhile, withLatestFrom } from 'rxjs';

import { type OnEventFn, isDefined } from '@rnw-community/shared';

import { type DifficultyEnum } from '../../../@generic/enums/difficulty.enum';
import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import { type ScoredCellsInterface, emptyScoredCells } from '../../interfaces/scored-cells.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';
import { type SudokuState } from '../../interfaces/sudoku-state.interface';
import { type AvailableValuesType } from '../../types/available-values.type';
import { SerializableSudoku } from '../serializable-sudoku/serializable-sudoku';
import { SudokuScoring } from '../sudoku-scoring/sudoku-scoring';

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

    // TODO: Can we avoid it and just use parent version with correct types?
    static override fromString(fieldsString: string, config: SudokuConfigInterface): Sudoku {
        return super.fromString(fieldsString, config) as Sudoku;
    }

    start$(difficulty: DifficultyEnum): [move: OnEventFn<CellInterface | undefined>, gameState$: Observable<SudokuState>] {
        const valueSelected$ = new Subject<CellInterface | undefined>();
        const [field, gameField, availableValues, possibleValues] = this.create(difficulty);

        const initialState: SudokuState = {
            field,
            gameField,
            availableValues,
            // TODO: Do we really need both in the state?
            possibleValues,
            // TODO: We should set from parsed string
            elapsedSeconds: 0,
            // TODO: We should set from parsed string
            mistakes: 0,
            // TODO: We should set from parsed string
            score: 0,
            // TODO: We should set from config or parsed string
            maxMistakes: 3,
            // TODO: We should calculate this value
            emptyCells: this.fieldSize * this.fieldSize
        };

        // TODO: Add pausing and resuming
        const secondsTicks$ = interval(1000).pipe(scan(state => state + 1, initialState.elapsedSeconds));
        // HINT: We process only selected non-blank cells
        const selectValue$ = valueSelected$.pipe(
            filter(isDefined),
            filter(cell => !this.isBlankCell(cell))
        );

        const subscription = secondsTicks$.pipe(
            withLatestFrom(selectValue$, (elapsedSeconds, cell) => ({ cell, elapsedSeconds })),
            // HINT: This will prevent emitting same cell with same value twice, maybe there is a better way to timer to tick and catch selectValue$ emit??
            distinctUntilChanged(({ cell: prev }, { cell: curr }) => this.isSameCell(prev, curr) && this.isSameCellValue(prev, curr)),
            scan((state, { cell, elapsedSeconds }) => {
                if (this.isCorrectValue(state.field, cell)) {
                    const scoredCells = this.getScoredValues(state.gameField, cell);

                    return {
                        ...state,
                        elapsedSeconds,
                        emptyCells: state.emptyCells - 1,
                        // TODO: This can be improved by decreasing initial object, instead of recalculating
                        availableValues: this.calculateAvailableValues(),
                        possibleValues: this.calculatePossibleValues(),
                        // TODO: We need to add elapsed time calculation(timeInterval operator?)
                        score: this.scoring.calculate(this.difficulty, scoredCells, state.mistakes, 0)
                    };
                }

                return {
                    ...state,
                    mistakes: state.mistakes + 1
                };
            }, initialState),
            takeWhile(({ mistakes, maxMistakes, emptyCells }) => emptyCells === 0 || mistakes < maxMistakes)
        );

        return [(value: CellInterface | undefined) => void valueSelected$.next(value), subscription];
    }

    create(difficulty: DifficultyEnum): [FieldInterface, FieldInterface, AvailableValuesType, number[]] {
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

        return [this.field, this.gameField, this.availableValues, this.possibleValues];
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

    // eslint-disable-next-line class-methods-use-this
    isCellHighlighted(cell: CellInterface, selectedCell?: CellInterface): boolean {
        return isDefined(selectedCell) && (selectedCell.x === cell.x || selectedCell.y === cell.y || selectedCell.group === cell.group);
    }

    // eslint-disable-next-line class-methods-use-this
    isSameCell(cell: CellInterface, selectedCell?: CellInterface): boolean {
        return isDefined(selectedCell) && cell.x === selectedCell.x && cell.y === selectedCell.y;
    }

    isSameCellValue(cell: CellInterface, selectedCell?: CellInterface): boolean {
        return isDefined(selectedCell) && cell.value === selectedCell.value && cell.value !== this.blankCellValue;
    }

    // eslint-disable-next-line class-methods-use-this
    isCorrectValue(fullField: FieldInterface, cell?: CellInterface): boolean {
        return isDefined(cell) && fullField[cell.y][cell.x].value === cell.value;
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

    // eslint-disable-next-line class-methods-use-this
    isScoredCell(cell: CellInterface, scoredCell: ScoredCellsInterface): boolean {
        return (
            scoredCell.isWon ||
            scoredCell.x === cell.x ||
            scoredCell.y === cell.y ||
            scoredCell.group === cell.group ||
            scoredCell.values.includes(cell.value)
        );
    }

    /**
     * Optimized cell scored types algorithm.
     * We check all scoring types in one nested loop.
     */
    // eslint-disable-next-line max-statements
    getScoredValues(gameField: FieldInterface, cell: CellInterface): ScoredCellsInterface {
        // HINT: To define scored types, we start by considering all types as scored
        const scoredCells: ScoredCellsInterface = {
            ...emptyScoredCells,
            x: cell.x,
            y: cell.y,
            group: cell.group,
            values: [cell.value],
            isWon: true
        };

        let valueCount = 0;

        // HINT: We iterate over all cells to check for blank cells in a specific types of cell grouping
        for (let y = 0; y < this.fieldSize; y += 1) {
            // HINT: If there is a blank value in a column, then column is not scored
            if (this.isBlankCell(gameField[y][cell.x])) {
                scoredCells.x = emptyScoredCells.x;
            }

            for (let x = 0; x < this.fieldSize; x += 1) {
                // HINT: If there is a blank value in a row, then row is not scored
                if (this.isBlankCell(gameField[cell.y][x])) {
                    scoredCells.y = emptyScoredCells.y;
                }

                // HINT: If there are any other blank values, it is not a win
                if (this.isBlankCell(gameField[y][x])) {
                    scoredCells.isWon = false;

                    // HINT: If there is a blank value in a group, then group is not scored
                    if (this.isCoordinatesInGroup(cell, y, x)) {
                        scoredCells.group = emptyScoredCells.group;
                    }
                } else if (this.isSameCellValue(cell, gameField[y][x])) {
                    valueCount += 1;
                }
            }

            // HINT: Early exit if all types are not scored
            if (
                scoredCells.y === emptyScoredCells.y &&
                scoredCells.x === emptyScoredCells.x &&
                scoredCells.group === emptyScoredCells.group
            ) {
                break;
            }
        }

        // HINT: If there are fewer values than field size, then all values is not scored
        if (valueCount < this.fieldSize) {
            scoredCells.values = [];
            scoredCells.isWon = false;
        }

        if (scoredCells.isWon) {
            scoredCells.values = Array.from({ length: this.fieldSize }, (_, i) => i + 1);
        }

        return scoredCells;
    }

    // eslint-disable-next-line max-statements
    setCellValue(field: FieldInterface, cell: CellInterface): ScoredCellsInterface {
        const scoredCells = { ...emptyScoredCells };
        if (this.isCorrectValue(field, cell)) {
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

    private getGroupCoordinates(cell: CellInterface): [startY: number, endY: number, startX: number, endX: number] {
        // TODO: To optimize we potentially can precalculate all groups coordinates once
        const groupStartY = cell.y - (cell.y % this.fieldGroupHeight);
        const groupStartX = cell.x - (cell.x % this.fieldGroupWidth);
        const groupEndY = groupStartY + this.fieldGroupHeight;
        const groupEndX = groupStartX + this.fieldGroupWidth;

        return [groupStartY, groupEndY, groupStartX, groupEndX];
    }

    private isCoordinatesInGroup(cell: CellInterface, y: number, x: number): boolean {
        const [groupStartY, groupEndY, groupStartX, groupEndX] = this.getGroupCoordinates(cell);

        return y >= groupStartY && y < groupEndY && x >= groupStartX && x < groupEndX;
    }

    private hasBlankCells(): [hasBlankCells: boolean, lastY: number, lastX: number] {
        let y = 0;
        let x = 0;

        // TODO: We can introduce different filling logic to randomize puzzle generation

        for (y = 0; y < this.field.length; y += 1) {
            for (x = 0; x < this.field[y].length; x += 1) {
                if (this.isBlankCell(this.field[y][x])) {
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
        const [groupStartY, groupStartX] = this.getGroupCoordinates(cell);

        for (let y = 0; y < this.fieldGroupHeight; y += 1) {
            for (let x = 0; x < this.fieldGroupWidth; x += 1) {
                if (field[y + groupStartY][x + groupStartX].value === cell.value) {
                    return true;
                }
            }
        }

        return false;
    }

    // TODO: Can we optimize this?
    private hasValueInField(field: FieldInterface, cell: CellInterface): boolean {
        let valueCount = 0;
        for (const row of field) {
            for (const col of row) {
                if (col.value === cell.value) {
                    valueCount += 1;
                }
            }
        }

        return valueCount < this.fieldSize;
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
}
