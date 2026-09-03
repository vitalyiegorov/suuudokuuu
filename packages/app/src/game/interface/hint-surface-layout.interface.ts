import type { HintSurfaceMetricsInterface } from './hint-surface-metrics.interface';
import type { LayoutChangeEvent } from 'react-native';

export interface HintSurfaceLayoutInterface {
    readonly hintSurfaceMetrics: HintSurfaceMetricsInterface;
    readonly onToolsSlotLayout: (event: LayoutChangeEvent) => void;
}
