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
        paddingVertical: 10,
        _web: {
            cursor: 'pointer',
            transitionDuration: '120ms',
            transitionProperty: 'opacity,transform',
            '_focus-visible': {
                outlineColor: theme.colors.black,
                outlineOffset: 2,
                outlineStyle: 'solid',
                outlineWidth: 2
            }
        }
    },
    buttonText: {
        textAlign: 'center'
    }
}));
