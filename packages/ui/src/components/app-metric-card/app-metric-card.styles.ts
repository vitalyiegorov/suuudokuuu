import { StyleSheet } from 'react-native-unistyles';

export const AppMetricCardStyles = StyleSheet.create(theme => ({
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
        fontSize: theme.typography.size.xs,
        lineHeight: 16
    },
    labelRegular: {
        fontSize: theme.typography.size.sm,
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
        marginTop: theme.spacing.sm
    }
}));
