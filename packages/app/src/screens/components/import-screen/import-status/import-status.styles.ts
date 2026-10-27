import { StyleSheet } from 'react-native-unistyles';

export const ImportStatusStyles = StyleSheet.create(theme => ({
    clueCount: {
        fontSize: theme.typography.size.sm
    },
    container: {
        alignItems: 'center',
        gap: theme.spacing.xs,
        width: '100%'
    },
    status: {
        fontSize: theme.typography.size.md,
        fontWeight: '700',
        textAlign: 'center'
    }
}));
