import { StyleSheet } from 'react-native-unistyles';

export const HistoryTotalsCardStyles = StyleSheet.create(() => ({
    container: {
        gap: 14,
        width: '100%'
    },
    item: {
        flex: 1,
        gap: 4,
        width: 'auto'
    },
    label: {
        fontSize: 10,
        letterSpacing: 0.4
    },
    secondaryRow: {
        flexDirection: 'row',
        width: '100%'
    },
    secondaryStrip: {
        paddingHorizontal: 0,
        paddingVertical: 0
    },
    separator: {
        height: 32,
        marginHorizontal: 0
    },
    spacer: {
        flex: 1
    },
    strip: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        width: '100%'
    },
    value: {
        fontSize: 24,
        letterSpacing: -0.5,
        lineHeight: 27
    }
}));
