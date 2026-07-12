import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../enums/solution-technique.enum';

import { TechniqueManager } from './technique-manager';

import type { TechniqueStrategyInterface } from '../../interfaces/technique-strategy.interface';

const createEmptyStrategy = (): TechniqueStrategyInterface => ({
    find: () => [],
    technique: SolutionTechniqueEnum.FullHouse
});

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

        expect(result.technique).toBe(SolutionTechniqueEnum.FullHouse);
    });

    it('should keep identify compatibility helper', () => {
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

        expect(manager.identify(sudoku.Field[0][8])).toBe(SolutionTechniqueEnum.FullHouse);
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

    it('should mark unsupported moves as guesses', () => {
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
        const manager = new TechniqueManager(sudoku);
        const [[cell]] = sudoku.Field;
        const result = manager.identifyMove({ ...cell, value: sudoku.getCorrectValue(cell) });

        expect(result.technique).toBe(SolutionTechniqueEnum.Guess);
        expect(result.kind).toBe('guess');
    });

    it('should preserve the supplied value when classifying a guess', () => {
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
        const [[cell]] = sudoku.Field;
        const suppliedValue = sudoku.getCorrectValue(cell) === 1 ? 2 : 1;
        const result = new TechniqueManager(sudoku).identifyMove({ ...cell, value: suppliedValue });

        expect(result.technique).toBe(SolutionTechniqueEnum.Guess);
        expect(result.value).toBe(suppliedValue);
    });

    it('should use targeted strategy detection when available', () => {
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
        let broadFindCalls = 0;
        let targetedFindCalls = 0;
        const strategy = {
            technique: SolutionTechniqueEnum.FullHouse,
            find: () => {
                broadFindCalls += 1;

                return [];
            },
            findForMove: () => {
                targetedFindCalls += 1;

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

        const result = new TechniqueManager(sudoku, [strategy]).identifyMove({ ...targetCell, value: 9 });

        expect(result.technique).toBe(SolutionTechniqueEnum.FullHouse);
        expect(targetedFindCalls).toBe(1);
        expect(broadFindCalls).toBe(0);
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
                    value: 1,
                    kind: 'elimination',
                    eliminations: [{ cell: targetCell, value: 1 }],
                    reasonCells: []
                }
            ]
        };

        const result = new TechniqueManager(sudoku, [strategy]).identifyMove({ ...targetCell, value: 1 });

        expect(result.technique).toBe(SolutionTechniqueEnum.Guess);
    });

    it('should attribute an elimination technique that leaves the played value', () => {
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
                    value: 1,
                    kind: 'elimination',
                    eliminations,
                    reasonCells: []
                }
            ]
        };

        const result = new TechniqueManager(sudoku, [strategy]).identifyMove({ ...targetCell, value: 1 });

        expect(result.technique).toBe(SolutionTechniqueEnum.XWing);
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
