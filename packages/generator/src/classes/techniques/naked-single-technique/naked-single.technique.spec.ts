import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { Sudoku } from '../../sudoku/sudoku';

import { NakedSingleTechnique } from './naked-single.technique';

describe('NakedSingleTechnique', () => {
    it('should have correct type and difficulty', () => {
        const game = Sudoku.fromStrings(
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
        const technique = new NakedSingleTechnique(game);

        expect(technique.type).toBe(SolutionTechniqueEnum.NakedSingle);
        expect(technique.difficulty).toBe(2);
    });

    it('should detect NakedSingle when cell has only one candidate', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '53..7....',
            '6..195...',
            '.98....6.',
            '8...6...3',
            '4..8.3..1',
            '7...2...6',
            '.6....28.',
            '...419..5',
            '....8..79'
        );
        const technique = new NakedSingleTechnique(game);

        const cell = game.GameField[0][2];
        const candidates = [4];
        const result = technique.canApply(cell, candidates);

        expect(result).toBe(true);
    });

    it('should not detect NakedSingle when cell has multiple candidates', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '53..7....',
            '6..195...',
            '.98....6.',
            '8...6...3',
            '4..8.3..1',
            '7...2...6',
            '.6....28.',
            '...419..5',
            '....8..79'
        );
        const technique = new NakedSingleTechnique(game);

        const cell = game.GameField[0][3];
        const candidates = [2, 6];
        const result = technique.canApply(cell, candidates);

        expect(result).toBe(false);
    });
});
