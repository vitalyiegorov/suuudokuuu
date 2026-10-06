import { StyleSheet } from 'react-native-unistyles';

export const DailyRecentSolvesStyles = StyleSheet.create(theme => ({
    empty: {
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'left'
    },
    eyebrow: {
        fontSize: 11.5,
        fontWeight: '800',
        letterSpacing: 1.1,
        lineHeight: 14,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    list: {
        borderCurve: 'continuous',
        borderRadius: 18,
        overflow: 'hidden'
    },
    root: {
        gap: theme.spacing.md,
        width: '100%'
    }
}));
