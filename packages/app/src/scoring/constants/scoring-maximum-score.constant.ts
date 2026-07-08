import { defaultSudokuConfig } from '@suuudokuuu/generator';

import { defaultScoringConfig } from '../interfaces/scoring-config.interface';
import { scoringGetMaximumScore } from '../utils/scoring-get-maximum-score.util';

const ScoringMaximumScore = scoringGetMaximumScore(defaultScoringConfig, defaultSudokuConfig);

export const ScoringMaximumScoreText = String(ScoringMaximumScore);
