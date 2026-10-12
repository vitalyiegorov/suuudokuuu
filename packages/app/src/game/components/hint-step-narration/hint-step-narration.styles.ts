import { StyleSheet } from 'react-native-unistyles';

const chipSize = 40;
const narrationLineHeight = 22;

export const HintStepNarrationStyles = StyleSheet.create(theme => ({
    container: {
        gap: theme.spacing.sm,
        minHeight: 0
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
    narrationScroll: {
        flexGrow: 1,
        minHeight: 0,
        flexShrink: 1
    },
    narration: {
        fontSize: theme.typography.size.md,
        fontWeight: '600',
        lineHeight: narrationLineHeight,
        textAlign: 'left'
    }
}));
