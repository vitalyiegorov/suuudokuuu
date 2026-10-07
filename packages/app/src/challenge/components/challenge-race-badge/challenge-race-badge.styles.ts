import { StyleSheet } from 'react-native';

export const ChallengeRaceBadgeStyles = StyleSheet.create({
    badge: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: 999,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 7,
        paddingStart: 6,
        paddingEnd: 11,
        paddingVertical: 4
    },
    count: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 12.5
    }
});
