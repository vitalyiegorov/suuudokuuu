import { StyleSheet } from 'react-native-unistyles';

export const HintPanelShowAnswerStyles = StyleSheet.create(theme => ({
    button: {
        alignSelf: 'flex-start',
        paddingVertical: theme.spacing.xs
    },
    text: {
        color: theme.colors.surface.raisedText,
        fontSize: theme.typography.size.sm,
        fontWeight: '700',
        textDecorationLine: 'underline'
    }
}));
