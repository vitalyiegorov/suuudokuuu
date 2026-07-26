import { StyleSheet } from 'react-native-unistyles';

export const ReplayTopBarStyles = StyleSheet.create(theme => ({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.xs,
        width: '100%'
    },
    titleRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md
    },
    accent: {
        borderRadius: theme.radius.pill,
        height: 30,
        width: 10
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        lineHeight: 34
    },
    closeButton: {
        height: 52,
        width: 52
    }
}));
