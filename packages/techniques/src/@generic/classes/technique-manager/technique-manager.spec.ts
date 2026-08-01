import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';
import { CandidateContext } from '../candidate-context/candidate-context';

import { TechniqueManager } from './technique-manager';

import type { TechniqueSearchTargetInterface } from '../../interfaces/technique-search-target.interface';
import type { TechniqueStrategyInterface } from '../../interfaces/technique-strategy.interface';

const createEmptyStrategy = (): TechniqueStrategyInterface => ({
    find: () => [],
    technique: SolutionTechniqueEnum.FullHouse
});

const xWingEnabledBoard = [
    '...6.....',
    '..6......',
    '57.3.1.86',
    '125973648',
    '698.1.732',
    '437268.5.',
    '86..5..1.',
    '.5182649.',
    '.4.13.865'
];

const boxLineEnabledBoard = [
    '.1.36..4.',
    '.3..5....',
    '24.9....8',
    '829..5..6',
    '453.26...',
    '761.39...',
    '68.29...1',
    '.925.....',
    '.746..9..'
];

describe('TechniqueManager', () => {
    it('should find the easiest next logical step', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '12345678.',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const manager = new TechniqueManager(sudoku);

        expect(manager.findNextStep()).toEqual(
            expect.objectContaining({ technique: SolutionTechniqueEnum.FullHouse, cell: sudoku.Field[0][8], value: 9 })
        );
    });

    it('should identify an exact player move', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '12345678.',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const manager = new TechniqueManager(sudoku);
        const result = manager.identifyMove({ ...sudoku.Field[0][8], value: 9 });

        expect(result).toEqual({ technique: SolutionTechniqueEnum.FullHouse, value: 9 });
    });

    it('should prefer the simplest technique when several apply', () => {
        expect.assertions(2);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '12345678.',
            '.........',
            '.........',
            '.....7...',
            '2143.....',
            '...8.....',
            '.........',
            '....6....',
            '.........'
        );
        const manager = new TechniqueManager(sudoku);

        expect(manager.findNextStep()).toEqual(
            expect.objectContaining({ technique: SolutionTechniqueEnum.FullHouse, cell: sudoku.Field[0][8], value: 9 })
        );
        expect(manager.identifyMove({ ...sudoku.Field[4][4], value: 9 }).technique).toBe(SolutionTechniqueEnum.NakedSingle);
    });

    it('should classify a placement enabled by an x-wing elimination', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(defaultSudokuConfig, ...xWingEnabledBoard);
        const [[targetCell]] = sudoku.Field.slice(8);
        const result = new TechniqueManager(sudoku).identifyMove({ ...targetCell, value: 2 });

        expect(result).toEqual({ technique: SolutionTechniqueEnum.XWing, value: 2 });
    });

    it('should not attribute an x-wing that does not force the played cell', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(defaultSudokuConfig, ...xWingEnabledBoard);
        const [[targetCell]] = sudoku.Field;
        const result = new TechniqueManager(sudoku).identifyMove({ ...targetCell, value: 3 });

        expect(result).toEqual({ technique: SolutionTechniqueEnum.Guess, value: 3 });
    });

    it('should prefer the simplest enabling technique for a forced placement', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(defaultSudokuConfig, ...boxLineEnabledBoard);
        const [targetCell] = sudoku.Field[6].slice(5);
        const result = new TechniqueManager(sudoku).identifyMove({ ...targetCell, value: 3 });

        expect(result).toEqual({ technique: SolutionTechniqueEnum.BoxLineReduction, value: 3 });
    });

    it('should never justify a value that contradicts the solution', () => {
        expect.assertions(1);

        const justifiedWrongMoves: string[] = [];

        for (const board of [xWingEnabledBoard, boxLineEnabledBoard]) {
            const sudoku = Sudoku.fromStrings(defaultSudokuConfig, ...board);
            const context = CandidateContext.fromSudoku(sudoku);
            const manager = new TechniqueManager(sudoku);

            for (const cell of context.getBlankCells().slice(0, 6)) {
                const correctValue = sudoku.getCorrectValue(cell);

                for (const value of context.getCandidates(cell).filter(candidate => candidate !== correctValue)) {
                    const { technique } = manager.identifyMove({ ...cell, value });

                    if (technique !== SolutionTechniqueEnum.Guess) {
                        justifiedWrongMoves.push(`r${cell.y + 1}c${cell.x + 1}=${value} as ${SolutionTechniqueEnum[technique]}`);
                    }
                }
            }
        }

        expect(justifiedWrongMoves).toEqual([]);
    });

    it('should mark unsupported moves as guesses', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const manager = new TechniqueManager(sudoku);
        const [[cell]] = sudoku.Field;
        const result = manager.identifyMove({ ...cell, value: sudoku.getCorrectValue(cell) });

        expect(result).toEqual({ technique: SolutionTechniqueEnum.Guess, value: sudoku.getCorrectValue(cell) });
    });

    it('should preserve the supplied value when classifying a guess', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const [[cell]] = sudoku.Field;
        const suppliedValue = sudoku.getCorrectValue(cell) === 1 ? 2 : 1;
        const result = new TechniqueManager(sudoku).identifyMove({ ...cell, value: suppliedValue });

        expect(result).toEqual({ technique: SolutionTechniqueEnum.Guess, value: suppliedValue });
    });

    it('passes the move target through the single strategy find method', () => {
        expect.assertions(3);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '12345678.',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const [targetCell] = sudoku.Field[0].slice(-1);
        let findCalls = 0;
        let receivedTarget: TechniqueSearchTargetInterface | undefined;
        const strategy: TechniqueStrategyInterface = {
            technique: SolutionTechniqueEnum.FullHouse,
            find: (_context, target) => {
                findCalls += 1;
                receivedTarget = target;

                return [
                    {
                        technique: SolutionTechniqueEnum.FullHouse,
                        cell: targetCell,
                        value: 9,
                        kind: 'placement' as const,
                        eliminations: [],
                        reasonCells: [targetCell]
                    }
                ];
            }
        };

        const targetMove = { ...targetCell, value: 9 };
        const result = new TechniqueManager(sudoku, [strategy]).identifyMove(targetMove);

        expect(result.technique).toBe(SolutionTechniqueEnum.FullHouse);
        expect(findCalls).toBe(1);
        expect(receivedTarget).toEqual({ cell: targetMove, value: 9, intent: 'direct' });
    });

    it('should not treat an eliminated candidate as a justified placement', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromString('.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize), defaultSudokuConfig);
        const [[targetCell]] = sudoku.Field;
        const strategy: TechniqueStrategyInterface = {
            technique: SolutionTechniqueEnum.XWing,
            find: () => [
                {
                    technique: SolutionTechniqueEnum.XWing,
                    cell: targetCell,
                    value: 2,
                    kind: 'elimination',
                    eliminations: [{ cell: targetCell, value: 1 }],
                    reasonCells: []
                }
            ]
        };

        const result = new TechniqueManager(sudoku, [strategy]).identifyMove({ ...targetCell, value: 1 });

        expect(result.technique).toBe(SolutionTechniqueEnum.Guess);
    });

    it('should classify an elimination deduction with the played value', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromString('.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize), defaultSudokuConfig);
        const [[targetCell]] = sudoku.Field;
        const eliminations = sudoku
            .getCellCandidates(targetCell)
            .filter(value => value !== 1)
            .map(value => ({ cell: targetCell, value }));
        const strategy: TechniqueStrategyInterface = {
            technique: SolutionTechniqueEnum.XWing,
            find: () => [
                {
                    technique: SolutionTechniqueEnum.XWing,
                    cell: targetCell,
                    value: 2,
                    kind: 'elimination',
                    eliminations,
                    reasonCells: []
                }
            ]
        };

        const result = new TechniqueManager(sudoku, [strategy]).identifyMove({ ...targetCell, value: 1 });

        expect(result).toEqual({ technique: SolutionTechniqueEnum.XWing, value: 1 });
    });

    it('should not match an elimination deduction that targets another cell', () => {
        expect.assertions(2);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '12345678.',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const [targetCell] = sudoku.Field[0].slice(-1);
        const [[otherCell]] = sudoku.Field.slice(1);
        const strategy: TechniqueStrategyInterface = {
            technique: SolutionTechniqueEnum.XWing,
            find: () => [
                {
                    technique: SolutionTechniqueEnum.XWing,
                    cell: otherCell,
                    value: 2,
                    kind: 'elimination',
                    eliminations: [{ cell: otherCell, value: 9 }],
                    reasonCells: []
                }
            ]
        };

        const result = new TechniqueManager(sudoku, [strategy]).identifyMove({ ...targetCell, value: 9 });

        expect(sudoku.getCellCandidates(otherCell)).toContain(9);
        expect(result.technique).toBe(SolutionTechniqueEnum.Guess);
    });

    it('should use a guess when no strategy finds a logical step', () => {
        expect.assertions(2);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const manager = new TechniqueManager(sudoku, [createEmptyStrategy()]);
        const result = manager.findNextStep();

        expect(result).toEqual(expect.objectContaining({ technique: SolutionTechniqueEnum.Guess }));
        expect(result?.kind).toBe('guess');
    });

    it('should return null when the puzzle has no blank cells', () => {
        expect.assertions(1);

        const sudoku = Sudoku.fromStrings(
            defaultSudokuConfig,
            '123456789',
            '456789123',
            '789123456',
            '214365897',
            '365897214',
            '897214365',
            '531642978',
            '642978531',
            '978531642'
        );
        const manager = new TechniqueManager(sudoku, [createEmptyStrategy()]);

        expect(manager.findNextStep()).toBeNull();
    });
});
