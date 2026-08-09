import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip, AppMetricStripItem } from '@suuudokuuu/ui';
import { View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { RatingBadge } from '../../../../@generic/components/rating-badge/rating-badge';
import { useAppSelector } from '../../../../@generic/hooks/use-app-selector.hook';
import { useTimerText } from '../../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../../@generic/utils/get-difficulty-text.util';
import { gameDifficultySelector, gameIsRatingCeilingSelector, gameRatingSelector } from '../../../../game/store/game.selectors';
import { GameScreenMistakesValue } from '../game-screen-mistakes-value/game-screen-mistakes-value';
import { GameScreenSelectors } from '../game-screen.selectors';

import { GameScreenMetricsStyles as styles } from './game-screen-metrics.styles';

interface Props {
    readonly elapsedTime: number;
    readonly hasTimer: boolean;
    readonly maxMistakes: number;
    readonly maxMistakesReached: boolean;
    readonly mistakes: number;
    readonly score: number;
}

export const GameScreenMetrics = ({ elapsedTime, hasTimer, maxMistakes, maxMistakesReached, mistakes, score }: Props) => {
    const { t } = useLingui();
    const difficulty = useAppSelector(gameDifficultySelector);
    const rating = useAppSelector(gameRatingSelector);
    const isRatingCeiling = useAppSelector(gameIsRatingCeilingSelector);
    const elapsedTimeText = useTimerText(elapsedTime);
    const scoreText = String(score);
    const hasRating = isPositiveNumber(rating);

    return (
        <AppMetricStrip separatorStyle={styles.separator} style={styles.container} variant="ghost">
            <AppMetricStripItem
                label={t`Level`}
                labelStyle={styles.label}
                style={styles.item}
                testID={GameScreenSelectors.Level}
                value={getDifficultyText(difficulty)}
                valueStyle={styles.value}
            />

            {hasRating && (
                <AppMetricStripItem label={t`Rating`} labelStyle={styles.label} style={styles.item}>
                    <View testID={GameScreenSelectors.Rating}>
                        <RatingBadge isCeiling={isRatingCeiling} rating={rating} />
                    </View>
                </AppMetricStripItem>
            )}

            <AppMetricStripItem label={t`Mistakes`} labelStyle={styles.label} style={styles.item}>
                <GameScreenMistakesValue maxMistakes={maxMistakes} maxMistakesReached={maxMistakesReached} mistakes={mistakes} />
            </AppMetricStripItem>

            {hasTimer && (
                <AppMetricStripItem
                    label={t`Time`}
                    labelStyle={styles.label}
                    style={styles.item}
                    testID={GameScreenSelectors.Time}
                    value={elapsedTimeText}
                    valueStyle={styles.value}
                />
            )}

            <AppMetricStripItem
                label={t`Score`}
                labelStyle={styles.label}
                style={styles.item}
                testID={GameScreenSelectors.Score}
                value={scoreText}
                valueStyle={styles.value}
            />
        </AppMetricStrip>
    );
};
