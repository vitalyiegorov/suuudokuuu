import { StyleSheet } from 'react-native-unistyles';

export const ChallengeTechniqueBreakdownStyles = StyleSheet.create(theme => ({
    container: {
        gap: theme.spacing.lg,
        width: '100%'
    },
    header: {
        alignItems: 'center'
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
        textAlign: 'center',
        textTransform: 'uppercase'
    }
}));
