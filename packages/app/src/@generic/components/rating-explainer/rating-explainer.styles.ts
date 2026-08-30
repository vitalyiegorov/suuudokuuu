import { StyleSheet } from 'react-native-unistyles';

export const RatingExplainerStyles = StyleSheet.create(theme => ({
    container: {
        gap: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
        paddingHorizontal: theme.spacing.lg,
        width: '100%'
    },
    title: {
        fontSize: theme.typography.size.xl,
        fontWeight: '700'
    },
    sectionTitle: {
        fontSize: theme.typography.size.md,
        fontWeight: '700',
        marginTop: theme.spacing.sm
    },
    bodyText: {
        fontSize: theme.typography.size.sm,
        lineHeight: 20
    },
    currentRatingRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm
    },
    bandList: {
        gap: theme.spacing.xs
    },
    bandRow: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs
    },
    bandName: {
        fontSize: theme.typography.size.sm,
        fontWeight: '700'
    },
    bandRange: {
        fontSize: theme.typography.size.sm,
        fontVariant: ['tabular-nums']
    }
}));
