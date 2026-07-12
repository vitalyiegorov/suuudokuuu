import { useLingui } from '@lingui/react/macro';
import { AppMetricCard } from '@suuudokuuu/ui';
import { View } from 'react-native';

import { LoserScreenSelectors } from '../loser-screen.selectors';

import { LoserScreenMetricsStyles as styles } from './loser-screen-metrics.styles';

interface Props {
    readonly mistakesText: string;
    readonly timeText: string;
}

export const LoserScreenMetrics = ({ mistakesText, timeText }: Props) => {
    const { t } = useLingui();

    return (
        <View style={styles.container}>
            <AppMetricCard label={t`Time`} testID={LoserScreenSelectors.TimeValue} value={timeText} />
            <AppMetricCard label={t`Mistakes`} testID={LoserScreenSelectors.MistakesValue} value={mistakesText} />
        </View>
    );
};
