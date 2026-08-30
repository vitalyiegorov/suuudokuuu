import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

export const GameActionsStyles = StyleSheet.create((theme, rt) => ({
    actions: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.sm,
        justifyContent: appLayoutScreenIsWide(rt.screen) ? 'space-between' : 'center'
    }
}));
