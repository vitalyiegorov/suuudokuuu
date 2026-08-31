import { StyleSheet } from 'react-native-unistyles';

export const HintStepNarrationStyles = StyleSheet.create(theme => ({
    container: {
        flex: 1,
        gap: theme.spacing.xs / 2
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm
    },
    chip: {
        alignItems: 'center',
        borderRadius: theme.radius.sm,
        height: 38,
        justifyContent: 'center',
        width: 38
    },
    chipText: {
        fontSize: 20,
        fontWeight: '900'
    },
    technique: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.4,
        textTransform: 'uppercase'
    },
    narration: {
        flex: 1,
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'left'
    }
}));
