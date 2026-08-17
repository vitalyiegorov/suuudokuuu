import { describe, expect, it } from '@jest/globals';
import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { defaultScoringConfig } from '../interfaces/scoring-config.interface';

import { scoringGetMaximumScore } from './scoring-get-maximum-score.util';

const ExpectedMaximumScore = 441000;

describe('scoringGetMaximumScore', () => {
    it('calculates the safe display maximum for the current scoring rules', () => {
        expect(scoringGetMaximumScore(defaultScoringConfig, defaultSudokuConfig)).toBe(ExpectedMaximumScore);
    });
});
