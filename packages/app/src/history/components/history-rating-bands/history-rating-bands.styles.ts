import { StyleSheet } from 'react-native-unistyles';

export const HistoryRatingBandsStyles = StyleSheet.create(() => ({
    container: {
        borderRadius: 20,
        borderWidth: StyleSheet.hairlineWidth,
        gap: 12,
        padding: 18,
        width: '100%'
    },
    rows: {
        gap: 10,
        width: '100%'
    },
    title: {
        fontSize: 14,
        fontWeight: '800'
    }
}));
