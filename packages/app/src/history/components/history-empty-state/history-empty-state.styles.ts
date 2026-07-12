import { StyleSheet } from 'react-native';

export const HistoryEmptyStateStyles = StyleSheet.create({
    container: {
        borderRadius: 24,
        borderWidth: StyleSheet.hairlineWidth,
        gap: 8,
        paddingHorizontal: 18,
        paddingVertical: 22,
        width: '100%'
    },
    message: {
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'left'
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 27,
        textAlign: 'left'
    }
});
