import { StyleSheet } from 'react-native';

export const ChallengeResultScreenStyles = StyleSheet.create({
    actionSlot: {
        flex: 1
    },
    actions: {
        alignItems: 'stretch',
        flexDirection: 'row',
        gap: 10,
        width: '100%'
    },
    chromeContent: {
        alignItems: 'center'
    },
    content: {
        alignItems: 'stretch',
        flexGrow: 1,
        gap: 14,
        maxWidth: 560,
        paddingHorizontal: 18,
        paddingTop: 16,
        width: '100%'
    },
    footer: {
        paddingBottom: 18,
        paddingHorizontal: 18,
        paddingTop: 12
    },
    pill: {
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 999,
        maxWidth: '100%',
        paddingHorizontal: 14,
        paddingVertical: 7
    },
    pillText: {
        fontFamily: 'Inter_500Medium',
        fontSize: 12.5,
        textAlign: 'center'
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
    title: {
        fontFamily: 'Inter_700Bold',
        fontSize: 30,
        letterSpacing: -0.8,
        marginBottom: 2,
        textAlign: 'center'
    }
});
