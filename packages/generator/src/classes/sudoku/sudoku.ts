/* eslint-disable max-lines */
import { isDefined } from '@rnw-community/shared';

import { type ScoredCellsInterface, emptyScoredCells } from '../../interfaces/scored-cells.interface';
import { defaultSudokuConfig, getBlankCellCountByConfig } from '../../interfaces/sudoku-config.interface';
import { cloneField } from '../../util/clone-field.util';
import { shuffle } from '../../util/shuffle.util';
import { DLXSolver } from '../dlx/dlx-solver';
import { SerializableSudoku } from '../serializable-sudoku/serializable-sudoku';
import { SudokuScoring } from '../sudoku-scoring/sudoku-scoring';

import type { DifficultyEnum } from '../../enums/difficulty.enum';
import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';

// TODO: We can split this class into rules validator(or similar)
export class Sudoku extends SerializableSudoku {
    private readonly fieldFillingValues: number[];
    private readonly scoring: SudokuScoring;
    private readonly coordinates: { x: number; y: number }[] = [];

    constructor(config: SudokuConfigInterface = defaultSudokuConfig, scoring: SudokuScoring = new SudokuScoring(config.score)) {
        super(config);

        this.scoring = scoring;

        this.fieldFillingValues = Array.from({ length: this.config.fieldSize }, (_, i) => i + 1);
        // HINT: Prepare all possible coordinates for clue removal
        for (let y = 0; y < this.config.fieldSize; y += 1) {
            for (let x = 0; x < this.config.fieldSize; x += 1) {
                this.coordinates.push({ x, y });
            }
        }
    }

    create(difficulty: DifficultyEnum): void {
        this.config = { ...this.config, difficulty };
        const targetBlankCells = getBlankCellCountByConfig(this.config);

        for (let attempt = 0; attempt < 10; attempt += 1) {
            this.field = cloneField(this.emptyField);
            if (!this.fillRecursive()) {
                throw new Error('Unable to create a game field');
            }
            this.gameField = cloneField(this.field);

            if (this.removeClues(targetBlankCells, 50) >= targetBlankCells) {
                break;
            }
        }

        this.calculateAvailableValues();
    }

    getScore(scoredCells: ScoredCellsInterface, elapsedTime: number, mistakes: number): number {
        return this.scoring.calculate(this.config.difficulty, scoredCells, mistakes, elapsedTime);
    }

    getCorrectValue(cell?: CellInterface): number {
        return isDefined(cell) ? this.field[cell.y][cell.x].value : this.config.blankCellValue;
    }

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    isCellHighlighted(cell: CellInterface, selectedCell?: CellInterface): boolean {
        return isDefined(selectedCell) && (selectedCell.x === cell.x || selectedCell.y === cell.y || selectedCell.group === cell.group);
    }

    isCellWrong(cell: CellInterface, selectedCell?: CellInterface): boolean {
        return this.isSameCell(cell, selectedCell) && !this.isBlankCell(selectedCell) && !this.isCorrectValue(selectedCell);
    }

    getCellRight(selectedCell?: CellInterface): CellInterface | undefined {
        if (isDefined(selectedCell) && selectedCell.x < this.config.fieldSize - 1) {
            return this.gameField[selectedCell.y][selectedCell.x + 1];
        }

        return selectedCell;
    }

    getCellLeft(selectedCell?: CellInterface): CellInterface | undefined {
        if (isDefined(selectedCell) && selectedCell.x > 0) {
            return this.gameField[selectedCell.y][selectedCell.x - 1];
        }

        return selectedCell;
    }

    getCellUp(selectedCell?: CellInterface): CellInterface | undefined {
        if (isDefined(selectedCell) && selectedCell.y > 0) {
            return this.gameField[selectedCell.y - 1][selectedCell.x];
        }

        return selectedCell;
    }

    getCellDown(selectedCell?: CellInterface): CellInterface | undefined {
        if (isDefined(selectedCell) && selectedCell.y < this.config.fieldSize - 1) {
            return this.gameField[selectedCell.y + 1][selectedCell.x];
        }

        return selectedCell;
    }

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    isSameCell(cell: CellInterface, selectedCell?: CellInterface): boolean {
        return isDefined(selectedCell) && cell.x === selectedCell.x && cell.y === selectedCell.y;
    }

    isSameCellValue(cell: CellInterface, selectedCell?: CellInterface): boolean {
        return isDefined(selectedCell) && cell.value === selectedCell.value && cell.value !== this.config.blankCellValue;
    }

    isCorrectValue(cell?: CellInterface): boolean {
        return isDefined(cell) && this.field[cell.y][cell.x].value === cell.value;
    }

    isLastInCellGroupX(cell: CellInterface): boolean {
        return cell.x < this.config.fieldSize - 1 && (cell.x + 1) % this.config.fieldGroupWidth === 0;
    }

    isLastInCellGroupY(cell: CellInterface): boolean {
        return cell.y < this.config.fieldSize - 1 && (cell.y + 1) % this.config.fieldGroupHeight === 0;
    }

    isLastInRow(cell: CellInterface): boolean {
        return cell.y === this.config.fieldSize - 1;
    }

    isLastInColumn(cell: CellInterface): boolean {
        return cell.x === this.config.fieldSize - 1;
    }

    isBlankCell(cell?: CellInterface): cell is CellInterface {
        return isDefined(cell) && this.gameField[cell.y][cell.x].value === this.config.blankCellValue;
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
            const blankCell = { ...cell, value: this.config.blankCellValue };

            this.calculateAvailableValues();

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
                if (this.field[y][x].value === this.config.blankCellValue) {
                    return [true, y, x];
                }
            }
        }

        return [false, y, x];
    }

    private hasValueInRow(field: FieldInterface, cell: CellInterface): boolean {
        for (let x = 0; x < this.config.fieldSize; x += 1) {
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
        const boxStartY = cell.y - (cell.y % this.config.fieldGroupHeight);
        const boxStartX = cell.x - (cell.x % this.config.fieldGroupWidth);

        for (let y = 0; y < this.config.fieldGroupHeight; y += 1) {
            for (let x = 0; x < this.config.fieldGroupWidth; x += 1) {
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
    // eslint-disable-next-line max-statements
    private fillRecursive(): boolean {
        const [needsFilling, emptyY, emptyX] = this.hasBlankCells();

        if (!needsFilling) {
            return true;
        }

        for (const value of shuffle(this.fieldFillingValues)) {
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

                this.field[emptyY][emptyX].value = this.config.blankCellValue;
            }
        }

        return false;
    }

    // eslint-disable-next-line max-statements
    private removeClues(targetBlankCells: number, maxAttempts = 50): number {
        let maxBlanks = 0;
        let bestGameField = cloneField(this.gameField);

        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
            this.gameField = cloneField(this.field);

            let blankCells = 0;
            for (const { x, y } of shuffle(this.coordinates)) {
                const backup = this.gameField[y][x].value;
                this.gameField[y][x].value = this.config.blankCellValue;
                blankCells += 1;

                if (new DLXSolver().count(this.gameField) !== 1) {
                    this.gameField[y][x].value = backup;
                    blankCells -= 1;
                }

                if (blankCells >= targetBlankCells) {
                    break;
                }
            }

            if (blankCells > maxBlanks) {
                maxBlanks = blankCells;
                bestGameField = cloneField(this.gameField);
            }

            if (maxBlanks >= targetBlankCells) {
                break;
            }
        }

        this.gameField = bestGameField;

        return maxBlanks;
    }

    // TODO: Can we avoid it and just use parent version with correct types?
    static override fromString(fieldsString: string, config?: SudokuConfigInterface): Sudoku {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        return super.fromString(fieldsString, config) as Sudoku;
    }
}
/* eslint-enable max-lines */
