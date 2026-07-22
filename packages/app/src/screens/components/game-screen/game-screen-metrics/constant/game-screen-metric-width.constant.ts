import { ScoringMaximumScoreText } from '../../../../../scoring/constants/scoring-maximum-score.constant';

const GameScreenEdgeMetricMinimumWidth = 56;
const GameScreenScoreMetricCharacterWidth = 8;
const GameScreenScoreMetricHorizontalPadding = 10;

export const GameScreenElapsedMetricWidth = 58;
export const GameScreenMistakesMetricWidth = GameScreenEdgeMetricMinimumWidth;
export const GameScreenScoreMetricWidth = Math.max(
    GameScreenEdgeMetricMinimumWidth,
    ScoringMaximumScoreText.length * GameScreenScoreMetricCharacterWidth + GameScreenScoreMetricHorizontalPadding
);
