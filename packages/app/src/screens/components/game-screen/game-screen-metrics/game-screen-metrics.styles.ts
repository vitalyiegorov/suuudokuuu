import { StyleSheet } from 'react-native';

export const GameScreenMetricsStyles = StyleSheet.create({
    container: {
        borderRadius: 26,
        minHeight: 52,
        paddingHorizontal: 10,
        paddingVertical: 7
    },
    item: {
        gap: 2
    },
    label: {
        fontSize: 8,
        letterSpacing: 0.8,
        lineHeight: 9,
        opacity: 0.55,
        textTransform: 'uppercase'
    },
    mistakesText: {
        fontVariant: ['tabular-nums'],
        fontSize: 14.5,
        fontWeight: '800',
        letterSpacing: -0.2,
        lineHeight: 17,
        textAlign: 'center'
    },
    separator: {
        height: 24,
        marginHorizontal: 1
    },
    value: {
        fontSize: 14.5,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        letterSpacing: -0.2,
        lineHeight: 17
    }
});
