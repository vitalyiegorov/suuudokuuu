import { DifficultyEnum } from '@suuudokuuu/generator';
import { HELL_CORPUS_MINIMUM_RATING, getHellCorpusRecord } from '@suuudokuuu/hell-corpus';
import { SE_RATING_CEILING } from '@suuudokuuu/rating';
import { isCompleteValidGrid, parseGridString } from '@suuudokuuu/solver-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { describe, expect, it } from 'vitest';

import { ImportedPuzzleAssessmentKindEnum } from '../../../src/@generic/enums/imported-puzzle-assessment-kind.enum';
import { assessImportedPuzzle } from '../../../src/import/utils/assess-imported-puzzle.util';

const emptyRow = '.........';
const easyPuzzle = '2.846.9.5.75.....2.9.32.4.896.1438.75......6.7....82..32..1.54......41....9532...';
const aiEscargotPuzzle = '1....7.9..3..2...8..96..5....53..9...1..8...26....4...3......1..4......7..7...3..';

describe('assessImportedPuzzle', () => {
    it('should report every cell holding a duplicated given across rows, columns and boxes', () => {
        expect(assessImportedPuzzle(`1......1.${emptyRow}..1......${emptyRow.repeat(6)}`)).toStrictEqual({
            kind: ImportedPuzzleAssessmentKindEnum.CONFLICT,
            cellIndexes: [0, 7, 20]
        });
    });

    it('should report a conflict-free puzzle that has no solution', () => {
        expect(assessImportedPuzzle(`12345678.........9${emptyRow.repeat(7)}`)).toStrictEqual({
            kind: ImportedPuzzleAssessmentKindEnum.NO_SOLUTION
        });
    });

    it('should report a puzzle with more than one solution', () => {
        expect(assessImportedPuzzle(emptyRow.repeat(9))).toStrictEqual({ kind: ImportedPuzzleAssessmentKindEnum.MULTIPLE_SOLUTIONS });
    });

    it('should rate an easy puzzle into the Easy tier with its solver solution', () => {
        const assessment = assessImportedPuzzle(easyPuzzle);

        expect(assessment).toMatchObject({
            kind: ImportedPuzzleAssessmentKindEnum.UNIQUE,
            rating: 2.3,
            isRatingCeiling: false,
            hardestTechnique: SolutionTechniqueEnum.NakedSingle,
            difficulty: DifficultyEnum.Easy
        });
        expect(
            assessment.kind === ImportedPuzzleAssessmentKindEnum.UNIQUE && isCompleteValidGrid(parseGridString(assessment.solutionString))
        ).toBe(true);
    });

    it('should rate a Hell corpus puzzle into the Hell tier within the Hell rating band', () => {
        const record = getHellCorpusRecord(0);
        const assessment = assessImportedPuzzle(record.puzzle);

        expect(assessment).toMatchObject({
            kind: ImportedPuzzleAssessmentKindEnum.UNIQUE,
            rating: record.rating,
            isRatingCeiling: false,
            difficulty: DifficultyEnum.Hell
        });
        expect(assessment.kind === ImportedPuzzleAssessmentKindEnum.UNIQUE && assessment.rating >= HELL_CORPUS_MINIMUM_RATING).toBe(true);
        expect(assessment.kind === ImportedPuzzleAssessmentKindEnum.UNIQUE && assessment.rating <= SE_RATING_CEILING).toBe(true);
    });

    it('should rate AI Escargot at the rating ceiling into the Infinity tier', () => {
        expect(assessImportedPuzzle(aiEscargotPuzzle)).toMatchObject({
            kind: ImportedPuzzleAssessmentKindEnum.UNIQUE,
            rating: SE_RATING_CEILING,
            isRatingCeiling: true,
            hardestTechnique: SolutionTechniqueEnum.Guess,
            difficulty: DifficultyEnum.Infinity
        });
    });
});
