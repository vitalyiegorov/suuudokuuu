import { StyleSheet } from 'react-native';

export const ChallengeRivalChipStyles = StyleSheet.create({
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
        flexShrink: 1,
        fontFamily: 'Inter_700Bold',
        fontSize: 13
    }
});
