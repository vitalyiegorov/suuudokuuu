import { StyleSheet } from 'react-native-unistyles';

export const HistoryTechniquesStyles = StyleSheet.create(() => ({
    container: {
        gap: 16,
        width: '100%'
    },
    eyebrow: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.1,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    grid: {
        gap: 14,
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        gap: 12
    },
    spacer: {
        flex: 1
    },
    summary: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 18,
        marginTop: 8,
        textAlign: 'left'
    },
    summaryName: {
        fontWeight: '800'
    }
}));
