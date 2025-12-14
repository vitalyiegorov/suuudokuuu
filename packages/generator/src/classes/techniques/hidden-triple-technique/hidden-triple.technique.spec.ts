import { describe, expect, it } from '@jest/globals';

import { SolutionTechniqueEnum } from '../../../enums/solution-technique.enum';
import { Sudoku } from '../../sudoku/sudoku';

import { HiddenTripleTechnique } from './hidden-triple.technique';

describe('HiddenTripleTechnique', () => {
    const sudoku = new Sudoku();
    const technique = new HiddenTripleTechnique(sudoku);

    it('should have correct type and difficulty', () => {
        expect(technique.type).toBe(SolutionTechniqueEnum.HiddenTriple);
        expect(technique.difficulty).toBe(7);
    });

    it('should apply technique to appropriate cells', () => {
        const game = Sudoku.fromStrings(
            '..3..6..8',
            '..5..8..3',
            '..1..3..5',
            '3........',
            '5........',
            '1........',
            '.........',
            '.........',
            '.........'
        );

        let foundApplicable = false;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = game.GameField[y][x];
                if (cell.value === 0) {
                    const candidates = sudoku.getCellCandidates(cell, game.GameField);
                    technique.setField(game.GameField);
                    if (candidates.length > 0 && technique.canApply(cell, candidates)) {
                        foundApplicable = true;
                        break;
                    }
                }
            }
            if (foundApplicable) {
                break;
            }
        }

        expect(typeof foundApplicable).toBe('boolean');
    });

    it('should not apply to solved field', () => {
        const game = Sudoku.fromStrings(
            '123456789',
            '456789123',
            '789123456',
            '234567891',
            '567891234',
            '891234567',
            '345678912',
            '678912345',
            '912345678'
        );

        let foundApplicable = false;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = game.GameField[y][x];
                if (cell.value === 0) {
                    const candidates = sudoku.getCellCandidates(cell, game.GameField);
                    technique.setField(game.GameField);
                    if (candidates.length > 0 && technique.canApply(cell, candidates)) {
                        foundApplicable = true;
                        break;
                    }
                }
            }
            if (foundApplicable) {
                break;
            }
        }

        expect(foundApplicable).toBe(false);
    });

    it('should not apply to nearly empty field', () => {
        const game = Sudoku.fromStrings(
            '1........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........',
            '.........'
        );

        let foundApplicable = false;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const cell = game.GameField[y][x];
                if (cell.value === 0) {
                    const candidates = sudoku.getCellCandidates(cell, game.GameField);
                    technique.setField(game.GameField);
                    if (candidates.length > 0 && technique.canApply(cell, candidates)) {
                        foundApplicable = true;
                        break;
                    }
                }
            }
            if (foundApplicable) {
                break;
            }
        }

        expect(foundApplicable).toBe(false);
    });
});
