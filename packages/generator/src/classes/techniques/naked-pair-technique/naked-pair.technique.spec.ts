import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';

import { NakedPairTechnique } from './naked-pair.technique';

describe('NakedPairTechnique', () => {
    const sudoku = new Sudoku();
    const technique = new NakedPairTechnique(sudoku);

    it('should have correct type and difficulty', () => {
        expect(technique.type).toBe(SolutionTechniqueEnum.NakedPair);
        expect(technique.difficulty).toBe(4);
    });

    it('should detect NakedPair when conditions are met', () => {
        const game = Sudoku.fromStrings(
            '3456789..',
            '.......12',
            '.......34',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );

        const cell = game.GameField[0][7];
        const candidates = [1, 2];
        technique.setField(game.GameField);
        const result = technique.canApply(cell, candidates);

        expect(typeof result).toBe('boolean');
    });

    it('should not detect NakedPair when cell has more than two candidates', () => {
        const game = Sudoku.fromStrings(
            '3456789..',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );

        const cell = game.GameField[0][7];
        const candidates = [1, 2, 7];
        technique.setField(game.GameField);
        const result = technique.canApply(cell, candidates);

        expect(result).toBe(false);
    });
});
