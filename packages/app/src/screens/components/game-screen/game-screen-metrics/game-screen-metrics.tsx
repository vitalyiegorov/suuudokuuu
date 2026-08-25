import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip, AppMetricStripItem } from '@suuudokuuu/ui';

import { useAppSelector } from '../../../../@generic/hooks/use-app-selector.hook';
import { useTimerText } from '../../../../@generic/hooks/use-timer-text.hook';
import { settingsKeySelector } from '../../../../settings/store/settings.selectors';
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
    const isCalmMode = useAppSelector(settingsKeySelector('calmMode'));
    const elapsedTimeText = useTimerText(elapsedTime);
    const scoreText = String(score);

    return (
        <AppMetricStrip separatorStyle={styles.separator} style={styles.container} variant="ghost">
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

            {!isCalmMode && (
                <AppMetricStripItem
                    label={t`Score`}
                    labelStyle={styles.label}
                    style={styles.item}
                    testID={GameScreenSelectors.Score}
                    value={scoreText}
                    valueStyle={styles.value}
                />
            )}
        </AppMetricStrip>
    );
};
