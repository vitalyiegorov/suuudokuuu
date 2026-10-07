import { StyleSheet } from 'react-native-unistyles';

import type { ViewStyle } from 'react-native';

export const LayoutDirectionViewStyles = StyleSheet.create(() => ({
    root: (direction: ViewStyle['direction']) => ({
        direction,
        flex: 1
    })
}));
