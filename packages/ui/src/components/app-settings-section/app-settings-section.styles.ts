import { StyleSheet } from 'react-native-unistyles';

export const AppSettingsSectionStyles = StyleSheet.create(theme => ({
    rows: {
        gap: theme.spacing.md,
        width: '100%'
    },
    section: {
        gap: theme.spacing.md,
        width: '100%'
    },
    title: {
        fontSize: theme.typography.size.xs,
        fontWeight: theme.typography.weight.bold,
        letterSpacing: 0.2,
        lineHeight: 16,
        paddingHorizontal: theme.spacing.xs,
        textTransform: 'uppercase'
    }
}));
