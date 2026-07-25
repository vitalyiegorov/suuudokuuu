import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip } from '@suuudokuuu/ui';

import { PauseScreenSelectors } from '../pause-screen.selectors';

import { PauseScreenStatsStyles as styles } from './pause-screen-stats.styles';

import type { AppMetricStripItemInterface } from '@suuudokuuu/ui';

interface Props {
    readonly timeText: string;
    readonly scoreText: string;
    readonly mistakesText: string;
}

export const PauseScreenStats = ({ timeText, scoreText, mistakesText }: Props) => {
    const { t } = useLingui();

    const metricItems: AppMetricStripItemInterface[] = [
        { label: t`Time`, testID: PauseScreenSelectors.TimeValue, value: timeText },
        { label: t`Score`, testID: PauseScreenSelectors.ScoreValue, value: scoreText },
        { label: t`Mistakes`, testID: PauseScreenSelectors.MistakesValue, value: mistakesText }
    ];

    return (
        <AppMetricStrip
            itemStyle={styles.item}
            items={metricItems}
            labelStyle={styles.label}
            separatorStyle={styles.separator}
            style={styles.strip}
            valueStyle={styles.value}
            variant="secondary"
        />
    );
};
