import { GRID_BLANK_VALUE, GRID_CELL_COUNT, GRID_SIZE } from '@suuudokuuu/solver-core';

import { ALL_UNIT_CELLS } from '../constants/unit-cells.constant';
import { countMaskBits } from '../utils/count-mask-bits.util';
import { bitForDigit } from '../utils/digit-bit.util';

import { BitmaskGridState } from './bitmask-grid-state';

import type { SolverInterface } from '@suuudokuuu/solver-core';

const NO_CANDIDATES = 0;
const SINGLE_CANDIDATE_COUNT = 1;
const MRV_EARLY_BREAK_CANDIDATE_COUNT = 2;
const NO_BLANK_CELL = -1;

type PropagationStepResult = 'changed' | 'contradiction' | 'unchanged';

export class BitmaskSolver implements SolverInterface {
    private readonly gridState = new BitmaskGridState();
    private readonly solution = new Uint8Array(GRID_CELL_COUNT);
    private solutionFound = false;

    solve(grid: Uint8Array): Uint8Array | null {
        if (!this.initialize(grid)) {
            return null;
        }

        this.search(1);

        return this.solutionFound ? Uint8Array.from(this.solution) : null;
    }

    countSolutions(grid: Uint8Array, limit: number): number {
        if (!this.initialize(grid)) {
            return 0;
        }

        return this.search(limit);
    }

    private initialize(grid: Uint8Array): boolean {
        this.gridState.reset();
        this.solutionFound = false;

        for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
            const isGiven = grid[cell] !== GRID_BLANK_VALUE;

            if (isGiven && !this.placeGiven(cell, grid[cell])) {
                return false;
            }
        }

        return true;
    }

    private placeGiven(cell: number, value: number): boolean {
        const bit = bitForDigit(value);
        // eslint-disable-next-line no-bitwise -- checks whether the given digit's bit is still available before placing it
        const canPlaceGiven = (this.gridState.candidatesFor(cell) & bit) !== NO_CANDIDATES;

        if (canPlaceGiven) {
            this.gridState.place(cell, bit);
        }

        return canPlaceGiven;
    }

    private propagateNakedSingles(): PropagationStepResult {
        let result: PropagationStepResult = 'unchanged';

        for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
            if (this.gridState.valueAt(cell) === GRID_BLANK_VALUE) {
                const candidates = this.gridState.candidatesFor(cell);

                if (candidates === NO_CANDIDATES) {
                    return 'contradiction';
                }

                if (countMaskBits(candidates) === SINGLE_CANDIDATE_COUNT) {
                    this.gridState.assign(cell, candidates);
                    result = 'changed';
                }
            }
        }

        return result;
    }

    // eslint-disable-next-line max-statements -- hidden-single detection scans every blank cell in a unit and tracks the sole admitting cell in one pass
    private propagateHiddenSingleForDigit(unitCells: Uint8Array, bit: number): PropagationStepResult {
        let admittingCell = NO_BLANK_CELL;
        let admittingCount = 0;

        for (let position = 0; position < GRID_SIZE; position += 1) {
            const cell = unitCells[position];
            const isBlank = this.gridState.valueAt(cell) === GRID_BLANK_VALUE;
            // eslint-disable-next-line no-bitwise -- checks whether this candidate digit bit is still open for the cell
            const admitsDigit = isBlank && (this.gridState.candidatesFor(cell) & bit) !== NO_CANDIDATES;

            if (admitsDigit) {
                admittingCount += 1;
                admittingCell = cell;
            }
        }

        if (admittingCount === 0) {
            return 'contradiction';
        }

        if (admittingCount === SINGLE_CANDIDATE_COUNT) {
            this.gridState.assign(admittingCell, bit);

            return 'changed';
        }

        return 'unchanged';
    }

    private propagateHiddenSinglesForUnit(unitCells: Uint8Array, unitType: number, unitIndex: number): PropagationStepResult {
        let result: PropagationStepResult = 'unchanged';

        for (let digit = 1; digit <= GRID_SIZE; digit += 1) {
            const bit = bitForDigit(digit);
            const usedDigitsMask = this.gridState.usedDigitsMaskFor(unitType, unitIndex);
            // eslint-disable-next-line no-bitwise -- reads the live used-digit mask to decide whether this digit still needs placing in the unit
            const isAlreadyPlaced = (usedDigitsMask & bit) !== NO_CANDIDATES;

            if (!isAlreadyPlaced) {
                const outcome = this.propagateHiddenSingleForDigit(unitCells, bit);

                if (outcome === 'contradiction') {
                    return 'contradiction';
                }

                if (outcome === 'changed') {
                    result = 'changed';
                }
            }
        }

        return result;
    }

    private propagateHiddenSinglesForUnitType(unitType: number): PropagationStepResult {
        let result: PropagationStepResult = 'unchanged';
        const units = ALL_UNIT_CELLS[unitType];

        for (let unitIndex = 0; unitIndex < GRID_SIZE; unitIndex += 1) {
            const outcome = this.propagateHiddenSinglesForUnit(units[unitIndex], unitType, unitIndex);

            if (outcome === 'contradiction') {
                return 'contradiction';
            }

            if (outcome === 'changed') {
                result = 'changed';
            }
        }

        return result;
    }

    private propagateHiddenSingles(): PropagationStepResult {
        let result: PropagationStepResult = 'unchanged';

        for (let unitType = 0; unitType < ALL_UNIT_CELLS.length; unitType += 1) {
            const outcome = this.propagateHiddenSinglesForUnitType(unitType);

            if (outcome === 'contradiction') {
                return 'contradiction';
            }

            if (outcome === 'changed') {
                result = 'changed';
            }
        }

        return result;
    }

    private propagate(): boolean {
        let changed = true;

        while (changed) {
            const nakedSinglesResult = this.propagateNakedSingles();

            if (nakedSinglesResult === 'contradiction') {
                return false;
            }

            const hiddenSinglesResult = this.propagateHiddenSingles();

            if (hiddenSinglesResult === 'contradiction') {
                return false;
            }

            changed = nakedSinglesResult === 'changed' || hiddenSinglesResult === 'changed';
        }

        return true;
    }

    private pickMostConstrainedCell(): number {
        let bestCell = NO_BLANK_CELL;
        let bestCandidateCount = GRID_SIZE + 1;

        for (let cell = 0; cell < GRID_CELL_COUNT; cell += 1) {
            if (this.gridState.valueAt(cell) === GRID_BLANK_VALUE) {
                const candidateCount = countMaskBits(this.gridState.candidatesFor(cell));

                if (candidateCount < bestCandidateCount) {
                    bestCandidateCount = candidateCount;
                    bestCell = cell;

                    if (candidateCount <= MRV_EARLY_BREAK_CANDIDATE_COUNT) {
                        break;
                    }
                }
            }
        }

        return bestCell;
    }

    private guessAndCount(cell: number, limit: number): number {
        let remainingCandidates = this.gridState.candidatesFor(cell);
        let count = 0;

        while (remainingCandidates !== NO_CANDIDATES && count < limit) {
            // eslint-disable-next-line no-bitwise -- isolates the lowest set candidate bit to try digits in ascending order
            const bit = remainingCandidates & -remainingCandidates;

            this.gridState.place(cell, bit);
            count += this.search(limit - count);
            this.gridState.remove(cell, bit);

            // eslint-disable-next-line no-bitwise -- clears the just-tried candidate bit before moving to the next one
            remainingCandidates &= ~bit;
        }

        return count;
    }

    private search(limit: number): number {
        const mark = this.gridState.trailLength;

        if (!this.propagate()) {
            this.gridState.undoTo(mark);

            return 0;
        }

        const cell = this.pickMostConstrainedCell();

        if (cell === NO_BLANK_CELL) {
            this.gridState.writeSolutionInto(this.solution);
            this.solutionFound = true;
            this.gridState.undoTo(mark);

            return 1;
        }

        const count = this.guessAndCount(cell, limit);

        this.gridState.undoTo(mark);

        return count;
    }
}
