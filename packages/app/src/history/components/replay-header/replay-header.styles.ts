import { StyleSheet } from 'react-native-unistyles';

export const ReplayHeaderStyles = StyleSheet.create(theme => ({
    container: {
        alignSelf: 'center',
        maxWidth: '100%',
        minHeight: 68
    },
    item: {
        gap: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        width: 'auto'
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
