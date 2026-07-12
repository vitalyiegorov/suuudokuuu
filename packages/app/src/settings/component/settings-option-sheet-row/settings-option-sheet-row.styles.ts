import { StyleSheet } from 'react-native';

export const SettingsOptionSheetRowStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 68,
        paddingHorizontal: 28,
        paddingVertical: 11,
        width: '100%'
    },
    content: {
        flex: 1,
        gap: 4
    },
    description: {
        fontSize: 12,
        lineHeight: 17,
        textAlign: 'left'
    },
    selectedTitle: {
        fontWeight: '700'
    },
    title: {
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'left'
    }
});
