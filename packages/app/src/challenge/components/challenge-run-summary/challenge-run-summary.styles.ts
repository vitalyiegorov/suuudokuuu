import { StyleSheet } from 'react-native-unistyles';

export const ChallengeRunSummaryStyles = StyleSheet.create(theme => ({
    container: {
        alignItems: 'stretch',
        gap: theme.spacing.md,
        width: '100%'
    },
    headline: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        letterSpacing: -0.4,
        textAlign: 'center'
    }
}));
