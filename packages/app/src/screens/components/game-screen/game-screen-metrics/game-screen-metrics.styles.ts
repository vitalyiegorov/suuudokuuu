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
        fontSize: 8.5,
        letterSpacing: 1,
        lineHeight: 10,
        opacity: 0.6,
        textTransform: 'uppercase'
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
        fontVariant: ['tabular-nums'],
        fontWeight: '900',
        lineHeight: 19
    }
});
