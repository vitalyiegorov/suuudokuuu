import { StyleSheet } from 'react-native-unistyles';

export const BlackButtonStyles = StyleSheet.create(theme => ({
    button: {
        alignItems: 'center',
        borderWidth: 0,
        justifyContent: 'center',
        maxWidth: theme.contentWidth.narrow,
        outlineOffset: 0,
        outlineWidth: 0,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: 10
    },
    buttonText: {
        textAlign: 'center'
    }
}));
