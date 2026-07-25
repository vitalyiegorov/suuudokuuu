import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip } from '@suuudokuuu/ui';
import { use } from 'react';
import { Text } from 'react-native';

import { useTimerText } from '../../../../@generic/hooks/use-timer-text.hook';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { GameScreenSelectors } from '../game-screen.selectors';

import {
    GameScreenElapsedMetricWidth,
    GameScreenMistakesMetricWidth,
    GameScreenScoreMetricWidth
} from './constant/game-screen-metric-width.constant';
import { GameScreenMetricsStyles as styles } from './game-screen-metrics.styles';

import type { AppMetricStripItemInterface } from '@suuudokuuu/ui';

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
    const { theme } = use(ThemeContext);
    const mistakesColor = maxMistakesReached ? theme.colors.red : theme.colors.label.main;
    const mistakesTextStyles = [styles.mistakesText, { color: mistakesColor }];
    const mistakesValue = `${mistakes}/${maxMistakes}`;
    const elapsedTimeText = useTimerText(elapsedTime);
    const scoreText = String(score);
    const mistakesContent = (
        <Text allowFontScaling={false} numberOfLines={1} style={mistakesTextStyles}>
            <Text testID={GameScreenSelectors.MistakesCount}>{mistakes}</Text>
            <Text>/</Text>
            <Text testID={GameScreenSelectors.MaxMistakesAllowed}>{maxMistakes}</Text>
        </Text>
    );
    const mistakeItem: AppMetricStripItemInterface = {
        label: t`Mistakes`,
        value: mistakesValue,
        valueContent: mistakesContent,
        valueColor: mistakesColor,
        width: GameScreenMistakesMetricWidth
    };
    const scoreItem: AppMetricStripItemInterface = {
        label: t`Score`,
        testID: GameScreenSelectors.Score,
        value: scoreText,
        width: GameScreenScoreMetricWidth
    };

    const elapsedItem: AppMetricStripItemInterface = {
        label: t`Time`,
        testID: GameScreenSelectors.Time,
        value: elapsedTimeText,
        width: GameScreenElapsedMetricWidth
    };
    let metricItems = [mistakeItem, scoreItem];

    if (hasTimer) {
        metricItems = [mistakeItem, elapsedItem, scoreItem];
    }

    return (
        <AppMetricStrip
            itemStyle={styles.item}
            items={metricItems}
            labelStyle={styles.label}
            separatorStyle={styles.separator}
            style={styles.container}
            valueStyle={styles.value}
            variant="secondary"
        />
    );
};
