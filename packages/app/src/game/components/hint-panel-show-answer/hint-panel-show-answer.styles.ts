import { StyleSheet } from 'react-native-unistyles';

export const HintPanelShowAnswerStyles = StyleSheet.create(theme => ({
    button: {
        alignSelf: 'stretch'
    },
    text: {
        color: theme.colors.surface.raisedText,
        fontSize: theme.typography.size.sm,
        fontWeight: '700',
        textAlign: 'center',
        textDecorationLine: 'underline'
    }
}));
