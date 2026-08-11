import { StyleSheet } from 'react-native-unistyles';

export const HistorySolverProfileStyles = StyleSheet.create(theme => ({
    container: {
        gap: 20,
        width: '100%'
    },
    eyebrow: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.1,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    hero: {
        gap: 6,
        _web: {
            cursor: 'pointer',
            _hover: { opacity: 0.85 }
        }
    },
    headline: {
        fontSize: 56,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        letterSpacing: -1.5,
        lineHeight: 60,
        textAlign: 'left'
    },
    spectrum: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        width: '100%'
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'left'
    }
}));
