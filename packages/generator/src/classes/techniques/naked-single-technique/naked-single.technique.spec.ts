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
        expect(technique.difficulty).toBe(3);
    });

    it('should detect NakedSingle when other candidates eliminated in from row and col', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '....3....',
            '....4....',
            '.........',
            '.........',
            '12.....56',
            '.........',
            '.........',
            '....7....',
            '....8....'
        );
        const technique = new NakedSingleTechnique(game);

        expect(technique.getSolution(game.Field[4][4])).toBe(9);
    });

    it('should detect NakedSingle when other candidates eliminated in from row,col and group', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '....3....',
            '....4....',
            '.........',
            '.........',
            '12.....56',
            '...8.7...',
            '.........',
            '.........',
            '.........'
        );
        const technique = new NakedSingleTechnique(game);

        expect(technique.getSolution(game.Field[4][4])).toBe(9);
    });

    it('should detect NakedSingle when other candidates eliminated in from row and col 2', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '73.1..8..',
            '91...3.25',
            '....5....',
            '.5.4...63',
            '..4.9....',
            '...3.....',
            '...56..1.',
            '1.68...5.',
            '.7..4....'
        );
        const technique = new NakedSingleTechnique(game);

        expect(technique.getSolution(game.Field[1][2])).toBe(8);
    });
});
