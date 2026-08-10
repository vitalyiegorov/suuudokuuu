import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip, AppMetricStripItem } from '@suuudokuuu/ui';

import { isPositiveNumber } from '@rnw-community/shared';

import { RatingMetricItem } from '../../../@generic/components/rating-metric-item/rating-metric-item';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';

import { ReplayHeaderSelectors } from './replay-header.selectors';
import { ReplayHeaderStyles as styles } from './replay-header.styles';

import type { CompletedGameInterface } from '../../interfaces/completed-game.interface';

interface Props {
    readonly game: CompletedGameInterface;
}

const RelaxedMistakeLimit = 99;

export const ReplayHeader = ({ game }: Props) => {
    const { t } = useLingui();
    const elapsedTimeText = useTimerText(game.elapsedTime);
    const mistakesValue = game.maxMistakes >= RelaxedMistakeLimit ? `${game.mistakes}/∞` : `${game.mistakes}/${game.maxMistakes}`;
    const hasRating = isPositiveNumber(game.rating);

    return (
        <AppMetricStrip separatorStyle={styles.separator} style={styles.container} variant="ghost">
            <AppMetricStripItem
                label={t`Level`}
                labelStyle={styles.label}
                style={styles.item}
                value={getDifficultyText(game.difficulty)}
                valueStyle={styles.value}
            />
            {hasRating && (
                <RatingMetricItem
                    isCeiling={game.isRatingCeiling}
                    itemStyle={styles.item}
                    labelStyle={styles.label}
                    rating={game.rating}
                    testID={ReplayHeaderSelectors.Rating}
                />
            )}
            <AppMetricStripItem
                label={t`Score`}
                labelStyle={styles.label}
                style={styles.item}
                value={String(game.score)}
                valueStyle={styles.value}
            />
            <AppMetricStripItem
                label={t`Mistakes`}
                labelStyle={styles.label}
                style={styles.item}
                value={mistakesValue}
                valueStyle={styles.value}
            />
            <AppMetricStripItem
                label={t`Time`}
                labelStyle={styles.label}
                style={styles.item}
                value={elapsedTimeText}
                valueStyle={styles.value}
            />
        </AppMetricStrip>
    );
};
