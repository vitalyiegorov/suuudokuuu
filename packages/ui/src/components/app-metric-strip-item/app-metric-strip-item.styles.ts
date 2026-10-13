import { StyleSheet } from 'react-native-unistyles';

export const AppMetricStripItemStyles = StyleSheet.create(theme => ({
    item: {
        alignItems: 'center',
        flexShrink: 1,
        gap: 2,
        minWidth: 62
    },
    label: {
        color: theme.colors.text.primary,
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.3,
        lineHeight: 11,
        textTransform: 'uppercase'
    },
    value: {
        color: theme.colors.text.primary,
        fontVariant: ['tabular-nums'],
        fontSize: 18,
        fontWeight: '900',
        lineHeight: 20,
        textAlign: 'center'
    }
}));
