import { StyleSheet } from 'react-native';

export const ChallengeStatCountBadgeStyles = StyleSheet.create({
    badge: {
        alignItems: 'center',
        borderRadius: 999,
        borderWidth: 2.5,
        justifyContent: 'center',
        minHeight: 24,
        minWidth: 24,
        paddingHorizontal: 5,
        position: 'absolute',
        right: -8,
        top: -8
    },
    count: {
        fontFamily: 'Inter_700Bold',
        fontSize: 12,
        lineHeight: 15
    }
});
