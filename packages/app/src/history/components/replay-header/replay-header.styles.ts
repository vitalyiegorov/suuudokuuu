import { StyleSheet } from 'react-native-unistyles';

export const ReplayHeaderStyles = StyleSheet.create(theme => ({
    container: {
        alignSelf: 'center',
        borderRadius: 34,
        maxWidth: theme.contentWidth.narrow,
        minHeight: 68,
        paddingHorizontal: 18,
        paddingVertical: 10,
        width: '100%'
    },
    item: {
        gap: theme.spacing.xs
    },
    label: {
        fontSize: 10,
        letterSpacing: 0.5,
        lineHeight: 12
    },
    separator: {
        height: 36,
        marginHorizontal: 2
    },
    value: {
        fontSize: 17,
        lineHeight: 20
    }
}));
