import { StyleSheet } from 'react-native-unistyles';

export const RatingBadgeStyles = StyleSheet.create(theme => ({
    pill: {
        alignItems: 'center',
        borderRadius: theme.radius.pill,
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        minHeight: 28,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4
    },
    value: {
        fontSize: theme.typography.size.sm,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        letterSpacing: -0.2
    }
}));
