import { useLingui } from '@lingui/react/macro';
import { AppMetricCard } from '@suuudokuuu/ui';
import { View } from 'react-native';

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
        <View style={styles.container}>
            <AppMetricCard label={t`Time`} size="compact" testID={PauseScreenSelectors.TimeValue} value={timeText} variant="inverted" />
            <AppMetricCard label={t`Score`} size="compact" testID={PauseScreenSelectors.ScoreValue} value={scoreText} />
            <AppMetricCard label={t`Mistakes`} size="compact" testID={PauseScreenSelectors.MistakesValue} value={mistakesText} />
        </View>
    );
};
