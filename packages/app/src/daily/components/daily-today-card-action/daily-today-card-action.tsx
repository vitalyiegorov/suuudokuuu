import { View } from 'react-native';

import { DailyTodayCardActionStyles as styles } from './daily-today-card-action.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const DailyTodayCardAction = ({ children }: Props) => <View style={styles.root}>{children}</View>;
