import { StyleSheet } from 'react-native';

export const PauseScreenProgressCardStyles = StyleSheet.create({
    board: {
        alignSelf: 'center',
        flexShrink: 0
    },
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        minHeight: 112
    },
    content: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    label: {
        fontSize: 13,
        fontWeight: '800',
        lineHeight: 17,
        textAlign: 'center'
    },
    meta: {
        fontSize: 13,
        fontWeight: '800',
        lineHeight: 17,
        marginTop: 6,
        textAlign: 'center'
    },
    progress: {
        marginTop: 9,
        width: '100%'
    },
    value: {
        fontSize: 32,
        fontWeight: '900',
        lineHeight: 36,
        marginTop: 3,
        textAlign: 'center'
    }
});
