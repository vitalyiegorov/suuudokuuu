import { StyleSheet } from 'react-native-unistyles';

const chipSize = 40;
const techniqueLetterSpacing = 0.6;
const narrationLineHeight = 22;

export const HintStepNarrationStyles = StyleSheet.create(theme => ({
    container: {
        flexShrink: 1,
        gap: theme.spacing.sm,
        minHeight: 0
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md,
        minHeight: chipSize
    },
    chip: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.md,
        height: chipSize,
        justifyContent: 'center',
        width: chipSize
    },
    chipText: {
        fontSize: theme.typography.size.lg,
        fontWeight: '900'
    },
    technique: {
        flex: 1,
        fontSize: theme.typography.size.xs,
        fontWeight: '900',
        letterSpacing: techniqueLetterSpacing,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    narrationScroll: {
        flexGrow: 0,
        flexShrink: 1
    },
    narration: {
        fontSize: theme.typography.size.md,
        fontWeight: '600',
        lineHeight: narrationLineHeight,
        textAlign: 'left'
    }
}));
