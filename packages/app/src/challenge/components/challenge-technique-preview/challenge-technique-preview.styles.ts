import { StyleSheet } from 'react-native';

export const ChallengeTechniquePreviewStyles = StyleSheet.create({
    bar: {
        borderRadius: 2,
        height: 13,
        width: 7
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
        bottom: 0,
        marginLeft: -1.5,
        position: 'absolute'
    },
    track: {
        borderRadius: 12,
        height: 34,
        overflow: 'hidden',
        position: 'relative',
        width: '100%'
    }
});
