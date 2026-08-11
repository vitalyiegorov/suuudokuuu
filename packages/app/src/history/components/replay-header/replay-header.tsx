import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip, AppMetricStripItem } from '@suuudokuuu/ui';
import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getLevelRatingText } from '../../../@generic/utils/get-level-rating-text.util';
import { getRatingExplainerHref } from '../../../@generic/utils/get-rating-explainer-href.util';

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
    const levelText = getLevelRatingText(getDifficultyText(game.difficulty), game.rating, game.isRatingCeiling);

    const handlePressLevel = () => {
        router.push(getRatingExplainerHref(game.rating, game.isRatingCeiling));
    };

    const levelItem = hasRating ? (
        <AppMetricStripItem label={t`Level`} labelStyle={styles.label} style={styles.item} valueStyle={styles.value}>
            <Pressable accessibilityRole="button" onPress={handlePressLevel} testID={ReplayHeaderSelectors.Level}>
                <Text allowFontScaling={false} numberOfLines={1} style={styles.value}>
                    {levelText}
                </Text>
            </Pressable>
        </AppMetricStripItem>
    ) : (
        <AppMetricStripItem
            label={t`Level`}
            labelStyle={styles.label}
            style={styles.item}
            testID={ReplayHeaderSelectors.Level}
            value={levelText}
            valueStyle={styles.value}
        />
    );

    return (
        <AppMetricStrip separatorStyle={styles.separator} style={styles.container} variant="ghost">
            {levelItem}
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
