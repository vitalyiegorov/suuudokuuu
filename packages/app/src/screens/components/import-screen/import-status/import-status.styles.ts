import { StyleSheet } from 'react-native-unistyles';

export const ImportStatusStyles = StyleSheet.create(theme => ({
    container: {
        minHeight: 48,
        justifyContent: 'center',
        width: '100%'
    },
    message: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    guidance: { color: theme.colors.text.primary, fontSize: theme.typography.size.sm, textAlign: 'center' },
    status: {
        flex: 1,
        fontSize: theme.typography.size.md,
        fontWeight: '700',
        textAlign: 'center'
    }
}));
