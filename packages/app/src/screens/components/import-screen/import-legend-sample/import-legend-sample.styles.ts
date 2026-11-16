import { StyleSheet } from 'react-native-unistyles';

export const ImportLegendSampleStyles = StyleSheet.create(theme => ({
    sample: { alignItems: 'center', flexDirection: 'row', gap: theme.spacing.sm },
    cell: {
        alignItems: 'center',
        backgroundColor: theme.colors.board.filled,
        borderColor: theme.colors.ink,
        borderWidth: 1,
        height: 24,
        justifyContent: 'center',
        width: 24
    },
    entryCell: { backgroundColor: theme.colors.surface.raised },
    digit: { color: theme.colors.text.primary, fontSize: 13, fontWeight: '700' },
    entryDigit: { fontWeight: '400' },
    frame: {
        ...StyleSheet.absoluteFill,
        borderColor: theme.colors.text.primary,
        borderStyle: 'dotted',
        borderWidth: 2,
        margin: 1
    },
    label: { color: theme.colors.text.hint, fontSize: theme.typography.size.sm }
}));
