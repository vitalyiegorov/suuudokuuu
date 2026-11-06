import { StyleSheet } from 'react-native-unistyles';

export const ImportStatusStyles = StyleSheet.create(theme => ({
    container: {
        minHeight: 48,
        flexShrink: 0,
        justifyContent: 'center',
        width: '100%'
    },
    message: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm },
    guidance: { color: theme.colors.text.primary, fontSize: theme.typography.size.sm, textAlign: 'center' },
    status: {
        flexShrink: 1,
        fontSize: theme.typography.size.md,
        fontWeight: '700',
        textAlign: 'center'
    }
}));
