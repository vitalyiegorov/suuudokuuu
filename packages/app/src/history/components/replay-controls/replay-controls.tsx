import { View } from 'react-native';

import { ReplayControlsSelectors } from './replay-controls.selectors';
import { ReplayControlsStyles as styles } from './replay-controls.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const ReplayControls = ({ children }: Props) => (
    <View style={styles.container} testID={ReplayControlsSelectors.Root}>
        {children}
    </View>
);
