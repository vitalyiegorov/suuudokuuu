import { StyleSheet } from 'react-native-unistyles';

export const HistoryTotalsCardStyles = StyleSheet.create(() => ({
    container: {
        width: '100%'
    },
    item: {
        gap: 4,
        width: 68
    },
    label: {
        fontSize: 10,
        letterSpacing: 0.4
    },
    separator: {
        height: 32,
        marginHorizontal: 0
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
