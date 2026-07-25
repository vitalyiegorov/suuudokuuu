import { View } from 'react-native';

import { ScreenActionBarStyles as styles } from './screen-action-bar.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly left?: ReactNode;
    readonly right?: ReactNode;
}

export const ScreenActionBar = ({ children, left, right }: Props) => (
    <View style={styles.container}>
        <View style={styles.side}>{left}</View>
        <View style={styles.main}>{children}</View>
        <View style={styles.side}>{right}</View>
    </View>
);
