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
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 0.2,
        lineHeight: 17,
        paddingHorizontal: theme.spacing.xs,
        textTransform: 'uppercase'
    }
}));
