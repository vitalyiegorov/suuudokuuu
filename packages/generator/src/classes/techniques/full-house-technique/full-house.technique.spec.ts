import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { Sudoku } from '../../sudoku/sudoku';

import { FullHouseTechnique } from './full-house.technique';

describe('FullHouseTechnique', () => {
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
        const technique = new FullHouseTechnique(game);

        expect(technique.type).toBe(SolutionTechniqueEnum.FullHouse);
        expect(technique.difficulty).toBe(1);
    });

    it('should detect FullHouse when only one cell left in a row', () => {
        const game = Sudoku.fromStrings(
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
        const technique = new FullHouseTechnique(game);

        expect(technique.canApply(game.Field[0][8], [9])).toBe(true);
    });

    it('should detect FullHouse when only one cell left in a column', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '1........',
            '2........',
            '3........',
            '4........',
            '5........',
            '6........',
            '7........',
            '8........',
            '.........'
        );
        const technique = new FullHouseTechnique(game);

        expect(technique.canApply(game.Field[8][0], [9])).toBe(true);
    });

    it('should handle box check correctly', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '12.......',
            '348......',
            '567......',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const technique = new FullHouseTechnique(game);

        expect(technique.canApply(game.Field[0][2], [9])).toBe(true);
    });

    it('should not detect FullHouse when cell has multiple candidates', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '1234567..',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );
        const technique = new FullHouseTechnique(game);

        expect(technique.canApply(game.Field[0][7], [8, 9])).toBe(false);
    });
});
