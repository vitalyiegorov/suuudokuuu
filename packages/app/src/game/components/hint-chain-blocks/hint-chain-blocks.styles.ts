import { StyleSheet } from 'react-native-unistyles';

export const HintChainBlocksStyles = StyleSheet.create(theme => ({
    container: {
        gap: theme.spacing.xs
    },
    chain: {
        direction: 'ltr',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs
    },
    link: {
        maxWidth: '100%',
        flexShrink: 1,
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs
    },
    block: {
        flexShrink: 1,
        backgroundColor: theme.colors.surface.subtle,
        borderColor: theme.colors.accent,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs
    },
    blockText: {
        color: theme.colors.surface.subtleText,
        fontSize: theme.typography.size.sm,
        fontVariant: ['tabular-nums'],
        fontWeight: '700'
    },
    arrow: {
        color: theme.colors.text.hint,
        fontSize: theme.typography.size.sm
    },
    earlierBlock: {
        borderColor: theme.colors.surface.border
    },
    contradiction: {
        maxWidth: '100%',
        flexShrink: 1,
        backgroundColor: theme.colors.danger,
        borderRadius: theme.radius.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs
    },
    contradictionText: {
        color: theme.colors.dangerText,
        fontSize: theme.typography.size.sm,
        fontWeight: '700'
    }
}));
