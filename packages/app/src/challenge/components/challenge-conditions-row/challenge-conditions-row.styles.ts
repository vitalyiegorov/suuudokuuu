import { StyleSheet } from 'react-native-unistyles';

export const ChallengeConditionsRowStyles = StyleSheet.create(theme => ({
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs,
        paddingTop: theme.spacing.xs,
        width: '100%'
    },
    text: {
        flex: 1,
        fontSize: 11,
        fontWeight: '700',
        lineHeight: 15,
        textAlign: 'left'
    }
}));
