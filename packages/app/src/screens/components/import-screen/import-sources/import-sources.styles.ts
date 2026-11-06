import { StyleSheet } from 'react-native-unistyles';

export const ImportSourcesStyles = StyleSheet.create(theme => ({
    sources: { flex: 1, justifyContent: 'center', gap: theme.spacing.lg },
    hero: {
        backgroundColor: theme.colors.accent,
        borderRadius: 24,
        padding: theme.spacing.lg,
        gap: theme.spacing.sm,
        minHeight: 160,
        justifyContent: 'center'
    },
    title: { color: theme.colors.board.selectedText, fontSize: theme.typography.size.xl, fontWeight: '700' },
    subtitle: { color: theme.colors.board.selectedText, fontSize: theme.typography.size.md },
    chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: theme.spacing.sm },
    footer: { color: theme.colors.text.hint, textAlign: 'center', fontSize: theme.typography.size.md }
}));
