import { StyleSheet } from 'react-native';

export const ChallengeAcceptScreenStyles = StyleSheet.create({
    actions: {
        gap: 10,
        width: '100%'
    },
    arsenalHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 11,
        marginTop: 22,
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
    beatText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 15,
        marginTop: 8
    },
    chip: {
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 999,
        flexDirection: 'row',
        gap: 9,
        marginTop: 12,
        maxWidth: '100%',
        paddingLeft: 6,
        paddingRight: 14,
        paddingVertical: 6
    },
    chipAvatar: {
        alignItems: 'center',
        borderRadius: 13,
        height: 26,
        justifyContent: 'center',
        width: 26
    },
    chipAvatarText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 12
    },
    chipText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 13
    },
    chromeContent: {
        alignItems: 'center'
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
        borderRadius: 26,
        height: 84,
        justifyContent: 'center',
        marginBottom: 16,
        width: 84
    },
    scrollContent: {
        alignItems: 'center',
        flexGrow: 1,
        width: '100%'
    },
    scrollView: {
        flex: 1,
        width: '100%'
    },
    timeBlock: {
        alignItems: 'center',
        marginBottom: 4,
        marginTop: 26
    },
    timeLabel: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13
    },
    timeValue: {
        fontFamily: 'Inter_700Bold',
        fontSize: 56,
        fontVariant: ['tabular-nums'],
        letterSpacing: -1.5,
        marginTop: 4
    },
    timelineWrap: {
        marginTop: 22,
        width: '100%'
    },
    title: {
        fontFamily: 'Inter_700Bold',
        fontSize: 30,
        letterSpacing: -0.8,
        textAlign: 'center'
    }
});
