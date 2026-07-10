import { StyleSheet } from 'react-native-unistyles';

export const SupportUkrainePillStyles = StyleSheet.create(theme => ({
    container: {
        alignItems: 'center',
        borderRadius: theme.radius.pill,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'center',
        minHeight: 32,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 7
    },
    text: {
        fontSize: theme.typography.size.xs,
        fontWeight: '800',
        lineHeight: 15
    }
}));
