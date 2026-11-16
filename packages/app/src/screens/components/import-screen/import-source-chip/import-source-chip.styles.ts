import { StyleSheet } from 'react-native-unistyles';

export const ImportSourceChipStyles = StyleSheet.create(theme => ({
    button: {
        alignItems: 'flex-start',
        borderRadius: theme.radius.md,
        flexBasis: 0,
        flexGrow: 1,
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: theme.spacing.md
    },
    content: { alignItems: 'center', flexShrink: 1, gap: theme.spacing.xs },
    text: { color: theme.colors.surface.subtleText, fontSize: 15, fontWeight: '700', textAlign: 'center' }
}));
