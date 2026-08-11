import { StyleSheet } from 'react-native';

export const ChallengeAcceptTimeBlockStyles = StyleSheet.create({
    beatText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 15,
        marginTop: 8
    },
    timeBlock: {
        alignItems: 'center',
        marginBottom: 4,
        marginTop: 16
    },
    timeLabel: {
        fontFamily: 'Inter_500Medium',
        fontSize: 13
    },
    timeValue: {
        fontFamily: 'Inter_700Bold',
        fontSize: 48,
        fontVariant: ['tabular-nums'],
        letterSpacing: -1.5,
        marginTop: 4
    }
});
