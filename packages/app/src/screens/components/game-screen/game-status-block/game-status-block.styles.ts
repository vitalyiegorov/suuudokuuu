import { StyleSheet } from 'react-native-unistyles';

export const GameStatusBlockStyles = StyleSheet.create(theme => ({
    statusBlock: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 1,
        gap: theme.spacing.sm,
        justifyContent: 'space-between'
    }
}));
