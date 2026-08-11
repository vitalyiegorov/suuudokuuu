import { useLingui } from '@lingui/react/macro';
import { AppMetricStrip, AppMetricStripItem } from '@suuudokuuu/ui';

import { useAppSelector } from '../../../../@generic/hooks/use-app-selector.hook';
import { settingsKeySelector } from '../../../../settings/store/settings.selectors';
import { PauseScreenSelectors } from '../pause-screen.selectors';

import { PauseScreenStatsStyles as styles } from './pause-screen-stats.styles';

interface Props {
    readonly timeText: string;
    readonly scoreText: string;
    readonly mistakesText: string;
}

export const PauseScreenStats = ({ timeText, scoreText, mistakesText }: Props) => {
    const { t } = useLingui();
    const isCalmMode = useAppSelector(settingsKeySelector('calmMode'));

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
            {!isCalmMode && (
                <AppMetricStripItem
                    label={t`Score`}
                    labelStyle={styles.label}
                    style={styles.item}
                    testID={PauseScreenSelectors.ScoreValue}
                    value={scoreText}
                    valueStyle={styles.value}
                />
            )}
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
