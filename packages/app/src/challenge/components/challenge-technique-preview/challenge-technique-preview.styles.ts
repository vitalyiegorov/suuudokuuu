import { StyleSheet } from 'react-native';

export const ChallengeTechniquePreviewStyles = StyleSheet.create({
    bandsInset: {
        bottom: 0,
        left: 14,
        position: 'absolute',
        right: 14,
        top: 0
    },
    bar: {
        borderRadius: 2,
        height: 15,
        width: 3
    },
    caption: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12.5
    },
    captionRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 7,
        justifyContent: 'center'
    },
    container: {
        alignItems: 'center',
        gap: 11,
        width: '100%'
    },
    tick: {
        borderRadius: 2,
        flex: 1
    },
    track: {
        alignItems: 'center',
        borderRadius: 16,
        flexDirection: 'row',
        gap: 3,
        height: 52,
        overflow: 'hidden',
        paddingHorizontal: 14,
        width: '100%'
    }
});
