import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip, AppMetricStripItem } from '@suuudokuuu/ui';

import { PauseScreenSelectors } from '../pause-screen.selectors';

import { PauseScreenStatsStyles as styles } from './pause-screen-stats.styles';

interface Props {
    readonly timeText: string;
    readonly scoreText: string;
    readonly mistakesText: string;
}

export const PauseScreenStats = ({ timeText, scoreText, mistakesText }: Props) => {
    const { t } = useLingui();

    return (
        <AppMetricStrip separatorStyle={styles.separator} style={styles.strip} variant="ghost">
            <AppMetricStripItem
                label={t`Time`}
                labelStyle={styles.label}
                style={styles.item}
                testID={PauseScreenSelectors.TimeValue}
                value={timeText}
                valueStyle={styles.value}
            />
            <AppMetricStripItem
                label={t`Score`}
                labelStyle={styles.label}
                style={styles.item}
                testID={PauseScreenSelectors.ScoreValue}
                value={scoreText}
                valueStyle={styles.value}
            />
            <AppMetricStripItem
                label={t`Mistakes`}
                labelStyle={styles.label}
                style={styles.item}
                testID={PauseScreenSelectors.MistakesValue}
                value={mistakesText}
                valueStyle={styles.value}
            />
        </AppMetricStrip>
    );
};
