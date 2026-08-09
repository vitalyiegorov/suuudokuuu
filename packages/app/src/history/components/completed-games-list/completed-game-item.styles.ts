import { StyleSheet } from 'react-native-unistyles';

export const CompletedGameItemStyles = StyleSheet.create(theme => ({
    container: {
        borderRadius: 22,
        borderWidth: StyleSheet.hairlineWidth,
        gap: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
        width: '100%'
    },
    difficulty: {
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 27,
        textAlign: 'left'
    },
    difficultyRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs
    },
    eyebrow: {
        fontSize: theme.typography.size.xs,
        fontWeight: '700',
        lineHeight: 16,
        textAlign: 'left'
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md,
        justifyContent: 'space-between',
        width: '100%'
    },
    metrics: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        width: '100%'
    },
    replayButton: {
        borderRadius: theme.radius.pill,
        flexDirection: 'row',
        gap: 6,
        minHeight: 42,
        paddingHorizontal: 14,
        paddingVertical: 9
    },
    replayText: {
        fontSize: theme.typography.size.sm,
        fontWeight: '800',
        lineHeight: 18
    },
    titleGroup: {
        flex: 1,
        gap: 2
    }
}));
