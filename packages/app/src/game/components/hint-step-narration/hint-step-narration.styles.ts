import { StyleSheet } from 'react-native-unistyles';

import { HintNarrationLineHeightConstant } from '../../constant/hint-narration-line-height.constant';

const chipSize = 40;

export const HintStepNarrationStyles = StyleSheet.create(theme => ({
    container: {
        gap: theme.spacing.xs,
        minHeight: 0
    },
    placementContainer: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: theme.spacing.sm
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
        flexGrow: 0,
        flexShrink: 1,
        minHeight: 0
    },
    linkProgress: {
        color: theme.colors.text.hint,
        fontSize: theme.typography.size.sm,
        fontVariant: ['tabular-nums'],
        fontWeight: '700',
        textAlign: 'left'
    },
    narration: {
        flexShrink: 1,
        fontSize: theme.typography.size.md,
        fontWeight: '600',
        lineHeight: HintNarrationLineHeightConstant,
        textAlign: 'left'
    }
}));
