import { StyleSheet } from 'react-native';

export const ChallengeRaceStatusStyles = StyleSheet.create({
    avatar: {
        alignItems: 'center',
        borderRadius: 15,
        height: 30,
        justifyContent: 'center',
        width: 30
    },
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 9
    },
    name: {
        fontFamily: 'Inter_700Bold',
        fontSize: 15
    },
    status: {
        fontFamily: 'Inter_700Bold',
        fontSize: 15
    }
});
