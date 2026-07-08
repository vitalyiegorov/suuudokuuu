import { StyleSheet } from 'react-native';

export const AppMetricCardStyles = StyleSheet.create({
    card: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    cardCompact: {
        minHeight: 72
    },
    cardRegular: {
        minHeight: 88
    },
    label: {
        fontWeight: '800',
        textAlign: 'center'
    },
    labelCompact: {
        fontSize: 12,
        lineHeight: 16
    },
    labelRegular: {
        fontSize: 14,
        lineHeight: 18
    },
    value: {
        fontWeight: '900',
        textAlign: 'center'
    },
    valueCompact: {
        fontSize: 22,
        lineHeight: 26,
        marginTop: 5
    },
    valueRegular: {
        fontSize: 25,
        lineHeight: 30,
        marginTop: 8
    }
});
