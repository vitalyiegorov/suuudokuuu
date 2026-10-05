import { StyleSheet } from 'react-native-unistyles';

export const HistoryTechniquesStyles = StyleSheet.create(() => ({
    container: {
        gap: 14,
        width: '100%'
    },
    grid: {
        gap: 14,
        width: '100%'
    },
    header: {
        gap: 2
    },
    row: {
        flexDirection: 'row',
        gap: 8
    },
    spacer: {
        flex: 1
    },
    summary: {
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 17,
        textAlign: 'left'
    },
    summaryName: {
        fontWeight: '700'
    }
}));
