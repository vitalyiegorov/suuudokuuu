import type { ReactNode } from 'react';

export interface AppMetricStripItemInterface {
    readonly label: string;
    readonly testID?: string;
    readonly value: string;
    readonly valueContent?: ReactNode;
    readonly valueColor?: string;
    readonly width?: number;
}
