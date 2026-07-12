import { StyleSheet } from 'react-native';

export const ReplayTopBarStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        width: '100%'
    },
    titleRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12
    },
    accent: {
        borderRadius: 999,
        height: 30,
        width: 10
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        lineHeight: 34
    },
    closeButton: {
        height: 52,
        width: 52
    }
});
