import { ScoringMaximumScoreText } from '../../../../../scoring/constants/scoring-maximum-score.constant';

const GameScreenEdgeMetricMinimumWidth = 60;
const GameScreenScoreMetricCharacterWidth = 9;
const GameScreenScoreMetricHorizontalPadding = 10;

export const GameScreenElapsedMetricWidth = 64;
export const GameScreenMistakesMetricWidth = GameScreenEdgeMetricMinimumWidth;
export const GameScreenScoreMetricWidth = Math.max(
    GameScreenEdgeMetricMinimumWidth,
    ScoringMaximumScoreText.length * GameScreenScoreMetricCharacterWidth + GameScreenScoreMetricHorizontalPadding
);
