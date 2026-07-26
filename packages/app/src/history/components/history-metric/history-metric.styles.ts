import { StyleSheet } from 'react-native-unistyles';

export const HistoryMetricStyles = StyleSheet.create(() => ({
    item: {
        flex: 1,
        gap: 3,
        paddingHorizontal: 2
    },
    label: {
        fontSize: 10,
        letterSpacing: 0.9,
        opacity: 0.55,
        textTransform: 'uppercase'
    },
    value: {
        fontSize: 16,
        fontVariant: ['tabular-nums'],
        fontWeight: '700',
        letterSpacing: -0.2,
        lineHeight: 20
    }
}));
