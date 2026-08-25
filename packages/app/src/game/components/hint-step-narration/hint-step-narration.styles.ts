import { StyleSheet } from 'react-native-unistyles';

export const HintStepNarrationStyles = StyleSheet.create(theme => ({
    container: {
        gap: theme.spacing.xs / 2,
        width: '100%'
    },
    technique: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.4,
        textTransform: 'uppercase'
    },
    narration: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'left'
    }
}));
