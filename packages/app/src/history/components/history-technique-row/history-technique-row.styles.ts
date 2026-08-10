import { StyleSheet } from 'react-native-unistyles';

export const HistoryTechniqueRowStyles = StyleSheet.create(() => ({
    count: {
        fontSize: 13,
        fontVariant: ['tabular-nums'],
        fontWeight: '700'
    },
    label: {
        flex: 1,
        fontSize: 13,
        fontWeight: '700'
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        width: '100%'
    }
}));
