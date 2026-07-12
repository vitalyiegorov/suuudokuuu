import { StyleSheet } from 'react-native';

export const HistorySegmentedControlStyles = StyleSheet.create({
    container: {
        borderRadius: 18,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: 4,
        padding: 4,
        width: '100%'
    },
    label: {
        fontSize: 14,
        fontWeight: '800',
        lineHeight: 18,
        textAlign: 'center'
    },
    tab: {
        alignItems: 'center',
        borderRadius: 14,
        flex: 1,
        justifyContent: 'center',
        minHeight: 42,
        paddingHorizontal: 12
    }
});
