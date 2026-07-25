import { ScoringMaximumScoreText } from '../../../../../scoring/constants/scoring-maximum-score.constant';

const GameScreenEdgeMetricMinimumWidth = 52;
const GameScreenScoreMetricCharacterWidth = 9;
const GameScreenScoreMetricHorizontalPadding = 8;

export const GameScreenElapsedMetricWidth = 56;
export const GameScreenMistakesMetricWidth = GameScreenEdgeMetricMinimumWidth;
export const GameScreenScoreMetricWidth = Math.max(
    GameScreenEdgeMetricMinimumWidth,
    ScoringMaximumScoreText.length * GameScreenScoreMetricCharacterWidth + GameScreenScoreMetricHorizontalPadding
);
