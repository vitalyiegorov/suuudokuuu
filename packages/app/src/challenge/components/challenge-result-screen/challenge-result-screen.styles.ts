import { StyleSheet } from 'react-native';

export const ChallengeResultScreenStyles = StyleSheet.create({
    actionMain: {
        flex: 1
    },
    actions: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        width: '100%'
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
    title: {
        fontFamily: 'Inter_700Bold',
        fontSize: 30,
        letterSpacing: -0.8,
        marginBottom: 2,
        textAlign: 'center'
    }
});
