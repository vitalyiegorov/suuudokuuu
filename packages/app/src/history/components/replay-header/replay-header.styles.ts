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
    itemLevel: {
        gap: theme.spacing.xs,
        width: 84
    },
    itemMistakes: {
        gap: theme.spacing.xs,
        width: 76
    },
    itemScore: {
        gap: theme.spacing.xs,
        width: 68
    },
    itemTime: {
        gap: theme.spacing.xs,
        width: 86
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
