import { StyleSheet } from 'react-native-unistyles';

export const ReplayHardestMomentStyles = StyleSheet.create(theme => ({
    container: {
        alignItems: 'center',
        borderRadius: theme.radius.md,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm
    },
    textColumn: {
        flexShrink: 1,
        gap: 2
    },
    caption: {
        fontSize: theme.typography.size.xs,
        letterSpacing: 0.4,
        textTransform: 'uppercase'
    },
    value: {
        fontSize: theme.typography.size.sm,
        fontWeight: '700'
    }
}));
