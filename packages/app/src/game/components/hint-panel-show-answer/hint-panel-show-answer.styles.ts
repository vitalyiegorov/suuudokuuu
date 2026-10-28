import { StyleSheet } from 'react-native-unistyles';

export const HintPanelShowAnswerStyles = StyleSheet.create(theme => ({
    button: {
        alignSelf: 'center'
    },
    text: {
        color: theme.colors.surface.raisedText,
        fontSize: theme.typography.size.sm,
        fontWeight: '700',
        textDecorationLine: 'underline'
    }
}));
