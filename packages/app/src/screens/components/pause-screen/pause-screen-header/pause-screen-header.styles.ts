import { StyleSheet } from 'react-native';

export const PauseScreenHeaderStyles = StyleSheet.create({
    details: {
        flexShrink: 1,
        fontSize: 14,
        fontWeight: '800',
        lineHeight: 18,
        textAlign: 'right'
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        width: '100%'
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        lineHeight: 30
    },
    titleRow: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 1,
        gap: 9
    }
});
