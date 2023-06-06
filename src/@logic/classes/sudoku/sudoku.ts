import { type Observable, Subject, defer, of, scan, startWith, switchMap, takeWhile, tap } from 'rxjs';

import { isDefined } from '@rnw-community/shared';

import { type DifficultyEnum } from '../../../@generic/enums/difficulty.enum';
import type { CellInterface } from '../../interfaces/cell.interface';
import type { FieldInterface } from '../../interfaces/field.interface';
import { type ScoredCellsInterface, emptyScoredCells } from '../../interfaces/scored-cells.interface';
import type { SudokuConfigInterface } from '../../interfaces/sudoku-config.interface';
import { SudokuMoveEnum, type SudokuState, initialSudokuState } from '../../interfaces/sudoku-state.interface';
import { type AvailableValuesType } from '../../types/available-values.type';
import { SudokuScoring } from '../sudoku-scoring/sudoku-scoring';
import { SudokuFiller } from '../sudoku-solver/sudoku-filler';

// TODO: We can split this class into rules validator(or similar)
export class Sudoku extends SudokuFiller {
    valueSelected$ = new Subject<CellInterface>();

    constructor(config: SudokuConfigInterface, private readonly scoring = new SudokuScoring(config.score)) {
        super(config);
    }

    // TODO: Can we avoid it and just use parent version with correct types?
    static override fromString(fieldsString: string, config: SudokuConfigInterface): Sudoku {
        return super.fromString(fieldsString, config) as Sudoku;
    }

    // TODO: Add support to load game from string
    start$(difficulty: DifficultyEnum): Observable<SudokuState> {
        const initialState: SudokuState = {
            ...initialSudokuState,
            difficulty,
            maxMistakes: this.config.maxMistakes,
            emptyCells: this.config.fieldSize * this.config.fieldSize
        };

        const field$ = defer(() => {
            const [fullField, gameField] = this.create(difficulty);

            return of({ fullField, gameField, availableValues: this.createAvailableValues(gameField) });
        });

        return field$.pipe(
            switchMap(({ fullField, gameField, availableValues }) =>
                this.valueSelected$.pipe(
                    startWith({ x: 0, y: 0, value: 0, group: 0 }),
                    tap(cell => void console.log('EVENT', cell)),
                    scan(
                        (state, cell) => {
                            if (this.isCorrectValue(fullField, cell)) {
                                const newGameField = this.setCellValue(state.gameField, cell);
                                const scoredCells = this.getScoredValues(newGameField, cell);

                                console.log(scoredCells);

                                return {
                                    ...state,
                                    // TODO: Do we need to pass the cell?
                                    cell,
                                    scoredCells,
                                    gameField: newGameField,
                                    availableValues: this.calculateAvailableValues(state.availableValues, cell),
                                    move: scoredCells.isWon ? SudokuMoveEnum.Won : SudokuMoveEnum.Correct,
                                    score: this.scoring.calculate(state.difficulty, scoredCells, state.mistakes, 0)
                                };
                            }

                            const mistakes = state.mistakes + 1;

                            return {
                                ...state,
                                // TODO: Do we need to pass the cell?
                                cell,
                                mistakes,
                                scoredCells: emptyScoredCells,
                                move: mistakes === state.maxMistakes ? SudokuMoveEnum.Lost : SudokuMoveEnum.Mistake
                            };
                        },
                        { ...initialState, fullField, gameField, availableValues }
                    )
                )
            ),
            takeWhile(({ mistakes, maxMistakes, emptyCells }) => emptyCells === 0 || mistakes < maxMistakes)
        );
    }

    setCellValue(field: FieldInterface, cell: CellInterface): FieldInterface {
        field[cell.y][cell.x].value = cell.value;

        return this.cloneField(field);
    }

    getCorrectValue(field: FieldInterface, cell?: CellInterface): number {
        return isDefined(cell) ? field[cell.y][cell.x].value : this.config.blankCellValue;
    }

    // eslint-disable-next-line class-methods-use-this
    isSameCell(cell: CellInterface, selectedCell?: CellInterface): boolean {
        return isDefined(selectedCell) && cell.x === selectedCell.x && cell.y === selectedCell.y;
    }

    // eslint-disable-next-line class-methods-use-this
    isCorrectValue(fullField: FieldInterface, cell?: CellInterface): boolean {
        return isDefined(cell) && fullField[cell.y][cell.x].value === cell.value;
    }

    // eslint-disable-next-line class-methods-use-this
    isValueAvailable(availableValues: AvailableValuesType, cell?: CellInterface): boolean {
        return isDefined(cell) && isDefined(availableValues[cell.value]) && availableValues[cell.value].count > 0;
    }

    isLastInCellGroupX(cell: CellInterface): boolean {
        return cell.x < this.config.fieldSize - 1 && (cell.x + 1) % this.config.fieldGroupWidth === 0;
    }

    isLastInCellGroupY(cell: CellInterface): boolean {
        return cell.y < this.config.fieldSize - 1 && (cell.y + 1) % this.config.fieldGroupHeight === 0;
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
        for (let y = 0; y < this.config.fieldSize; y += 1) {
            // HINT: If there is a blank value in a column, then column is not scored
            if (this.isBlankCell(gameField[y][cell.x])) {
                scoredCells.x = emptyScoredCells.x;
            }

            for (let x = 0; x < this.config.fieldSize; x += 1) {
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
        if (valueCount < this.config.fieldSize) {
            scoredCells.values = [];
            scoredCells.isWon = false;
        }

        if (scoredCells.isWon) {
            scoredCells.values = Array.from({ length: this.config.fieldSize }, (_, i) => i + 1);
        }

        return scoredCells;
    }

    private getAvailableValueProgress(value: number): number {
        return 100 * (1 - value / this.config.fieldSize);
    }

    private createAvailableValues(gameField: FieldInterface): AvailableValuesType {
        return gameField.reduce<AvailableValuesType>(
            (acc, row) =>
                row.reduce<AvailableValuesType>(
                    (acc2, cell) => ({
                        ...acc,
                        ...acc2,
                        [cell.value]: isDefined(acc[cell.value])
                            ? {
                                  count: acc[cell.value].count - 1,
                                  progress: this.getAvailableValueProgress(acc[cell.value].count - 1)
                              }
                            : { count: this.config.fieldSize - 1, progress: this.getAvailableValueProgress(this.config.fieldSize - 1) }
                    }),
                    {}
                ),
            {}
        );
    }

    private calculateAvailableValues(availableValues: AvailableValuesType, cell: CellInterface): AvailableValuesType {
        return {
            ...availableValues,
            [cell.value]: {
                count: availableValues[cell.value].count - 1,
                progress: this.getAvailableValueProgress(availableValues[cell.value].count - 1)
            }
        };
    }
}
