import { StyleSheet } from 'react-native';

export const ChallengeTechniqueCalloutStyles = StyleSheet.create({
    chip: {
        alignItems: 'center',
        borderRadius: 999,
        flexDirection: 'row',
        gap: 7,
        paddingHorizontal: 12,
        paddingVertical: 5
    },
    dot: {
        borderRadius: 4,
        height: 8,
        width: 8
    },
    rival: {
        fontFamily: 'Inter_500Medium',
        fontSize: 11,
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },
    technique: {
        fontFamily: 'Inter_700Bold',
        fontSize: 13
    }
});
