import {
    GRID_BLANK_VALUE,
    GRID_CELL_COUNT,
    UNIQUENESS_COUNT_LIMIT,
    createSeededRandom,
    formatGridString,
    parseGridString
} from '@suuudokuuu/solver-core';

import { isDefined } from '@rnw-community/shared';

import { countGivens } from '../utils/count-givens.util';
import { createRandomSolvedGrid } from '../utils/create-random-solved-grid.util';
import { reduceToMinimalPuzzle } from '../utils/reduce-to-minimal-puzzle.util';
import { shuffledCellIndexes } from '../utils/shuffled-cell-indexes.util';

import type { HellAdvanceResultInterface } from '../interfaces/hell-advance-result.interface';
import type { HellCandidateInterface } from '../interfaces/hell-candidate.interface';
import type { HellGeneratorOptionsInterface } from '../interfaces/hell-generator-options.interface';
import type { SeededRandomType, SolverInterface } from '@suuudokuuu/solver-core';

const RESTART_FAILURE_LIMIT = 60;
const SATISFIABILITY_CHECK_LIMIT = 1;
const SINGLE_SOLUTION_COUNT = 1;
const ALL_DIGIT_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export class HellGenerator {
    private readonly random: SeededRandomType;
    private readonly tabuPuzzleStrings = new Set<string>();
    private readonly tabuInsertionOrder: string[] = [];
    private currentPuzzle: Uint8Array | null = null;
    private consecutiveMutationFailureCount = 0;

    constructor(
        private readonly solver: SolverInterface,
        private readonly options: HellGeneratorOptionsInterface
    ) {
        this.random = createSeededRandom(options.randomSeed);
    }

    advance(budgetMilliseconds: number): HellAdvanceResultInterface {
        const deadline = Date.now() + budgetMilliseconds;
        let steps = 0;
        let candidate: HellCandidateInterface | null;

        do {
            steps += 1;
            candidate = this.performWalkStep();
        } while (candidate === null && Date.now() < deadline);

        return {
            steps,
            ...(candidate !== null && { candidate })
        };
    }

    seedWith(puzzles: readonly string[]): void {
        const seedPuzzleString = puzzles.find(puzzle => this.isValidSeedPuzzleString(puzzle) && !this.tabuPuzzleStrings.has(puzzle));

        if (isDefined(seedPuzzleString)) {
            this.currentPuzzle = parseGridString(seedPuzzleString);
            this.consecutiveMutationFailureCount = 0;
        }
    }

    private performWalkStep(): HellCandidateInterface | null {
        const puzzle = this.currentPuzzle ?? this.bootstrapCurrentPuzzle();
        const emittedCandidate = this.attemptEmission(puzzle);

        if (emittedCandidate !== null) {
            return emittedCandidate;
        }

        this.mutateCurrentPuzzle(puzzle);

        return null;
    }

    private bootstrapCurrentPuzzle(): Uint8Array {
        const solvedGrid = createRandomSolvedGrid(this.solver, this.random);
        reduceToMinimalPuzzle(solvedGrid, this.solver, this.random);

        this.currentPuzzle = solvedGrid;
        this.consecutiveMutationFailureCount = 0;

        return solvedGrid;
    }

    private attemptEmission(puzzle: Uint8Array): HellCandidateInterface | null {
        const givensCount = countGivens(puzzle);
        const isWithinGivensBounds = givensCount >= this.options.minGivens && givensCount <= this.options.maxGivens;
        const puzzleString = formatGridString(puzzle);
        const isEmittable = isWithinGivensBounds && !this.tabuPuzzleStrings.has(puzzleString);

        if (!isEmittable) {
            return null;
        }

        this.rememberInTabu(puzzleString);

        const solvedGrid = this.solver.solve(puzzle);
        if (solvedGrid === null) {
            return null;
        }

        const candidate: HellCandidateInterface = {
            puzzle: puzzleString,
            solution: formatGridString(solvedGrid),
            givensCount
        };

        return this.passesCandidateGate(candidate) ? candidate : null;
    }

    private passesCandidateGate(candidate: HellCandidateInterface): boolean {
        return isDefined(this.options.candidateGate) ? this.options.candidateGate(candidate) : true;
    }

    private rememberInTabu(puzzleString: string): void {
        const isTabuAtCapacity = this.tabuInsertionOrder.length >= this.options.tabuCapacity;

        if (isTabuAtCapacity) {
            const [oldestPuzzleString] = this.tabuInsertionOrder;

            this.tabuInsertionOrder.shift();
            this.tabuPuzzleStrings.delete(oldestPuzzleString);
        }

        this.tabuPuzzleStrings.add(puzzleString);
        this.tabuInsertionOrder.push(puzzleString);
    }

    private mutateCurrentPuzzle(puzzle: Uint8Array): void {
        const mutatedGrid = Uint8Array.from(puzzle);
        const blankedGivenCell = this.blankRandomGivenCell(mutatedGrid);
        const otherBlankCell = this.pickOtherBlankCell(mutatedGrid, blankedGivenCell);

        this.assignSatisfiableDigit(mutatedGrid, otherBlankCell);

        const isUniquelySolvable = this.solver.countSolutions(mutatedGrid, UNIQUENESS_COUNT_LIMIT) === SINGLE_SOLUTION_COUNT;

        if (isUniquelySolvable) {
            reduceToMinimalPuzzle(mutatedGrid, this.solver, this.random);
            this.currentPuzzle = mutatedGrid;
            this.consecutiveMutationFailureCount = 0;
        } else {
            this.registerMutationFailure();
        }
    }

    private registerMutationFailure(): void {
        this.consecutiveMutationFailureCount += 1;

        if (this.consecutiveMutationFailureCount >= RESTART_FAILURE_LIMIT) {
            this.bootstrapCurrentPuzzle();
        }
    }

    private blankRandomGivenCell(grid: Uint8Array): number {
        const givenCells = shuffledCellIndexes(this.random).filter(cell => grid[cell] !== GRID_BLANK_VALUE);
        const [chosenCell] = givenCells;

        grid[chosenCell] = GRID_BLANK_VALUE;

        return chosenCell;
    }

    private pickOtherBlankCell(grid: Uint8Array, excludedCell: number): number {
        const blankCells = shuffledCellIndexes(this.random).filter(cell => cell !== excludedCell && grid[cell] === GRID_BLANK_VALUE);

        return blankCells[0];
    }

    private assignSatisfiableDigit(grid: Uint8Array, cell: number): void {
        const satisfiableDigits = this.rotatedDigitOrder().filter(digit => {
            grid[cell] = digit;

            return this.solver.countSolutions(grid, SATISFIABILITY_CHECK_LIMIT) === SINGLE_SOLUTION_COUNT;
        });

        [grid[cell]] = satisfiableDigits;
    }

    private rotatedDigitOrder(): number[] {
        const rotationStart = Math.floor(this.random() * ALL_DIGIT_VALUES.length);

        return [...ALL_DIGIT_VALUES.slice(rotationStart), ...ALL_DIGIT_VALUES.slice(0, rotationStart)];
    }

    private isValidSeedPuzzleString(puzzle: string): boolean {
        return puzzle.length === GRID_CELL_COUNT && /^\d+$/u.test(puzzle);
    }
}
