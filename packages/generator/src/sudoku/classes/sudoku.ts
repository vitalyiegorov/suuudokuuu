import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { GRID_BLANK_VALUE, GRID_SIZE, UNIQUENESS_COUNT_LIMIT } from '@suuudokuuu/solver-core';

import { isDefined } from '@rnw-community/shared';

import { type ScoredCellsInterface, emptyScoredCells } from '../../@generic/interfaces/scored-cells.interface';
import { defaultSudokuConfig, getBlankCellCountByConfig } from '../../@generic/interfaces/sudoku-config.interface';
import { cloneField } from '../../@generic/utils/clone-field.util';
import { fieldToGrid } from '../../@generic/utils/field-to-grid.util';
import { shuffle } from '../../@generic/utils/shuffle.util';
import { SerializableSudoku } from '../../serializable-sudoku/classes/serializable-sudoku';

import type { DifficultyEnum } from '../../@generic/enums/difficulty.enum';
import type { CellInterface } from '../../@generic/interfaces/cell.interface';
import type { FieldInterface } from '../../@generic/interfaces/field.interface';
import type { SudokuConfigInterface } from '../../@generic/interfaces/sudoku-config.interface';

const maxFieldAttempts = 10;
const maxClueRemovalAttempts = 50;

export class Sudoku extends SerializableSudoku {
    private readonly fieldFillingValues: number[];
    private readonly fillingUnavailableValues = Array.from(
        { length: this.config.fieldSize * this.config.fieldSize },
        () => new Uint8Array(this.config.fieldSize + 1)
    );
    private readonly coordinates: { x: number; y: number }[] = [];
    private readonly solver = new BitmaskSolver();

    constructor(config: SudokuConfigInterface = defaultSudokuConfig) {
        super(config);

        this.fieldFillingValues = Array.from({ length: this.config.fieldSize }, (_, i) => i + 1);
        for (let y = 0; y < this.config.fieldSize; y += 1) {
            for (let x = 0; x < this.config.fieldSize; x += 1) {
                this.coordinates.push({ x, y });
            }
        }
    }

    get Config(): SudokuConfigInterface {
        return { ...this.config, difficultyBlankCells: { ...this.config.difficultyBlankCells } };
    }

    create(difficulty: DifficultyEnum): void {
        this.config = { ...this.config, difficulty };
        const targetBlankCells = getBlankCellCountByConfig(this.config);

        this.createBestField(targetBlankCells);
        this.calculateAvailableValues();
    }

    getCorrectValue(cell?: CellInterface): number {
        return isDefined(cell) ? this.field[cell.y][cell.x].value : this.config.blankCellValue;
    }

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

    isScoredCell(cell: CellInterface, scoredCell: ScoredCellsInterface): boolean {
        return (
            scoredCell.isWon ||
            scoredCell.x === cell.x ||
            scoredCell.y === cell.y ||
            scoredCell.group === cell.group ||
            scoredCell.values.includes(cell.value)
        );
    }

    getCellCandidates(cell: CellInterface): number[] {
        const unavailableValues = this.getUnavailableValues(this.gameField, cell);

        return this.fieldFillingValues.filter(value => unavailableValues[value] === 0);
    }

    setCellValue(cell: CellInterface): ScoredCellsInterface {
        if (!this.isCorrectValue(cell)) {
            throw new Error('Cell value is wrong');
        }
        this.gameField[cell.y][cell.x].value = cell.value;
        const blankCell = { ...cell, value: this.config.blankCellValue };
        this.calculateAvailableValues();
        const isWon = this.possibleValues.length === 0;
        const values = isWon ? [...this.fieldFillingValues] : [];
        if (!isWon && !this.possibleValues.includes(cell.value)) {
            values.push(cell.value);
        }

        return {
            x: this.gameField.some(row => row[cell.x].value === this.config.blankCellValue) ? emptyScoredCells.x : cell.x,
            y: this.gameField[cell.y].some(({ value }) => value === this.config.blankCellValue) ? emptyScoredCells.y : cell.y,
            group: this.hasValueInGroup(this.gameField, blankCell) ? emptyScoredCells.group : cell.group,
            values,
            isWon
        };
    }

    private createBestField(targetBlankCells: number): void {
        let bestBlankCount = -1;
        let bestField = this.field;
        let bestGameField = this.gameField;

        for (let attempt = 0; attempt < maxFieldAttempts; attempt += 1) {
            const blankCount = this.createAttempt(targetBlankCells);
            if (blankCount > bestBlankCount) {
                bestBlankCount = blankCount;
                bestField = this.field;
                bestGameField = this.gameField;
            }
            if (blankCount >= targetBlankCells) {
                break;
            }
        }

        this.field = bestField;
        this.gameField = bestGameField;
    }

    private createAttempt(targetBlankCells: number): number {
        this.field = cloneField(this.emptyField);
        this.fillRecursive(0);

        return this.removeClues(targetBlankCells);
    }

    private getUnavailableValues(
        field: FieldInterface,
        cell: Pick<CellInterface, 'x' | 'y'>,
        unavailableValues = new Uint8Array(this.config.fieldSize + 1)
    ): Uint8Array {
        unavailableValues.fill(0);
        for (let coordinate = 0; coordinate < this.config.fieldSize; coordinate += 1) {
            unavailableValues[field[cell.y][coordinate].value] = 1;
            unavailableValues[field[coordinate][cell.x].value] = 1;
        }
        const boxStartY = cell.y - (cell.y % this.config.fieldGroupHeight);
        const boxStartX = cell.x - (cell.x % this.config.fieldGroupWidth);
        for (let y = 0; y < this.config.fieldGroupHeight; y += 1) {
            for (let x = 0; x < this.config.fieldGroupWidth; x += 1) {
                unavailableValues[field[y + boxStartY][x + boxStartX].value] = 1;
            }
        }

        return unavailableValues;
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

    private fillRecursive(cellIndex: number): boolean {
        if (cellIndex === this.config.fieldSize * this.config.fieldSize) {
            return true;
        }
        const y = Math.floor(cellIndex / this.config.fieldSize);
        const x = cellIndex % this.config.fieldSize;
        const cell = this.field[y][x];
        const unavailableValues = this.getUnavailableValues(this.field, cell, this.fillingUnavailableValues[cellIndex]);
        for (const value of shuffle(this.fieldFillingValues, this.config.random)) {
            if (unavailableValues[value] === 0) {
                cell.value = value;
                if (this.fillRecursive(cellIndex + 1)) {
                    return true;
                }
                cell.value = this.config.blankCellValue;
            }
        }

        return false;
    }

    private removeClues(targetBlankCells: number): number {
        let maxBlanks = 0;
        const solvedGrid = fieldToGrid(this.field, this.config.blankCellValue);
        let bestGrid = solvedGrid;

        for (let attempt = 0; attempt < maxClueRemovalAttempts; attempt += 1) {
            const grid = solvedGrid.slice();
            const blankCells = this.removeCluesFromGrid(grid, targetBlankCells);
            if (blankCells > maxBlanks) {
                maxBlanks = blankCells;
                bestGrid = grid;
            }
            if (maxBlanks >= targetBlankCells) {
                break;
            }
        }
        this.applyGameGrid(bestGrid);

        return maxBlanks;
    }

    private removeCluesFromGrid(grid: Uint8Array, targetBlankCells: number): number {
        let blankCells = 0;
        for (const { x, y } of shuffle(this.coordinates, this.config.random)) {
            const cellIndex = y * GRID_SIZE + x;
            const backup = grid[cellIndex];
            grid[cellIndex] = GRID_BLANK_VALUE;
            if (this.solver.countSolutions(grid, UNIQUENESS_COUNT_LIMIT) === 1) {
                blankCells += 1;
            } else {
                grid[cellIndex] = backup;
            }
            if (blankCells >= targetBlankCells) {
                break;
            }
        }

        return blankCells;
    }

    private applyGameGrid(grid: Uint8Array): void {
        this.gameField = cloneField(this.field);
        for (const { x, y } of this.coordinates) {
            const value = grid[y * GRID_SIZE + x];
            this.gameField[y][x].value = value === GRID_BLANK_VALUE ? this.config.blankCellValue : value;
        }
    }
}
