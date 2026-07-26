import { StyleSheet } from 'react-native-unistyles';

export const GameResultPageStyles = StyleSheet.create(theme => ({
    content: {
        alignItems: 'stretch',
        flexGrow: 1,
        gap: theme.spacing.md,
        maxWidth: theme.contentWidth.standard,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        width: '100%'
    }
}));
