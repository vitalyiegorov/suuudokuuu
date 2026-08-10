import { AppMetricStripItem } from '@suuudokuuu/ui';

import { HistoryMetricStyles as styles } from './history-metric.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children?: ReactNode;
    readonly label: string;
    readonly value?: string;
}

export const HistoryMetric = ({ children, label, value }: Props) => (
    <AppMetricStripItem label={label} labelStyle={styles.label} style={styles.item} value={value} valueStyle={styles.value}>
        {children}
    </AppMetricStripItem>
);
