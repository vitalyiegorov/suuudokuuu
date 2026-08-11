import { StyleSheet } from 'react-native';

export const ChallengeAcceptScreenStyles = StyleSheet.create({
    arsenalHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 30,
        paddingHorizontal: 2
    },
    arsenalLabel: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        letterSpacing: 0.9,
        textTransform: 'uppercase'
    },
    arsenalTag: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12
    },
    content: {
        alignItems: 'stretch',
        maxWidth: 560,
        paddingHorizontal: 20,
        paddingTop: 16,
        width: '100%'
    },
    medallion: {
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 22,
        height: 72,
        justifyContent: 'center',
        marginBottom: 12,
        width: 72
    },
    timelineWrap: {
        marginTop: 16,
        width: '100%'
    },
    title: {
        fontFamily: 'Inter_700Bold',
        fontSize: 30,
        letterSpacing: -0.8,
        textAlign: 'center'
    }
});
