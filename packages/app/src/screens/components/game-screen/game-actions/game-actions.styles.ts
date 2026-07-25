import { StyleSheet } from 'react-native-unistyles';

export const GameActionsStyles = StyleSheet.create(theme => ({
    actions: {
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.sm,
        justifyContent: 'center'
    }
}));
