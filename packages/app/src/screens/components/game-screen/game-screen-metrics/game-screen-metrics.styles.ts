import { StyleSheet } from 'react-native';

export const GameScreenMetricsStyles = StyleSheet.create({
    container: {
        borderRadius: 28,
        minHeight: 52,
        paddingHorizontal: 10,
        paddingVertical: 7
    },
    item: {
        gap: 1
    },
    label: {
        fontSize: 8,
        letterSpacing: 0.8,
        lineHeight: 10
    },
    mistakesText: {
        fontVariant: ['tabular-nums'],
        fontSize: 17,
        fontWeight: '900',
        lineHeight: 19,
        textAlign: 'center'
    },
    separator: {
        height: 30,
        marginHorizontal: 1
    },
    value: {
        fontSize: 17,
        lineHeight: 19
    }
});
