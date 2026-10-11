import { assert, describe, it } from '@effect/vitest';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { createSeededRandom } from '@suuudokuuu/solver-core';
import * as Effect from 'effect/Effect';
import { afterEach, vi } from 'vitest';

import { DifficultyEnum } from '../../../src/@generic/enums/difficulty.enum';
import { defaultSudokuConfig } from '../../../src/@generic/interfaces/sudoku-config.interface';
import { Sudoku } from '../../../src/sudoku/classes/sudoku';

const solvedGrid = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const puzzleString = `.3.${solvedGrid.slice(3)}`;
const sampleSeed = 172000;

afterEach(() => vi.restoreAllMocks());

describe('Sudoku restoration with a supplied solution', () => {
    it.effect('restores the same playable and solved fields, difficulty and candidates as the solving factory', () =>
        Effect.sync(() => {
            const generated = new Sudoku({ ...defaultSudokuConfig, random: createSeededRandom(sampleSeed) });

            generated.create(DifficultyEnum.Medium);
            const serializedPuzzle = generated.toString();
            const solutionString = generated.FullField.flatMap(row => row.map(cell => cell.value)).join('');
            const existing = Sudoku.fromString(serializedPuzzle, { ...defaultSudokuConfig });
            const restored = Sudoku.fromPuzzleAndSolution(serializedPuzzle, solutionString);

            assert.instanceOf(restored, Sudoku);
            assert.deepEqual(restored.Field, existing.Field);
            assert.deepEqual(restored.FullField, existing.FullField);
            assert.strictEqual(restored.Difficulty, existing.Difficulty);
            assert.deepEqual(restored.PossibleValues, existing.PossibleValues);
            for (const cell of restored.Field.flat()) {
                assert.strictEqual(restored.getCorrectValue(cell), existing.getCorrectValue(cell));
                assert.deepEqual(restored.getCellCandidates(cell), existing.getCellCandidates(cell));
            }
        })
    );

    it.effect('rejects malformed puzzle strings', () =>
        Effect.sync(() => {
            for (const malformedPuzzle of ['', '.', 'x'.repeat(solvedGrid.length), '0'.repeat(solvedGrid.length)]) {
                assert.throws(() => Sudoku.fromPuzzleAndSolution(malformedPuzzle, solvedGrid), 'Invalid puzzle string');
            }
        })
    );

    it.effect('rejects malformed and contradictory solutions', () =>
        Effect.sync(() => {
            for (const invalidSolution of ['', '.', `.${solvedGrid.slice(1)}`, `55${solvedGrid.slice(2)}`]) {
                assert.throws(() => Sudoku.fromPuzzleAndSolution(puzzleString, invalidSolution), 'Invalid solution string');
            }
        })
    );

    it.effect('rejects givens that disagree with a complete valid solution', () =>
        Effect.sync(() => {
            assert.throws(() => Sudoku.fromPuzzleAndSolution(`6${puzzleString.slice(1)}`, solvedGrid), 'Puzzle givens do not match');
        })
    );

    it.effect('keeps the shared default configuration unchanged', () =>
        Effect.sync(() => {
            const previousDifficulty = defaultSudokuConfig.difficulty;

            Sudoku.fromPuzzleAndSolution('.'.repeat(solvedGrid.length), solvedGrid);

            assert.strictEqual(defaultSudokuConfig.difficulty, previousDifficulty);
        })
    );

    it.effect('restores a supplied solution without invoking the solver', () =>
        Effect.sync(() => {
            const solve = vi.spyOn(BitmaskSolver.prototype, 'solve');

            assert.strictEqual(Sudoku.fromPuzzleAndSolution(puzzleString, solvedGrid).toString(), puzzleString);
            assert.strictEqual(solve.mock.calls.length, 0);
        })
    );
});
