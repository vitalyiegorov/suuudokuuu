import { StyleSheet } from 'react-native-unistyles';

export const AppMetricStripItemStyles = StyleSheet.create(() => ({
    item: {
        alignItems: 'center',
        flexShrink: 1,
        gap: 2,
        minWidth: 62
    },
    label: {
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.3,
        lineHeight: 11,
        textTransform: 'uppercase'
    },
    value: {
        fontVariant: ['tabular-nums'],
        fontSize: 18,
        fontWeight: '900',
        lineHeight: 20,
        textAlign: 'center'
    }
}));
