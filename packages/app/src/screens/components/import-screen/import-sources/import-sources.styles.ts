import { StyleSheet } from 'react-native-unistyles';

export const ImportSourcesStyles = StyleSheet.create(theme => ({
    sources: { gap: theme.spacing.lg },
    hero: {
        alignItems: 'center',
        backgroundColor: theme.colors.ink,
        borderRadius: 24,
        padding: theme.spacing.lg,
        gap: theme.spacing.sm,
        minHeight: 160,
        justifyContent: 'center'
    },
    title: { color: theme.colors.inkText, fontSize: theme.typography.size.xl, fontWeight: '700', textAlign: 'center' },
    subtitle: { color: theme.colors.inkText, fontSize: theme.typography.size.md, textAlign: 'center' },
    chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: theme.spacing.sm },
    footer: { color: theme.colors.text.hint, textAlign: 'center', fontSize: theme.typography.size.md }
}));
