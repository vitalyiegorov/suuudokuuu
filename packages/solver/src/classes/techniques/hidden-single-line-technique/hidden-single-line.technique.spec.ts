import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';

import { HiddenSingleLineTechnique } from './hidden-single-line.technique';

describe('HiddenSingleLineTechnique', () => {
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
        const technique = new HiddenSingleLineTechnique(game);

        expect(technique.type).toBe(SolutionTechniqueEnum.HiddenSingle);
        expect(technique.difficulty).toBe(3);
    });

    it('should detect HiddenSingle in row when other columns exclude values', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '.........',
            '.........',
            '.........',
            '.........',
            '1234..7.9',
            '.........',
            '.........',
            '.....5...',
            '.......5.'
        );
        const technique = new HiddenSingleLineTechnique(game);

        expect(technique.getSolution(game.Field[4][4])).toBe(5);
    });

    it('should detect HiddenSingle in column when other rows exclude values', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '.9.......',
            '.8.......',
            '.1.......',
            '.6.......',
            '1234..7.9',
            '.4.......',
            '.........',
            '.....5...',
            '.......5.'
        );
        const technique = new HiddenSingleLineTechnique(game);

        expect(technique.getSolution(game.Field[6][1])).toBe(5);
    });
});
