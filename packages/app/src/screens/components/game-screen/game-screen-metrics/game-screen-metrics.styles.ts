import { StyleSheet } from 'react-native-unistyles';

export const GameScreenMetricsStyles = StyleSheet.create(() => ({
    container: {
        minHeight: 52,
        paddingHorizontal: 0,
        paddingVertical: 4
    },
    item: {
        gap: 3,
        paddingHorizontal: 7,
        width: 'auto'
    },
    label: {
        fontSize: 10,
        letterSpacing: 0.9,
        lineHeight: 12,
        opacity: 0.55,
        textTransform: 'uppercase'
    },
    separator: {
        height: 28,
        marginHorizontal: 0
    },
    value: {
        fontSize: 16,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        letterSpacing: -0.2,
        lineHeight: 20
    }
}));
