import { StyleSheet } from 'react-native-unistyles';

export const ChallengeRecordTapeStyles = StyleSheet.create({
    track: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 2,
        height: 24,
        position: 'relative',
        width: '100%'
    },
    baseline: {
        borderRadius: 1,
        height: 1.5,
        left: 0,
        marginTop: -0.75,
        opacity: 0.13,
        position: 'absolute',
        right: 0,
        top: '50%'
    },
    tick: {
        borderRadius: 2,
        flex: 1
    },
    awaySlot: {
        alignSelf: 'stretch',
        borderRadius: 2,
        flex: 1,
        opacity: 0.16
    }
});
