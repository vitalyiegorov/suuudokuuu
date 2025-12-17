import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { defaultSudokuConfig } from '../../../interfaces/sudoku-config.interface';
import { Sudoku } from '../../sudoku/sudoku';

import { LockedCandidateTechnique } from './locked-candidate.technique';

describe('LockedCandidateTechnique', () => {
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
        const technique = new LockedCandidateTechnique(game);

        expect(technique.type).toBe(SolutionTechniqueEnum.LockedCandidate);
        expect(technique.difficulty).toBe(5);
    });

    it('should find locked candidate row', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '9...6.257',
            '4.8...9..',
            '...9.7...',
            '...7...43',
            '1.6....2.',
            '..4...6..',
            '.6.8.4...',
            '.....58..',
            '.....95.6'
        );
        const technique = new LockedCandidateTechnique(game);

        expect(technique.getSolution(game.Field[0][5])).toBe(8);
    });

    it('should find locked candidate row 2', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '...5483.2',
            '..42..9.8',
            '.2..96.54',
            '762354891',
            '..39.....',
            '149867235',
            '...4..58.',
            '2.5..947.',
            '4....5129'
        );
        const technique = new LockedCandidateTechnique(game);

        expect(technique.getSolution(game.Field[2][0])).toBe(3);
    });

    it('should find locked candidate col 1', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '.....7354',
            '53...179.',
            '9....56.1',
            '...5.8...',
            '..5.1....',
            '.9....542',
            '...16...5',
            '6...5....',
            '15.48..36'
        );
        const technique = new LockedCandidateTechnique(game);

        expect(technique.getSolution(game.Field[4][5])).toBe(4);
    });

    it('should NOT find locked candidate', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '.6.7....5',
            '1.9...8.6',
            '......9.3',
            '.18.4....',
            '62.5.....',
            '.34......',
            '.8....561',
            '..1687.4.',
            '..6..1...'
        );
        const technique = new LockedCandidateTechnique(game);

        expect(technique.getSolution(game.Field[1][3])).toBe(null);
        expect(technique.getSolution(game.Field[1][4])).toBe(null);
    });
});
