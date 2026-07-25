import { StyleSheet } from 'react-native-unistyles';

export const ChallengeTechniqueBreakdownStyles = StyleSheet.create(theme => ({
    container: {
        gap: theme.spacing.xs,
        width: '100%'
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xs
    },
    headline: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        letterSpacing: -0.4,
        marginTop: 2,
        textAlign: 'center'
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        letterSpacing: 1.2,
        opacity: 0.68,
        textAlign: 'center',
        textTransform: 'uppercase'
    }
}));
