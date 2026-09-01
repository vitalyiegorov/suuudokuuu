import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { interactiveTechniqueOrder } from '../../constants/interactive-technique-order.constant';
import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { TechniqueManager } from './technique-manager';

const composedMoveFixtures = [
    {
        name: 'a NakedPair chain that resolves a hidden single elsewhere',
        board: '..3.....2..2.....1..7..2.36..6..3.2...1.4......5....6..3......4.74.8...962.4.7...',
        x: 0,
        y: 2,
        value: 4,
        fullTechnique: SolutionTechniqueEnum.NakedPair,
        fullTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.NakedPair]
    },
    {
        name: 'an AIC-composed placement',
        board: '.......51.......23..4..5.........6.....13......768....429..65..37.4.....81.......',
        x: 2,
        y: 4,
        value: 2,
        fullTechnique: SolutionTechniqueEnum.AIC,
        fullTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.AIC]
    },
    {
        name: 'a hidden single reached through composed eliminations',
        board: '..3....51.......23..4..5.........6....213......768....429..65..37.4.....81.......',
        x: 1,
        y: 2,
        value: 9,
        fullTechnique: SolutionTechniqueEnum.HiddenSingle,
        fullTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.HiddenSingle]
    },
    {
        name: 'a second AIC-composed placement',
        board: '....51.3454..3..12.13..4...352...14.4.71.352616.542.73..146.3.767532.4.183471.26.',
        x: 2,
        y: 0,
        value: 6,
        fullTechnique: SolutionTechniqueEnum.AIC,
        fullTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.AIC]
    },
    {
        name: 'a hidden single on a sparse board reached through composed eliminations',
        board: '..1..2..........12.23.14..5.....36..31..7....28.......872195...634827...159..67.8',
        x: 8,
        y: 7,
        value: 9,
        fullTechnique: SolutionTechniqueEnum.HiddenSingle,
        fullTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.HiddenSingle]
    },
    {
        name: 'a NishioForcingChain-composed placement',
        board: '........4....41..2.346..15.....7423.....26.1..5....47....71....1..46....68.....41',
        x: 0,
        y: 5,
        value: 3,
        fullTechnique: SolutionTechniqueEnum.NishioForcingChain,
        fullTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.NishioForcingChain]
    }
];

const interactiveLadderFixtures = [
    {
        name: 'a NishioForcingChain move the interactive ladder cannot compose',
        board: '.......51.......23..4..5.........6....213......768....429..65..37.4.....81.......',
        x: 2,
        y: 0,
        value: 3,
        fullTechnique: SolutionTechniqueEnum.NishioForcingChain,
        fullTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.NishioForcingChain],
        interactiveTechnique: SolutionTechniqueEnum.Guess,
        interactiveTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.Guess]
    },
    {
        name: 'a NishioForcingChain move the interactive ladder recomposes as a hidden single',
        board: '..3....51.......23.94..5.........6....213......768....429..65..37.4.....81.......',
        x: 1,
        y: 0,
        value: 6,
        fullTechnique: SolutionTechniqueEnum.NishioForcingChain,
        fullTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.NishioForcingChain],
        interactiveTechnique: SolutionTechniqueEnum.HiddenSingle,
        interactiveTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.HiddenSingle]
    },
    {
        name: 'another NishioForcingChain move the interactive ladder cannot compose',
        board: '........8.....8..18....2.34...78561.61729438558.31674....853496348629157965...823',
        x: 7,
        y: 0,
        value: 6,
        fullTechnique: SolutionTechniqueEnum.NishioForcingChain,
        fullTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.NishioForcingChain],
        interactiveTechnique: SolutionTechniqueEnum.Guess,
        interactiveTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.Guess]
    },
    {
        name: 'an AIC move the interactive ladder cannot compose',
        board: '.......68.....8.718....2.34...78561.61729438558.31674....853496348629157965...823',
        x: 0,
        y: 6,
        value: 7,
        fullTechnique: SolutionTechniqueEnum.AIC,
        fullTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.AIC],
        interactiveTechnique: SolutionTechniqueEnum.Guess,
        interactiveTechniqueName: SolutionTechniqueEnum[SolutionTechniqueEnum.Guess]
    }
];

const solvedHellCorpusBoard = '..3.....2..2.....1..7..2.36..6..3.2...1.4......5....6..3......4.74.8...962.4.7...';

const composedMoveBudgetMilliseconds = 5000;

describe('TechniqueManager.identifyMove composed pass', () => {
    it.each(composedMoveFixtures)('classifies $name as $fullTechniqueName rather than a guess', ({ board, x, y, value, fullTechnique }) => {
        expect.assertions(1);

        const sudoku = Sudoku.fromString(board, defaultSudokuConfig);
        const cell = { ...sudoku.Field[y][x], value };
        const result = new TechniqueManager(sudoku).identifyMove(cell);

        expect(result).toEqual({ technique: fullTechnique, value });
    });

    it.each(interactiveLadderFixtures)(
        'keeps classifying $name identically with the full registry',
        ({ board, x, y, value, fullTechnique }) => {
            expect.assertions(1);

            const sudoku = Sudoku.fromString(board, defaultSudokuConfig);
            const cell = { ...sudoku.Field[y][x], value };
            const result = new TechniqueManager(sudoku).identifyMove(cell);

            expect(result).toEqual({ technique: fullTechnique, value });
        }
    );

    it.each(interactiveLadderFixtures)(
        'classifies $name on the interactive ladder as $interactiveTechniqueName',
        ({ board, x, y, value, interactiveTechnique }) => {
            expect.assertions(1);

            const sudoku = Sudoku.fromString(board, defaultSudokuConfig);
            const cell = { ...sudoku.Field[y][x], value };
            const result = new TechniqueManager(sudoku).identifyMove(cell, interactiveTechniqueOrder);

            expect(result).toEqual({ technique: interactiveTechnique, value });
        }
    );

    it('should never classify a placement of a fully logically solvable board as a guess', () => {
        expect.assertions(2);

        const solveSudoku = Sudoku.fromString(solvedHellCorpusBoard, defaultSudokuConfig);
        const solveResult = new TechniqueManager(solveSudoku).solveLogically();
        const placementSteps = solveResult.steps.filter(step => step.kind === 'placement');
        const replaySudoku = Sudoku.fromString(solvedHellCorpusBoard, defaultSudokuConfig);
        const guessedMoves: string[] = [];

        for (const step of placementSteps) {
            const cell = { ...replaySudoku.Field[step.cell.y][step.cell.x], value: step.value };
            const classification = new TechniqueManager(replaySudoku).identifyMove(cell);

            if (classification.technique === SolutionTechniqueEnum.Guess) {
                guessedMoves.push(`r${cell.y + 1}c${cell.x + 1}=${cell.value}`);
            }

            replaySudoku.Field[step.cell.y][step.cell.x] = cell;
        }

        expect(solveResult.outcome).toBe('solved');
        expect(guessedMoves).toEqual([]);
    });

    it(
        'should classify a composed-pass move within the wall-clock budget',
        () => {
            expect.assertions(1);

            const [{ board, x, y, value }] = composedMoveFixtures.filter(
                fixture => fixture.fullTechnique === SolutionTechniqueEnum.NishioForcingChain
            );
            const sudoku = Sudoku.fromString(board, defaultSudokuConfig);
            const cell = { ...sudoku.Field[y][x], value };
            const startedAt = Date.now();

            new TechniqueManager(sudoku).identifyMove(cell);

            const elapsedMilliseconds = Date.now() - startedAt;

            expect(elapsedMilliseconds).toBeLessThan(composedMoveBudgetMilliseconds);
        },
        composedMoveBudgetMilliseconds
    );
});
