import { StyleSheet } from 'react-native-unistyles';

export const ImportStatusStyles = StyleSheet.create(theme => ({
    container: {
        minHeight: 48,
        justifyContent: 'center',
        width: '100%'
    },
    status: {
        fontSize: theme.typography.size.md,
        fontWeight: '700',
        textAlign: 'center'
    }
}));
