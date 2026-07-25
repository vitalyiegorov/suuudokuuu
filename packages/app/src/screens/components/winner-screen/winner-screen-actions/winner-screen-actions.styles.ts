import { StyleSheet } from 'react-native-unistyles';

export const WinnerScreenActionsStyles = StyleSheet.create(theme => ({
    actionsRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        width: '100%'
    },
    button: {
        flex: 1,
        maxWidth: '100%'
    }
}));
