import { StyleSheet } from 'react-native-unistyles';

export const ImportStatusStyles = StyleSheet.create(theme => ({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.sm,
        justifyContent: 'center',
        minHeight: 20,
        width: '100%'
    },
    icon: { width: 20, height: 20, flexShrink: 0 },
    status: {
        flexShrink: 1,
        fontSize: theme.typography.size.md,
        fontWeight: '700',
        textAlign: 'center'
    }
}));
