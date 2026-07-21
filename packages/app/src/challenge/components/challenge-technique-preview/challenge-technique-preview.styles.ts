import { StyleSheet } from 'react-native';

export const ChallengeTechniquePreviewStyles = StyleSheet.create({
    caption: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12,
        textAlign: 'center'
    },
    container: {
        alignItems: 'center',
        gap: 10,
        maxWidth: 360,
        width: '100%'
    },
    tick: {
        borderRadius: 2,
        bottom: 0,
        marginLeft: -1.5,
        position: 'absolute'
    },
    track: {
        borderRadius: 10,
        height: 30,
        overflow: 'hidden',
        position: 'relative',
        width: '100%'
    }
});
