import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { TechniqueManager } from './technique-manager';

import type { CandidateEliminationInterface } from '../../interfaces/candidate-elimination.interface';
import type { TechniqueStrategyInterface } from '../../interfaces/technique-strategy.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const xWingBoard = '...6.......6......57.3.1.86125973648698.1.732437268.5.86..5..1..5182649..4.13.865';
const hellCorpusBoard = '.................1.....2.3......3.2...1.4......5....6..3......4.7..8...962...7...';
const stuckHellCorpusBoard = '........1.......2...3..4........53...4......612...........7.......8..4.9..712....';
const solvedBoard = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';

const hellCorpusBudgetMilliseconds = 5000;
const hellCorpusTimeoutMilliseconds = 20000;

const singlesOrder = [SolutionTechniqueEnum.FullHouse, SolutionTechniqueEnum.NakedSingle, SolutionTechniqueEnum.HiddenSingle];

const createSudoku = (board: string): Sudoku => Sudoku.fromString(board, defaultSudokuConfig);

const createEliminationStrategy = (eliminations: CandidateEliminationInterface[], cell: CellInterface): TechniqueStrategyInterface => ({
    technique: SolutionTechniqueEnum.XWing,
    find: () => [{ technique: SolutionTechniqueEnum.XWing, cell, value: 1, kind: 'elimination', eliminations, reasonCells: [] }]
});

describe('TechniqueManager.solveLogically', () => {
    it('should keep progressing through elimination-only steps instead of repeating the first one', () => {
        expect.assertions(4);

        const result = new TechniqueManager(createSudoku(xWingBoard)).solveLogically([SolutionTechniqueEnum.XWing]);
        const uniqueEliminations = new Set(result.steps.map(step => JSON.stringify(step.eliminations)));

        expect(result.outcome).toBe('stuck');
        expect(result.steps).toHaveLength(3);
        expect(uniqueEliminations.size).toBe(3);
        expect(result.steps.every(step => step.kind === 'elimination')).toBe(true);
    });

    it('should solve a board that singles alone cannot finish', () => {
        expect.assertions(4);

        const sudoku = createSudoku(hellCorpusBoard);
        const result = new TechniqueManager(sudoku).solveLogically();
        const singlesResult = new TechniqueManager(sudoku).solveLogically(singlesOrder);

        expect(result.outcome).toBe('solved');
        expect(result.steps.some(step => step.kind === 'elimination')).toBe(true);
        expect(result.steps.some(step => step.technique === SolutionTechniqueEnum.NakedPair)).toBe(true);
        expect(singlesResult.outcome).toBe('stuck');
    });

    it('should stop with a stuck outcome when the technique ladder runs out', () => {
        expect.assertions(2);

        const result = new TechniqueManager(createSudoku(stuckHellCorpusBoard)).solveLogically();

        expect(result.outcome).toBe('stuck');
        expect(result.steps.length).toBeGreaterThan(0);
    });

    it('should report a solved board without any steps', () => {
        expect.assertions(2);

        const result = new TechniqueManager(createSudoku(solvedBoard)).solveLogically();

        expect(result.outcome).toBe('solved');
        expect(result.steps).toEqual([]);
    });

    it('should report a contradiction when a blank cell loses every candidate', () => {
        expect.assertions(2);

        const sudoku = createSudoku(hellCorpusBoard);
        const [blankCell] = sudoku.Field.flatMap(row => row).filter(cell => sudoku.isBlankCell(cell));
        const eliminations = sudoku.getCellCandidates(blankCell).map(value => ({ cell: blankCell, value }));
        const result = new TechniqueManager(sudoku, [createEliminationStrategy(eliminations, blankCell)]).solveLogically();

        expect(result.outcome).toBe('contradiction');
        expect(result.steps).toHaveLength(1);
    });

    it('should ignore an elimination that no longer targets a candidate', () => {
        expect.assertions(2);

        const sudoku = createSudoku(hellCorpusBoard);
        const [filledCell] = sudoku.Field.flatMap(row => row).filter(cell => cell.value !== defaultSudokuConfig.blankCellValue);
        const eliminations = [{ cell: filledCell, value: filledCell.value }];
        const result = new TechniqueManager(sudoku, [createEliminationStrategy(eliminations, filledCell)]).solveLogically();

        expect(result.outcome).toBe('stuck');
        expect(result.steps).toEqual([]);
    });

    it('should ignore a placement for a cell that already holds a value', () => {
        expect.assertions(2);

        const sudoku = createSudoku(hellCorpusBoard);
        const [filledCell] = sudoku.Field.flatMap(row => row).filter(cell => cell.value !== defaultSudokuConfig.blankCellValue);
        const strategy: TechniqueStrategyInterface = {
            technique: SolutionTechniqueEnum.NakedSingle,
            find: () => [
                {
                    technique: SolutionTechniqueEnum.NakedSingle,
                    cell: filledCell,
                    value: filledCell.value,
                    kind: 'placement',
                    eliminations: [],
                    reasonCells: [filledCell]
                }
            ]
        };
        const result = new TechniqueManager(sudoku, [strategy]).solveLogically();

        expect(result.outcome).toBe('stuck');
        expect(result.steps).toEqual([]);
    });

    it('should ignore ordered techniques without a registered strategy', () => {
        expect.assertions(2);

        const result = new TechniqueManager(createSudoku(hellCorpusBoard)).solveLogically([SolutionTechniqueEnum.Guess, ...singlesOrder]);
        const singlesResult = new TechniqueManager(createSudoku(hellCorpusBoard)).solveLogically(singlesOrder);

        expect(result.steps.every(step => singlesOrder.includes(step.technique))).toBe(true);
        expect(result).toEqual(singlesResult);
    });

    it('should produce an identical step list for the same board string', () => {
        expect.assertions(1);

        const firstResult = new TechniqueManager(createSudoku(hellCorpusBoard)).solveLogically();
        const secondResult = new TechniqueManager(createSudoku(hellCorpusBoard)).solveLogically();

        expect(firstResult).toEqual(secondResult);
    });

    it(
        'should solve a 17-clue hell corpus board within the wall-clock budget',
        () => {
            expect.assertions(2);

            const startedAt = Date.now();
            const result = new TechniqueManager(createSudoku(hellCorpusBoard)).solveLogically();
            const elapsedMilliseconds = Date.now() - startedAt;

            expect(result.outcome).toBe('solved');
            expect(elapsedMilliseconds).toBeLessThan(hellCorpusBudgetMilliseconds);
        },
        hellCorpusTimeoutMilliseconds
    );
});
