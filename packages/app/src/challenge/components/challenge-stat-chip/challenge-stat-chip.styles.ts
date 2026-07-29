import { StyleSheet } from 'react-native-unistyles';

export const ChallengeStatChipStyles = StyleSheet.create({
    chip: {
        alignItems: 'center',
        borderRadius: 999,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    text: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 11.5,
        letterSpacing: 0.3
    }
});
