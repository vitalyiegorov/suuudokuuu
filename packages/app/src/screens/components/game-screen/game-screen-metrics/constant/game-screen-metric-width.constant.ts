import { ScoringMaximumScoreText } from '../../../../../scoring/constants/scoring-maximum-score.constant';

const GameScreenEdgeMetricMinimumWidth = 68;
const GameScreenScoreMetricCharacterWidth = 9;
const GameScreenScoreMetricHorizontalPadding = 14;

export const GameScreenElapsedMetricWidth = 72;
export const GameScreenMistakesMetricWidth = GameScreenEdgeMetricMinimumWidth;
export const GameScreenScoreMetricWidth = Math.max(
    GameScreenEdgeMetricMinimumWidth,
    ScoringMaximumScoreText.length * GameScreenScoreMetricCharacterWidth + GameScreenScoreMetricHorizontalPadding
);
