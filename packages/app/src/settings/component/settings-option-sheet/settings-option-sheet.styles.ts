import { StyleSheet } from 'react-native';

export const SettingsOptionSheetStyles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        flex: 1,
        paddingTop: 18
    },
    description: {
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'left'
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginHorizontal: 28
    },
    header: {
        gap: 6,
        paddingBottom: 16,
        paddingHorizontal: 28
    },
    group: {
        overflow: 'hidden',
        width: '100%'
    },
    item: {
        width: '100%'
    },
    list: {
        flex: 1,
        width: '100%'
    },
    listContent: {
        paddingBottom: 28,
        width: '100%'
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'left'
    }
});
