import { StyleSheet } from 'react-native-unistyles';

export const HistoryTechniqueHeroStyles = StyleSheet.create(theme => ({
    container: {
        gap: 10,
        width: '100%'
    },
    details: {
        flex: 1,
        gap: 4
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.2
    },
    name: {
        fontSize: 19,
        fontWeight: '800',
        letterSpacing: -0.3,
        lineHeight: 23
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.lg
    },
    seValue: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.1
    }
}));
