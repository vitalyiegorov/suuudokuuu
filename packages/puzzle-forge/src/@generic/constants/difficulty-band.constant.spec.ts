import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { DIFFICULTY_BANDS } from './difficulty-band.constant';

const legacyDifficultyOrder = ['Newbie', 'Easy', 'Medium', 'Hard', 'Nightmare', 'Hell'];
const legacyInferenceBlankCells: Record<string, number> = {
    Newbie: 10,
    Easy: 30,
    Medium: 40,
    Hard: 50,
    Nightmare: 59,
    Hell: 64
};
const legacyNewbiePuzzle = '9743.28565289.63171637.8294249.816736.72345893856971...528.9731896.73425731425968';

describe('DIFFICULTY_BANDS', () => {
    it('should keep the append-only tier list unchanged', () => {
        expect.assertions(2);

        expect(Object.values(DifficultyEnum)).toStrictEqual(legacyDifficultyOrder);
        expect(Object.keys(DIFFICULTY_BANDS)).toStrictEqual(legacyDifficultyOrder);
    });

    it('should leave the legacy blank-count inference table frozen', () => {
        expect.assertions(1);

        expect(defaultSudokuConfig.difficultyBlankCells).toStrictEqual(legacyInferenceBlankCells);
    });

    it('should keep labelling pre-trailer shared links from their blank count', () => {
        expect.assertions(1);

        const [, difficulty] = Sudoku.convertFieldFromString(legacyNewbiePuzzle, defaultSudokuConfig);

        expect(difficulty).toBe(DifficultyEnum.Newbie);
    });

    it('should raise the blank-cell target with every tier', () => {
        expect.assertions(5);

        const blankCells = Object.values(DifficultyEnum).map(difficulty => DIFFICULTY_BANDS[difficulty].blankCells);

        for (const [index, count] of blankCells.slice(1).entries()) {
            expect(count).toBeGreaterThan(blankCells[index]);
        }
    });
});
