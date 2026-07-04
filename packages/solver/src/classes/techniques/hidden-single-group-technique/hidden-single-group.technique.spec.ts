import { describe, expect, it } from '@jest/globals';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';

import { HiddenSingleGroupTechnique } from './hidden-single-group.technique';

describe('HiddenSingleGroupTechnique', () => {
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
        const technique = new HiddenSingleGroupTechnique(game);

        expect(technique.type).toBe(SolutionTechniqueEnum.HiddenSingle);
        expect(technique.difficulty).toBe(3);
    });

    it('should detect HiddenSingle other groups exclude', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '.........',
            '...5.....',
            '.........',
            '......5..',
            '..5......',
            '.........',
            '.........',
            '.....5...',
            '.........'
        );
        const technique = new HiddenSingleGroupTechnique(game);

        expect(technique.getSolution(game.Field[5][4])).toBe(5);
    });

    it('should detect HiddenSingle when group other possible excluded', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '238175649',
            '6192..35.',
            '754693...',
            '165927834',
            '983514726',
            '472836..5',
            '841..259.',
            '326459.7.',
            '5973814.2'
        );
        const technique = new HiddenSingleGroupTechnique(game);

        expect(technique.getSolution(game.Field[1][8])).toBe(7);
        game.setCellValue({ ...game.Field[1][8], value: 7 });

        expect(technique.getSolution(game.Field[6][8])).toBe(3);
        game.setCellValue({ ...game.Field[6][8], value: 3 });

        expect(technique.getSolution(game.Field[8][7])).toBe(6);
    });

    it('should detect HiddenSingle when group other possible excluded 2', () => {
        const game = Sudoku.fromStrings(
            defaultSudokuConfig,
            '',
            '..6....2.',
            '.9...3...',
            '1........',
            '5...89.4.',
            '.8.6.....',
            '7..4..6..',
            '2....7..5',
            '.....519.',
            '..4.....6'
        );
        const technique = new HiddenSingleGroupTechnique(game);

        expect(technique.getSolution(game.Field[4][0])).toBe(4);
    });
});
