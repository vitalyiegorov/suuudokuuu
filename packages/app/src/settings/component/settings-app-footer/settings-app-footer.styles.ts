import { StyleSheet } from 'react-native';

export const SettingsAppFooterStyles = StyleSheet.create({
    action: {
        alignItems: 'center',
        borderRadius: 999,
        borderWidth: StyleSheet.hairlineWidth,
        minHeight: 38,
        paddingHorizontal: 16,
        paddingVertical: 9
    },
    actionText: {
        fontSize: 13,
        fontWeight: '800',
        lineHeight: 17
    },
    actions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        width: '100%'
    },
    container: {
        alignItems: 'center',
        gap: 18,
        paddingBottom: 6,
        paddingTop: 2,
        width: '100%'
    },
    supportButton: {
        alignItems: 'center',
        borderRadius: 22,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 66,
        paddingHorizontal: 20,
        paddingVertical: 14,
        width: '100%'
    },
    supportText: {
        flex: 1,
        fontSize: 20,
        fontWeight: '900',
        lineHeight: 25,
        textAlign: 'left'
    },
    version: {
        fontSize: 16,
        fontWeight: '900',
        lineHeight: 21,
        textAlign: 'center'
    }
});
