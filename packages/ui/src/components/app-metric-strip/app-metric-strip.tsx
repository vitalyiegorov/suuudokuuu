import { type StyleProp, View, type ViewStyle } from 'react-native';

import { interleaveChildren } from '../../utils/interleave-children.util';

import { AppMetricStripStyles as styles } from './app-metric-strip.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly separatorStyle?: StyleProp<ViewStyle>;
    readonly style?: StyleProp<ViewStyle>;
}

export const AppMetricStrip = ({ children, separatorStyle, style }: Props) => {
    const stripStyles = [styles.strip, style];
    const separatorStyles = [styles.separator, separatorStyle];

    return <View style={stripStyles}>{interleaveChildren(children, <View style={separatorStyles} />)}</View>;
};
