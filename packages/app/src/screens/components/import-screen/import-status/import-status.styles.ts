import { StyleSheet } from 'react-native-unistyles';

export const ImportStatusStyles = StyleSheet.create(theme => ({
    container: {
        minHeight: 48,
        flexShrink: 0,
        justifyContent: 'center',
        width: '100%'
    },
    icon: { width: 20, height: 20, flexShrink: 0 },
    message: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm },
    status: {
        flexShrink: 1,
        fontSize: theme.typography.size.md,
        fontWeight: '700',
        textAlign: 'center'
    }
}));
