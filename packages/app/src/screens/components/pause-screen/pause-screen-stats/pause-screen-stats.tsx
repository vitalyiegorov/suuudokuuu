import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip, AppMetricStripValueItem } from '@suuudokuuu/ui';

import { useSettings } from '../../../../settings/query/use-settings.query';
import { PauseScreenSelectors } from '../pause-screen.selectors';

import { PauseScreenStatsStyles as styles } from './pause-screen-stats.styles';

interface Props {
    readonly timeText: string;
    readonly scoreText: string;
    readonly mistakesText: string;
}

export const PauseScreenStats = ({ timeText, scoreText, mistakesText }: Props) => {
    const { t } = useLingui();
    const isCalmMode = useSettings().calmMode;

    return (
        <AppMetricStrip separatorStyle={styles.separator} style={styles.strip} variant="ghost">
            <AppMetricStripValueItem
                label={t`Time`}
                labelStyle={styles.label}
                style={styles.item}
                testID={PauseScreenSelectors.TimeValue}
                value={timeText}
                valueStyle={styles.value}
            />
            {!isCalmMode && (
                <AppMetricStripValueItem
                    label={t`Score`}
                    labelStyle={styles.label}
                    style={styles.item}
                    testID={PauseScreenSelectors.ScoreValue}
                    value={scoreText}
                    valueStyle={styles.value}
                />
            )}
            <AppMetricStripValueItem
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
