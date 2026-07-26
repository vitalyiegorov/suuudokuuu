import { AppMetricStripItem } from '@suuudokuuu/ui';

import { HistoryMetricStyles as styles } from './history-metric.styles';

interface Props {
    readonly label: string;
    readonly value: string;
}

export const HistoryMetric = ({ label, value }: Props) => (
    <AppMetricStripItem label={label} labelStyle={styles.label} style={styles.item} value={value} valueStyle={styles.value} />
);
