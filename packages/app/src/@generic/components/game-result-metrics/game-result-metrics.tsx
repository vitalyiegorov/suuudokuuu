import { ReactNode } from 'react';
import { View } from 'react-native';

import { GameResultMetricsStyles as styles } from './game-result-metrics.styles';

interface Props {
    readonly children: ReactNode;
}

export const GameResultMetrics = ({ children }: Props): ReactNode => <View style={styles.metrics}>{children}</View>;
